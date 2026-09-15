import "dotenv/config";

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";

import adminRouter from "./routes/admin.js";
import { sendLeadNotifications } from "./services/emailService.js";

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const hasDist =
  fs.existsSync(path.join(distDir, "index.html"));

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

// Trust the reverse proxy one hop (Nginx on Hostinger) so rate limiting and
// lead IP audit see the real client IP via X-Forwarded-For.
app.set("trust proxy", 1);

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
  if (hasDist) {
    res.setHeader("Cache-Control", "no-cache");
    return res.sendFile(path.join(distDir, "index.html"));
  }
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
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("content_key, content_value")
      .eq("is_published", true);

    if (error) {
      console.error("Public content error:", error);
      return res.status(500).json({ success: false, message: "Unable to load content" });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Public content error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/services", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Public services error:", error);
      return res.status(500).json({ success: false, message: "Unable to load services" });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Public services error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/services/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const { data: subItems } = await supabase
      .from("service_items")
      .select("*")
      .eq("service_id", service.id)
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    const subIds = (subItems || []).map((s) => s.id);

    // Visual Showcase + Cargo & Applications for the main service.
    // Wrapped so a missing table (migration not yet applied) never breaks the
    // full service page — the frontend falls back to legacy JSONB content.
    const safePick = (rows) => (Array.isArray(rows) ? rows : []);

    const pickShowcaseFor = async (column, value) => {
      try {
        const { data } = await supabase
          .from("service_visual_showcase")
          .select("*")
          .eq(column, value)
          .eq("is_published", true)
          .order("display_order", { ascending: true });
        return safePick(data);
      } catch (err) {
        console.warn("[services] service_visual_showcase unavailable:", err?.message);
        return [];
      }
    };

    const pickCargoFor = async (column, value) => {
      try {
        const { data } = await supabase
          .from("service_cargo_applications")
          .select("*")
          .eq(column, value)
          .eq("is_published", true)
          .order("display_order", { ascending: true });
        return safePick(data);
      } catch (err) {
        console.warn("[services] service_cargo_applications unavailable:", err?.message);
        return [];
      }
    };

    const mainShowcase = await pickShowcaseFor("service_id", service.id);
    const mainCargo = await pickCargoFor("service_id", service.id);

    let subShowcase = [];
    let subCargo = [];
    if (subIds.length > 0) {
      try {
        const [ss, sc] = await Promise.all([
          supabase
            .from("service_visual_showcase")
            .select("*")
            .in("service_item_id", subIds)
            .eq("is_published", true)
            .order("display_order", { ascending: true })
            .then(({ data }) => safePick(data)),
          supabase
            .from("service_cargo_applications")
            .select("*")
            .in("service_item_id", subIds)
            .eq("is_published", true)
            .order("display_order", { ascending: true })
            .then(({ data }) => safePick(data)),
        ]);
        subShowcase = ss;
        subCargo = sc;
      } catch (err) {
        console.warn("[services] sub showcase/cargo unavailable:", err?.message);
        subShowcase = [];
        subCargo = [];
      }
    }

    const attach = (sub) => ({
      ...sub,
      showcaseItems: subShowcase.filter((row) => row.service_item_id === sub.id),
      cargoApplications: subCargo.filter((row) => row.service_item_id === sub.id),
    });

    return res.json({
      success: true,
      data: {
        ...service,
        showcaseItems: mainShowcase,
        cargoApplications: mainCargo,
        subServices: (subItems || []).map(attach),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/services/:serviceSlug/:subSlug", async (req, res) => {
  try {
    const { serviceSlug, subSlug } = req.params;
    const { data: service } = await supabase
      .from("services")
      .select("id, slug, title")
      .eq("slug", serviceSlug)
      .eq("is_published", true)
      .maybeSingle();

    if (!service) {
      return res.status(404).json({ success: false, message: "Parent service not found" });
    }

    const { data: subItem, error } = await supabase
      .from("service_items")
      .select("*")
      .eq("service_id", service.id)
      .eq("slug", subSlug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !subItem) {
      return res.status(404).json({ success: false, message: "Sub-service not found" });
    }

    const safePick = (rows) => (Array.isArray(rows) ? rows : []);
    let showcaseItems = [];
    let cargoApplications = [];
    try {
      const [ss, sc] = await Promise.all([
        supabase
          .from("service_visual_showcase")
          .select("*")
          .eq("service_item_id", subItem.id)
          .eq("is_published", true)
          .order("display_order", { ascending: true })
          .then(({ data }) => safePick(data)),
        supabase
          .from("service_cargo_applications")
          .select("*")
          .eq("service_item_id", subItem.id)
          .eq("is_published", true)
          .order("display_order", { ascending: true })
          .then(({ data }) => safePick(data)),
      ]);
      showcaseItems = ss;
      cargoApplications = sc;
    } catch (err) {
      console.warn("[services] sub showcase/cargo unavailable:", err?.message);
      showcaseItems = [];
      cargoApplications = [];
    }

    return res.json({
      success: true,
      data: {
        ...subItem,
        showcaseItems: showcaseItems || [],
        cargoApplications: cargoApplications || [],
        parentService: service,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get("/api/industries", async (_req, res) => {
  try {
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
  } catch (err) {
    console.error("Public industries error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/clients", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Public clients error:", error);
      return res.status(500).json({ success: false, message: "Unable to load clients" });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Public clients error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/trusted-network", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("trusted_network")
      .select("id, name, logo, logo_alt")
      .eq("is_published", true)
      .not("logo", "is", null)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Public trusted-network error:", error);
      return res.status(500).json({ success: false, message: "Unable to load trusted network" });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Public trusted-network error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/service-items", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("service_items")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Public service-items error:", error);
      return res.status(500).json({ success: false, message: "Unable to load service items" });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Public service-items error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
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
  ["leadership", "leadership"],
  ["core-values", "core_values"],
];

for (const [path, table] of publicCollections) {
  app.get(`/api/${path}`, async (_req, res) => {
    try {
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
    } catch (err) {
      console.error(`Public ${path} error:`, err);
      return res.status(500).json({ success: false, message: `Server error loading ${path}` });
    }
  });
}

app.get("/api/site-settings", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value, setting_type")
      .eq("is_public", true);

    if (error) {
      console.error("Public site settings error:", error);
      return res.status(500).json({ success: false, message: "Unable to load site settings" });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Public site settings error:", err);
    return res.status(500).json({ success: false, message: "Server error loading site settings" });
  }
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
// FRONTEND (production build hosted alongside the API)
// =====================================================

if (hasDist) {
  app.use(
    express.static(distDir, {
      index: false,
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    })
  );

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(distDir, "index.html"));
  });
}

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
    if (
      err?.type === "entity.parse.failed" ||
      (err instanceof SyntaxError &&
        err?.status === 400 &&
        "body" in err)
    ) {
      return res.status(400).json({
        ok: false,
        error: "Malformed JSON body",
      });
    }

    if (
      err?.type === "entity.too.large"
    ) {
      return res.status(413).json({
        ok: false,
        error: "Request body too large",
      });
    }

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