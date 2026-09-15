import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
const env = fs.readFileSync("C:/Users/AIS/Downloads/arrowline-logistics-frontend-development/server/.env", "utf8");
const get = (k) => { const m = env.split("\n").find(l => l.startsWith(k + "=")); return m ? m.split("=").slice(1).join("=").trim() : ""; };
const supabase = createClient(get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

for (const t of ["service_visual_showcase", "service_cargo_applications", "leadership", "core_values"]) {
  const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
  console.log(t, "=>", error ? `ERR ${error.message}` : count);
}

const { data: sh, error: shErr } = await supabase.from("service_visual_showcase").select("id,service_id,service_item_id,title,image_url,is_published,display_order");
console.log("showcase rows:", sh?.length, shErr?.message || "");
if (sh) for (const r of sh.slice(0, 8)) console.log("  ", (r.service_id ? "svc " + r.service_id.slice(0,6) : "item " + r.service_item_id.slice(0,6)), "|", r.title, "| img:", String(r.image_url||"").slice(0,60), "| pub:", r.is_published);

const { data: ca, error: caErr } = await supabase.from("service_cargo_applications").select("id,service_id,service_item_id,title,image_url,is_published,display_order");
console.log("cargo rows:", ca?.length, caErr?.message || "");
if (ca) for (const r of ca.slice(0, 8)) console.log("  ", (r.service_id ? "svc " + r.service_id.slice(0,6) : "item " + r.service_item_id.slice(0,6)), "|", r.title, "| img:", String(r.image_url||"").slice(0,60));