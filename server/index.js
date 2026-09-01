import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";

import adminRouter from "./routes/admin.js";
import { sendLeadNotifications } from "./services/emailService.js";

const app = express();

const PORT = process.env.PORT || 5000;

// SUPABASE

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
  );
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

// MIDDLEWARE

app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

const corsOrigins = (
  process.env.CORS_ORIGIN ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.includes("*")
      ? true
      : corsOrigins,
    credentials: true,
  })
);

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    ok: false,
    error:
      "Too many inquiries — please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// HELPERS

function generateReferenceNumber() {
  return `ALQ-${Math.floor(
    100000 + Math.random() * 900000
  )}`;
}

function validateLead(body) {
  const errors = [];

  const {
    name,
    company,
    email,
    phone,
    service,
  } = body;

  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2
  ) {
    errors.push(
      "Invalid or missing 'name'"
    );
  }

  if (
    !company ||
    typeof company !== "string" ||
    company.trim().length < 2
  ) {
    errors.push(
      "Invalid or missing 'company'"
    );
  }

  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    )
  ) {
    errors.push(
      "Invalid or missing 'email'"
    );
  }

  if (
    !phone ||
    typeof phone !== "string" ||
    !/^[+]?[0-9\s-]{10,20}$/.test(
      phone.trim()
    )
  ) {
    errors.push(
      "Invalid or missing 'phone'"
    );
  }

  if (
    !service ||
    typeof service !== "string" ||
    service.trim().length < 2
  ) {
    errors.push(
      "Invalid or missing 'service'"
    );
  }

  return errors;
}

// PUBLIC

app.get("/", (_req, res) => {
  res.json({
    service:
      "Arrowline Logistics API",
    status: "ok",
    version: "1.0.0",
    tagline:
      "Moving Possibilities. Delivering Trust.",
  });
});

app.get("/health", (_req, res) => {
  const status = {
    service:
      "Arrowline Logistics API",
    version: "1.0.0",
    ok: true,
    checks: {
      supabase:
        supabaseUrl &&
        supabaseServiceRoleKey
          ? "configured"
          : "missing",

      resend:
        process.env.RESEND_API_KEY
          ? "configured"
          : "missing",

      admin:
        process.env.ADMIN_API_KEY
          ? "configured"
          : "missing",
    },
    uptime: process.uptime(),
    timestamp:
      new Date().toISOString(),
  };

  if (
    status.checks.supabase !==
      "configured" ||
    status.checks.resend !==
      "configured" ||
    status.checks.admin !==
      "configured"
  ) {
    status.ok = false;
  }

  res
    .status(status.ok ? 200 : 503)
    .json(status);
});

app.get("/api/content", async (_req, res) => {
  const { data, error } = await supabase
    .from("site_content")
    .select("content_key, content_value")
    .eq("is_published", true);

  if (error) {
    console.error("Public content error:", error);
    return res.status(500).json({ success: false, message: "Unable to load content" });
  }

  return res.json({ success: true, data: data || [] });
});

app.get("/api/services", async (_req, res) => {
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, short_description, full_description, icon, hero_image, cta_text, cta_url")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Public services error:", error);
    return res.status(500).json({ success: false, message: "Unable to load services" });
  }

  return res.json({ success: true, data: data || [] });
});

app.get("/api/industries", async (_req, res) => {
  const { data, error } = await supabase
    .from("industries")
    .select("id, slug, title, description, icon, cargo_types, image")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Public industries error:", error);
    return res.status(500).json({ success: false, message: "Unable to load industries" });
  }

  return res.json({ success: true, data: data || [] });
});

const publicCollections = [
  ["case-studies", "case_studies"],
  ["gallery", "gallery_items"],
  ["locations", "locations"],
  ["faqs", "faqs"],
  ["testimonials", "testimonials"],
  ["blog-categories", "blog_categories"],
  ["blog-posts", "blog_posts"],
  ["social-videos", "social_videos"],
  ["statistics", "statistics"],
];

for (const [path, table] of publicCollections) {
  app.get(`/api/${path}`, async (_req, res) => {
    let query = supabase.from(table).select("*").eq("is_published", true);
    if (!["blog-categories"].includes(path)) {
      query = query.order("display_order", { ascending: true });
    }
    const { data, error } = await query;

    if (error) {
      console.error(`Public ${path} error:`, error);
      return res.status(500).json({ success: false, message: `Unable to load ${path}` });
    }

    return res.json({ success: true, data: data || [] });
  });
}

app.get("/api/site-settings", async (_req, res) => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("setting_key, setting_value, setting_type")
    .eq("is_public", true);

  if (error) {
    console.error("Public site settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load site settings" });
  }

  return res.json({ success: true, data: data || [] });
});

// LEAD

app.post(
  "/api/lead",
  leadLimiter,
  async (req, res) => {
    try {
      const errors =
        validateLead(req.body);

      if (errors.length) {
        return res.status(400).json({
          ok: false,
          errors,
        });
      }

      const referenceNumber =
        generateReferenceNumber();

      const ip =
        req.headers[
          "x-forwarded-for"
        ]
          ?.split(",")[0]
          .trim() ||
        req.socket.remoteAddress ||
        "";

      const leadData = {
        reference_number:
          referenceNumber,

        name: req.body.name.trim(),

        company:
          req.body.company.trim(),

        email:
          req.body.email
            .trim()
            .toLowerCase(),

        phone:
          req.body.phone.trim(),

        service:
          req.body.service.trim(),

        message:
          (req.body.message || "")
            .trim(),

        source: "website",

        ip_address: ip,

        user_agent:
          req.headers[
            "user-agent"
          ] || "",

        status: "new",
      };

      const {
        data: lead,
        error: insertError,
      } = await supabase
        .from("leads")
        .insert(leadData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      let emailSent = false;

      try {
        await sendLeadNotifications(
          lead
        );

        emailSent = true;

        await supabase
          .from("leads")
          .update({
            email_sent: true,
            email_sent_at:
              new Date().toISOString(),
          })
          .eq("id", lead.id);
      } catch (mailErr) {
        console.error(
          "⚠️ Email send failed:",
          mailErr.message
        );
      }

      return res.status(201).json({
        ok: true,
        referenceNumber,
        storedInDatabase: true,
        emailSent,
        message:
          "Inquiry received. Our routing team will respond within 2 hours.",
      });
    } catch (error) {
      console.error(
        "❌ /api/lead error:",
        error
      );

      return res.status(500).json({
        ok: false,
        error: "Server error",
      });
    }
  }
);

// =====================================================
// ADMIN ROUTES
// =====================================================

app.use("/api/admin", adminRouter);

// =====================================================
// 404  
// =====================================================

app.use(
  (_req, res) => {
    res.status(404).json({
      ok: false,
      error: "Route not found",
    });
  }
);

// =====================================================
// ERROR
// =====================================================

app.use(
  (err, _req, res, _next) => {
    console.error(
      "❌ Unhandled error:",
      err
    );

    res.status(500).json({
      ok: false,
      error:
        "Internal server error",
    });
  }
);

// =====================================================
// START
// =====================================================

app.listen(
  PORT,
  () => {
    console.log(
      `🚛 Arrowline API running on http://localhost:${PORT}`
    );

    console.log(
      `   Health check: http://localhost:${PORT}/health`
    );

    console.log(
      `   Admin API: http://localhost:${PORT}/api/admin`
    );
  }
);