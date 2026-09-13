import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "node:url";

console.log("cwd:", process.cwd());
console.log("__dirname:", fileURLToPath(new URL(".", import.meta.url)));

try {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64").toString());
  console.log("env role:", payload.role, "ref:", payload.ref);
} catch (e) {
  console.log("env role: PARSE FAIL", e.message);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const jti = "probe-" + randomUUID();
const { error } = await supabase
  .from("admin_sessions")
  .insert({ jti, user_id: "884cde49-07a2-4d1f-beb7-1b038feebff4", email: "web.grow.india07@gmail.com", expires_at: new Date(Date.now() + 3600_000).toISOString() });
if (error) {
  console.log("PROBE INSERT:", error.message);
} else {
  console.log("PROBE INSERT: OK");
  await supabase.from("admin_sessions").delete().eq("jti", jti);
  console.log("PROBE CLEANUP: OK");
}