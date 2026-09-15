import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = fs.readFileSync("C:/Users/AIS/Downloads/arrowline-logistics-frontend-development/server/.env", "utf8");
const get = (k) => { const m = env.split("\n").find(l => l.startsWith(k + "=")); return m ? m.split("=").slice(1).join("=").trim() : ""; };

const supabase = createClient(get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

async function count(table) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  return error ? `ERR:${error.message}` : count;
}

async function dump(table, cols = "*", order = null) {
  let q = supabase.from(table).select(cols);
  if (order) {
    for (const [c, dir] of order) q = q.order(c, { ascending: dir === "asc" });
  }
  const { data, error } = await q;
  return error ? { error: error.message } : data;
}

console.log("=== TABLE COUNTS ===");
for (const t of ["site_content", "services", "service_items", "service_visual_showcase", "service_cargo_applications", "industries", "trusted_network", "clients", "case_studies", "gallery_items", "locations", "testimonials", "leads", "admin_sessions", "site_settings"]) {
  console.log(t, "=>", await count(t));
}

console.log("\n=== SITE_CONTENT (published image keys) ===");
const sc = await dump("site_content", "*", [["content_key", "asc"]]);
if (sc.error) console.log("ERR", sc.error);
else {
  for (const row of sc) console.log(row.content_key, "|", row.content_type, "|", row.is_published, "|", String(row.content_value).slice(0, 90));
}

console.log("\n=== SERVICES ===");
const svc = await dump("services", "id,slug,title,hero_image,image_public_id,hero_fallback_image,about_image,is_published,display_order,updated_at", [["display_order", "asc"]]);
if (svc.error) console.log("ERR", svc.error);
else for (const s of svc) console.log(s.slug, "| pub=", s.is_published, "| hero=", String(s.hero_image||"").slice(0,70), "| pid=", s.image_public_id, "| up=", String(s.updated_at).slice(0,10));

console.log("\n=== SERVICE ITEMS ===");
const si = await dump("service_items", "id,service_id,slug,title,hero_image,image_public_id,about_image,is_published,display_order,updated_at", [["display_order", "asc"]]);
if (si.error) console.log("ERR", si.error);
else for (const s of si) console.log(s.slug, "| svc=", String(s.service_id).slice(0,8), "| pub=", s.is_published, "| hero=", String(s.hero_image||"").slice(0,60), "| pid=", s.image_public_id, "| up=", String(s.updated_at).slice(0,10));

console.log("\n=== TRUSTED NETWORK ===");
const tn = await dump("trusted_network", "*", [["display_order", "asc"]]);
if (tn.error) console.log("ERR", tn.error);
else for (const r of tn) console.log(r.name, "| pub=", r.is_published, "| feat=", r.is_featured, "| logo=", String(r.logo||"").slice(0,70), "| pid=", r.logo_public_id, "| up=", String(r.updated_at).slice(0,10));

console.log("\n=== INDUSTRIES ===");
const ind = await dump("industries", "slug,title,image,is_published,display_order,updated_at", [["display_order", "asc"]]);
if (ind.error) console.log("ERR", ind.error);
else for (const r of ind) console.log(r.slug, "| pub=", r.is_published, "| img=", String(r.image||"").slice(0,70), "| up=", String(r.updated_at).slice(0,10));

console.log("\n=== SHOWCASE count by service ===");
const sh = await dump("service_visual_showcase", "id,service_id,service_item_id,title,image_url,image_public_id,is_published,display_order,updated_at");
if (sh.error) console.log("ERR", sh.error);
else {
  const bySvc = {};
  for (const r of sh || []) {
    const key = r.service_id ? `svc:${String(r.service_id).slice(0,8)}` : `item:${String(r.service_item_id).slice(0,8)}`;
    bySvc[key] = (bySvc[key] || 0) + 1;
  }
  console.log(JSON.stringify(bySvc, null, 2));
  const orphans = (sh || []).filter(r => !r.service_id && !r.service_item_id || (r.service_id && r.service_item_id));
  console.log("ORPHAN/AMBIG rows:", orphans.length);
}

console.log("\n=== CARGO count by service ===");
const ca = await dump("service_cargo_applications", "id,service_id,service_item_id,title,image_url,image_public_id,is_published,display_order,updated_at");
if (ca.error) console.log("ERR", ca.error);
else {
  const bySvc = {};
  for (const r of ca || []) {
    const key = r.service_id ? `svc:${String(r.service_id).slice(0,8)}` : `item:${String(r.service_item_id).slice(0,8)}`;
    bySvc[key] = (bySvc[key] || 0) + 1;
  }
  console.log(JSON.stringify(bySvc, null, 2));
  const orphans = (ca || []).filter(r => !r.service_id && !r.service_item_id || (r.service_id && r.service_item_id));
  console.log("ORPHAN/AMBIG rows:", orphans.length);
}