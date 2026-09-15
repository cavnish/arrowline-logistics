import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import "dotenv/config";

const JWT_SECRET = process.env.ADMIN_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Use a fixed dummy UUID for user_id since adminAuth doesn't validate it
const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000001";

async function run() {
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const token = jwt.sign(
    { role: "admin", email: ADMIN_EMAIL.toLowerCase(), jti },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  
  // Insert session with dummy user_id
  const { error: insertError } = await supabase
    .from("admin_sessions")
    .insert({
      jti,
      user_id: DUMMY_USER_ID,
      email: ADMIN_EMAIL.toLowerCase(),
      expires_at: expiresAt.toISOString(),
      revoked_at: null
    });
  
  if (insertError) {
    console.error("Session insert error:", insertError);
    return;
  }
  
  console.log("Admin token:", token);
  console.log("Cookie: admin_token=" + token);
  console.log("Email:", ADMIN_EMAIL);
  console.log("JTI:", jti);
  console.log("Expires:", expiresAt.toISOString());
}

run();