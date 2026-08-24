/**
 * VERCEL SERVERLESS FUNCTION — POST /api/lead
 *
 * Deployed automatically by Vercel when this file exists.
 * Accepts customer inquiries, saves them to MongoDB Atlas, and sends
 * email notifications to the Arrowline team + acknowledgement to the
 * customer.
 *
 * ---------- DEPLOYMENT ----------
 * 1. Deploy your Vite frontend to Vercel as normal.
 * 2. In the Vercel dashboard → Project → Settings → Environment Variables,
 *    add ALL of the following:
 *
 *       MONGODB_URI       = mongodb+srv://...@cluster0.3kftk1c.mongodb.net/arrowline?...
 *       SMTP_HOST         = smtp.gmail.com
 *       SMTP_PORT         = 587
 *       SMTP_USER         = your-email@gmail.com
 *       SMTP_PASS         = your-16-char-app-password
 *       FROM_EMAIL        = mundra@arrowlinelogistics.in
 *       NOTIFY_EMAILS     = mundra@arrowlinelogistics.in,vinay@arrowlinelogistics.in
 *
 * 3. In your frontend .env, set:
 *       VITE_API_URL=          (leave empty — Vercel will route /api/lead to this file)
 *    OR if deploying frontend elsewhere:
 *       VITE_API_URL=https://your-vercel-app.vercel.app
 *
 * 4. Redeploy. Done.
 *
 * ---------- REQUIRED PACKAGES ----------
 * Run at project root:
 *    npm install mongoose nodemailer
 * (Vercel will install them automatically on deploy.)
 */

import mongoose from "mongoose";
import nodemailer from "nodemailer";

// ============================================================
// SIMPLE IN-MEMORY RATE LIMITING (per serverless instance)
// ============================================================
// Note: This is best-effort per-instance. For production-grade
// rate limiting across all instances, use Vercel's built-in
// rate limiting or an external store (e.g. Upstash Redis).
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 20; // 20 inquiries per IP per hour
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// ============================================================
// MONGO CONNECTION CACHING (critical for serverless)
// ============================================================
// Serverless functions cold-start frequently. Cache the mongoose
// connection across invocations to avoid reconnecting every time.
let cachedConnection = null;

async function connectToMongo() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");
  cachedConnection = await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
  return cachedConnection;
}

// ============================================================
// LEAD SCHEMA / MODEL
// ============================================================
const leadSchema = new mongoose.Schema(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 200 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      index: true,
    },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    service: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, default: "", maxlength: 2000 },
    source: { type: String, default: "website" },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "won", "lost"],
      default: "new",
      index: true,
    },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

// ============================================================
// EMAIL SENDER
// ============================================================
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: parseInt(process.env.SMTP_PORT || "587", 10) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildInternalEmail(lead) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#FEF9F0;">
  <div style="max-width:640px;margin:0 auto;background:#fff;">
    <div style="background:#1E3A8A;color:#fff;padding:24px;">
      <h1 style="margin:0;font-size:22px;">🚛 New Shipping Inquiry — ARROWLINE LOGISTICS</h1>
      <div style="opacity:.8;margin-top:8px;font-size:12px;">Received via website contact form</div>
    </div>
    <div style="height:4px;background:#FF7A00;"></div>
    <div style="padding:32px 24px;color:#334155;line-height:1.6;">
      <p>A new customer has submitted a shipping quote request. Please respond within 2 hours.</p>
      <div style="display:inline-block;padding:8px 16px;background:#FEF9F0;border:2px solid #FF7A00;border-radius:999px;font-weight:bold;color:#FF7A00;letter-spacing:2px;">REF: ${lead.referenceNumber}</div>
      <h2 style="color:#1E3A8A;font-size:18px;margin-top:24px;">Client Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:20px;">
        <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;text-transform:uppercase;font-size:11px;width:40%;letter-spacing:1px;">Name</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#1E3A8A;font-weight:600;">${esc(lead.name)}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Company</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#1E3A8A;font-weight:600;">${esc(lead.company)}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Email</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#1E3A8A;font-weight:600;"><a href="mailto:${esc(lead.email)}" style="color:#FF7A00;">${esc(lead.email)}</a></td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Phone</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#1E3A8A;font-weight:600;"><a href="tel:${esc(lead.phone)}" style="color:#FF7A00;">${esc(lead.phone)}</a></td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Service</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#1E3A8A;font-weight:600;">${esc(lead.service)}</td></tr>
      </table>
      ${lead.message ? `<h2 style="color:#1E3A8A;font-size:18px;margin-top:24px;">Cargo Details & Message</h2><div style="background:#FEF9F0;border-left:4px solid #FF7A00;padding:16px;margin-top:16px;font-style:italic;color:#475569;border-radius:4px;">${esc(lead.message)}</div>` : ""}
      <a href="mailto:${esc(lead.email)}?subject=Re:%20Your%20Arrowline%20Inquiry%20${lead.referenceNumber}" style="display:inline-block;padding:12px 24px;background:#FF7A00;color:#fff;text-decoration:none;font-weight:bold;border-radius:8px;margin-top:16px;">Reply to Client →</a>
    </div>
    <div style="background:#f1f5f9;padding:20px 24px;text-align:center;font-size:11px;color:#64748b;">© ${new Date().getFullYear()} Arrowline Logistics · Moving Possibilities. Delivering Trust.</div>
  </div>
</body></html>`;
}

function buildClientEmail(lead) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#FEF9F0;">
  <div style="max-width:640px;margin:0 auto;background:#fff;">
    <div style="background:#1E3A8A;color:#fff;padding:32px 24px;text-align:center;">
      <div style="font-size:26px;font-weight:900;letter-spacing:2px;">ARROWLINE <span style="color:#FF7A00;">▶</span></div>
      <div style="font-size:10px;letter-spacing:3px;opacity:.8;margin-top:4px;">— LOGISTICS —</div>
      <div style="font-size:12px;font-style:italic;opacity:.9;margin-top:8px;">Moving Possibilities. Delivering Trust.</div>
    </div>
    <div style="height:4px;background:#FF7A00;"></div>
    <div style="padding:32px 24px;color:#334155;line-height:1.7;">
      <h1 style="color:#1E3A8A;font-size:22px;margin-top:0;">Thank you, ${esc(lead.name)}! 🙏</h1>
      <p>We have received your shipping inquiry and our routing team at Mundra Port is already analyzing your requirements. Please save the reference number below for future correspondence:</p>
      <div style="text-align:center;"><div style="display:inline-block;padding:10px 20px;background:#FEF9F0;border:2px solid #FF7A00;border-radius:999px;font-weight:bold;color:#FF7A00;letter-spacing:2px;margin:16px 0;">REF: ${lead.referenceNumber}</div></div>
      <h2 style="color:#FF7A00;font-size:14px;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">What Happens Next?</h2>
      <div style="background:#FEF9F0;border-radius:12px;padding:20px;margin-top:24px;">
        <div style="margin-bottom:12px;"><span style="width:28px;height:28px;background:#FF7A00;color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;margin-right:12px;">1</span><strong style="color:#1E3A8A;">Analysis (0-1 hour):</strong> Our planners review your cargo details.</div>
        <div style="margin-bottom:12px;"><span style="width:28px;height:28px;background:#FF7A00;color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;margin-right:12px;">2</span><strong style="color:#1E3A8A;">Quotation (within 2 hours):</strong> You'll receive customized tariffs.</div>
        <div><span style="width:28px;height:28px;background:#FF7A00;color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;margin-right:12px;">3</span><strong style="color:#1E3A8A;">Dispatch:</strong> Once approved, our team assigns fleet and confirms.</div>
      </div>
    </div>
    <div style="background:#1E3A8A;color:#fff;padding:20px 24px;">
      <div style="font-size:10px;letter-spacing:2px;color:#FFB366;font-weight:bold;margin-bottom:8px;">STAY CONNECTED</div>
      <div style="font-size:13px;">📞 <a href="tel:+919766262612" style="color:#FFB366;text-decoration:none;">+91 9766262612</a> · ✉️ <a href="mailto:mundra@arrowlinelogistics.in" style="color:#FFB366;text-decoration:none;">mundra@arrowlinelogistics.in</a></div>
      <div style="font-size:11px;opacity:.7;margin-top:8px;">Office 204, Portview Complex, Adani House, Mundra, Kutch, Gujarat 370421</div>
    </div>
    <div style="background:#f1f5f9;padding:16px 24px;text-align:center;font-size:11px;color:#64748b;">© ${new Date().getFullYear()} Arrowline Logistics Pvt Ltd. All rights reserved.</div>
  </div>
</body></html>`;
}

async function sendNotifications(lead) {
  const t = getTransporter();
  const notifyList = (process.env.NOTIFY_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!notifyList.length) throw new Error("NOTIFY_EMAILS env var is empty");

  await t.sendMail({
    from: `"Arrowline Website" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: notifyList.join(", "),
    replyTo: lead.email,
    subject: `🚛 New Inquiry ${lead.referenceNumber} — ${lead.company}`,
    html: buildInternalEmail(lead),
  });

  await t.sendMail({
    from: `"Arrowline Logistics" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: lead.email,
    subject: `✅ We received your inquiry — Ref ${lead.referenceNumber}`,
    html: buildClientEmail(lead),
  });
}

// ============================================================
// VERCEL HANDLER
// ============================================================
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    // Rate limit check
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown";
    if (isRateLimited(clientIp)) {
      return res.status(429).json({ ok: false, error: "Too many inquiries — please try again later." });
    }

    const { name, company, email, phone, service, message } = req.body || {};

    // Validate
    const errors = [];
    if (!name || String(name).trim().length < 2) errors.push("Invalid name");
    if (!company || String(company).trim().length < 2) errors.push("Invalid company");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Invalid email");
    if (!phone || !/^[+]?[0-9\s-]{10,20}$/.test(phone)) errors.push("Invalid phone");
    if (!service) errors.push("Missing service");
    if (errors.length) return res.status(400).json({ ok: false, errors });

    await connectToMongo();

    const referenceNumber = `ALQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    const lead = await Lead.create({
      referenceNumber,
      name: name.trim(),
      company: company.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service.trim(),
      message: (message || "").trim(),
      source: "website",
      ipAddress: ip,
      userAgent: req.headers["user-agent"] || "",
      status: "new",
    });

    let emailSent = false;
    try {
      await sendNotifications(lead);
      emailSent = true;
      lead.emailSent = true;
      lead.emailSentAt = new Date();
      await lead.save();
    } catch (mailErr) {
      console.error("Email send failed:", mailErr.message);
    }

    return res.status(201).json({
      ok: true,
      referenceNumber,
      storedInDatabase: true,
      emailSent,
      message: "Inquiry received. Our routing team will respond within 2 hours.",
    });
  } catch (err) {
    console.error("/api/lead error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
