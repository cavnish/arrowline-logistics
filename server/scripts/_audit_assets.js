import "dotenv/config";
import pg from "pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function q(sql, params) {
  const r = await pool.query(sql, params);
  return r.rows;
}

for (const t of ["gallery_items", "blog_posts", "case_studies", "industries", "locations", "social_videos", "testimonials", "statistics", "site_settings", "trusted_network", "clients", "faqs", "service_industries", "service_item_industries", "blog_categories"]) {
  try {
    const col = await q(
      `select column_name from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position`,
      [t]
    );
    const like = col.filter((c) => /image|img|photo|video|url|icon|logo|avatar|src|thumbnail|pic/.test(c.column_name)).map((c) => c.column_name);
    const rows = await q(`select * from public.${t} limit 12`);
    console.log(`\n== ${t} (${rows.length}) imgCols=[${like.join(",")}] ==`);
    if (like.length === 0 && rows.length === 0) { console.log("  (empty)"); continue; }
    if (like.length === 0 && rows.length > 0) { console.log("  cols:", col.map((c) => c.column_name).join(",")); }
    rows.slice(0, 6).forEach((r, i) => {
      const bits = like.map((c) => `${c}=${String(r[c] ?? "").slice(0, 90)}`).join(" ") || Object.entries(r).slice(0, 4).map(([k, v]) => `${k}=${String(v).slice(0, 60)}`).join(" ");
      console.log(`  [${i}] ${bits}`);
    });
  } catch (e) {
    console.log(`\n== ${t} == ERR ${e.message}`);
  }
}

const gal = await pool.query(`select gallery from public.services where gallery is not null`);
const allUrls = new Set();
gal.rows.forEach((r) => {
  const arr = Array.isArray(r.gallery) ? r.gallery : JSON.parse(r.gallery || "[]");
  arr.forEach((g) => allUrls.add(g.url));
});
console.log("\n== DISTINCT gallery urls across services ==");
[...allUrls].forEach((u) => console.log(" -", u));

await pool.end();