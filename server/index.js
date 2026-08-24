import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import { sendLeadNotifications } from "./services/emailService.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- SUPABASE ----------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "50kb" }));

const corsOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.includes("*") ? true : corsOrigins,
    credentials: true,
  })
);

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { ok: false, error: "Too many inquiries — please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------- HELPERS ----------
function generateReferenceNumber() {
  return `ALQ-${Math.floor(100000 + Math.random() * 900000)}`;
}

function validateLead(body) {
  const errors = [];
  const { name, company, email, phone, service } = body;
  if (!name || typeof name !== "string" || name.trim().length < 2)
    errors.push("Invalid or missing 'name'");
  if (!company || typeof company !== "string" || company.trim().length < 2)
    errors.push("Invalid or missing 'company'");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Invalid or missing 'email'");
  if (!phone || !/^[+]?[0-9\s-]{10,20}$/.test(phone))
    errors.push("Invalid or missing 'phone'");
  if (!service || typeof service !== "string")
    errors.push("Invalid or missing 'service'");
  return errors;
}

// ---------- ROUTES ----------
app.get("/", (_req, res) => {
  res.json({
    service: "Arrowline Logistics API",
    status: "ok",
    version: "1.0.0",
    tagline: "Moving Possibilities. Delivering Trust.",
  });
});

app.get("/health", (_req, res) => {
  const status = {
    service: "Arrowline Logistics API",
    version: "1.0.0",
    ok: true,
    checks: {
      supabase: supabaseUrl && supabaseServiceRoleKey ? "configured" : "missing",
      resend: process.env.RESEND_API_KEY ? "configured" : "missing",
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  if (status.checks.supabase !== "configured" || status.checks.resend !== "configured") {
    status.ok = false;
  }

  res.status(status.ok ? 200 : 503).json(status);
});

app.post("/api/lead", leadLimiter, async (req, res) => {
  try {
    const errors = validateLead(req.body);
    if (errors.length) {
      return res.status(400).json({ ok: false, errors });
    }

    const referenceNumber = generateReferenceNumber();
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "";

    const leadData = {
      reference_number: referenceNumber,
      name: req.body.name.trim(),
      company: req.body.company.trim(),
      email: req.body.email.trim().toLowerCase(),
      phone: req.body.phone.trim(),
      service: req.body.service.trim(),
      message: (req.body.message || "").trim(),
      source: "website",
      ip_address: ip,
      user_agent: req.headers["user-agent"] || "",
      status: "new",
    };

    // 1. Save to Supabase
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Send notification emails (fire-and-forget with status tracking)
    let emailSent = false;
    try {
      await sendLeadNotifications(lead);
      emailSent = true;
      await supabase
        .from("leads")
        .update({
          email_sent: true,
          email_sent_at: new Date().toISOString(),
        })
        .eq("id", lead.id);
    } catch (mailErr) {
      console.error("⚠️  Email send failed:", mailErr.message);
    }

    return res.status(201).json({
      ok: true,
      referenceNumber,
      storedInDatabase: true,
      emailSent,
      message: "Inquiry received. Our routing team will respond within 2 hours.",
    });
  } catch (err) {
    console.error("❌ /api/lead error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (process.env.ADMIN_API_KEY && apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({ ok: true, count: leads.length, leads });
  } catch (err) {
    console.error("❌ /api/leads error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ---------- 404 & ERROR HANDLING ----------
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(500).json({ ok: false, error: "Internal server error" });
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`🚛 Arrowline API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});