import "dotenv/config";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const tables = await pool.query(
  `select tablename from pg_tables where schemaname='public' order by tablename`
);
console.log("== ALL TABLES ==");
console.log(tables.rows.map((r) => r.tablename).join(", "));

async function dump(name) {
  try {
    const { data, error } = await supabase.from(name).select("*").order("display_order", { ascending: true }).limit(200);
    if (error) { console.log(`\n== ${name} == ERROR ${error.message}`); return []; }
    return data || [];
  } catch (e) {
    console.log(`\n== ${name} == THREW ${e.message}`);
    return [];
  }
}

const services = await dump("services");
console.log("\n== SERVICES (all) ==");
services.forEach((s) => {
  console.log(`- ${s.title} (slug=${s.slug})`);
  console.log(`    hero_image=${s.hero_image}`);
  console.log(`    about_image=${s.about_image}`);
  console.log(`    og_image=${s.og_image}`);
  console.log(`    hero_badge=${s.hero_badge} | key_capability=${s.key_capability}`);
  console.log(`    gallery=${(s.gallery || []).length ? JSON.stringify(s.gallery).slice(0, 220) : "(none)"}`);
});

const items = await dump("service_items");
console.log(`\n== SERVICE ITEMS (all ${items.length}) ==`);
items.forEach((s) => {
  console.log(`- ${s.title} (parent=${s.parent_slug}, slug=${s.slug})`);
  console.log(`    hero_image=${s.hero_image}`);
  console.log(`    about_image=${s.about_image}`);
  console.log(`    og_image=${s.og_image}`);
  console.log(`    aboutBadge=${s.about_badge} | keyCapability=${s.key_capability}`);
  console.log(`    gallery=${(s.gallery || []).length ? JSON.stringify(s.gallery).slice(0, 160) : "(none)"}`);
});

const processSteps = await supabase.from("service_process_steps").select("id, service_id, service_item_id, title, image").limit(300);
console.log(`\n== PROCESS STEPS (${(processSteps.data || []).length}) ==`);
(processSteps.data || []).forEach((p) => console.log(`- ${p.title} | image=${p.image}`));

const sc = await supabase.from("site_content").select("content_key, section, content_value").limit(200);
console.log(`\n== SITE CONTENT (${(sc.data || []).length}) ==`);
(sc.data || []).forEach((c) => {
  const v = String(c.content_value || "");
  const imgHits = [...v.matchAll(/https?:\/\/[^\s"’]+|"\/images\/[^"]+"|'\/images\/[^']+'/g)].map((m) => m[0]);
  console.log(`- ${c.section}/${c.content_key} => ${v.slice(0, 120)}${imgHits.length ? "  IMG:" + imgHits.slice(0, 3).join(",") : ""}`);
});

await pool.end();