import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const jti = "diag-" + randomUUID();
const expiresAt = new Date(Date.now() + 3600_000).toISOString();

const { data: inserted, error: insertError } = await supabase
  .from("admin_sessions")
  .insert({ jti, user_id: "884cde49-07a2-4d1f-beb7-1b038feebff4", email: "web.grow.india07@gmail.com", expires_at: expiresAt })
  .select()
  .single();

if (insertError) {
  console.log("INSERT FAIL:", insertError.message, insertError.details, insertError.hint);
  process.exit(1);
}
console.log("INSERT OK, jti=", inserted.jti, "created_at=", inserted.created_at);

const { data: found, error: selErr } = await supabase
  .from("admin_sessions")
  .select("jti, email, expires_at, revoked_at")
  .eq("jti", jti)
  .maybeSingle();
console.log("SELECT OK:", selErr ? "ERR " + selErr.message : JSON.stringify(found));

const { error: updErr } = await supabase
  .from("admin_sessions")
  .update({ revoked_at: new Date().toISOString() })
  .eq("jti", jti);
console.log("UPDATE(revoke):", updErr ? "ERR " + updErr.message : "OK");

const { error: delErr } = await supabase.from("admin_sessions").delete().eq("jti", jti);
console.log("DELETE:", delErr ? "ERR " + delErr.message : "OK");