import "dotenv/config";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const JWT_SECRET = process.env.ADMIN_API_KEY;

if (!JWT_SECRET) {
  console.error("❌ ADMIN_API_KEY is missing in .env");
  process.exit(1);
}

// Server-side session registry (public.admin_sessions) accessed with the
// service role key. RLS is bypassed for service_role, which is fine here
// because this module only ever runs inside the protected Express backend.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false },
      })
    : null;

// Comma-separated allowlist. ADMIN_EMAIL is the primary administrator.
function getAdminEmails() {
  const primary = (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const secondary = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return new Set([...primary, ...secondary].map((e) => e.toLowerCase()));
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export function isAllowedAdminEmail(email) {
  if (!email || typeof email !== "string") return false;
  return getAdminEmails().has(email.trim().toLowerCase());
}

export function generateAdminToken(email) {
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const token = jwt.sign(
    {
      role: "admin",
      email: email.trim().toLowerCase(),
      jti,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, jti, expiresAt };
}

async function isValidSession(jti, email) {
  if (!supabase) {
    console.error("❌ Supabase not configured — cannot validate admin session.");
    return false;
  }

  const { data, error } = await supabase
    .from("admin_sessions")
    .select("jti, email, expires_at, revoked_at")
    .eq("jti", jti)
    .maybeSingle();

  if (error) {
    console.error("Admin session lookup error:", error.message);
    return false;
  }

  if (!data) return false;
  if (data.revoked_at) return false;
  if (new Date(data.expires_at).getTime() <= Date.now()) return false;

  // Session must belong to the same admin identity embedded in the JWT.
  return data.email.toLowerCase() === email.toLowerCase();
}

export async function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Admin token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid",
    });
  }

  if (decoded?.role !== "admin" || typeof decoded?.jti !== "string") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!isAllowedAdminEmail(decoded.email)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  const sessionValid = await isValidSession(decoded.jti, decoded.email);
  if (!sessionValid) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid",
    });
  }

  req.admin = { email: decoded.email, jti: decoded.jti };
  next();
}

export async function revokeSession(jti) {
  if (!jti || !supabase) return;
  const { error } = await supabase
    .from("admin_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("jti", jti);
  if (error) {
    console.warn("Admin session revoke failed:", error.message);
  }
}