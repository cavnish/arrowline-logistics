import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// 1. Content PUT diagnosis
const key = "_tmp_content_diag";
const body = { content_value: "hello", content_type: "text", is_published: true, updated_at: new Date().toISOString() };
let r1 = await supabase.from("site_content").update(body).eq("content_key", key).select().single();
console.log("[content] update =>", JSON.stringify({ data: r1.data, error: r1.error ? { message: r1.error.message, code: r1.error.code, details: r1.error.details } : null }));

const insBody = { content_key: key, content_value: "hello", content_type: "text", section: null, is_published: true, updated_at: new Date().toISOString() };
let r2 = await supabase.from("site_content").insert([insBody]).select().single();
console.log("[content] insert =>", JSON.stringify({ data: r2.data, error: r2.error ? { message: r2.error.message, code: r2.error.code, details: r2.error.details } : null }));
await supabase.from("site_content").delete().eq("content_key", key);

const cols = await supabase.from("site_content").select("content_key, content_value, content_type").limit(5);
console.log("[content] existing rows:", cols.data?.map(c => c.content_key).join(", "), cols.error?.message || "");

// 2. Resend diagnosis
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || "";
const TO = process.env.NOTIFY_EMAILS?.split(",")[0]?.trim();
console.log("[resend] FROM =", FROM, "| NOTIFY =", TO);
try {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: "Arrowline E2E — backend connectivity check",
    html: "<p>Arrowline production readiness E2E — please ignore.</p>",
  });
  console.log("[resend] send =>", data ? JSON.stringify(data) : "ERROR " + JSON.stringify(error));
} catch (e) {
  console.log("[resend] exception =>", e.message);
}