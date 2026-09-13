import "dotenv/config";
import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const tables = ["industries","clients","case_studies","gallery_items","locations","faqs","testimonials","blog_categories","blog_posts","social_videos","statistics","site_settings","site_content","leads","lead_notes"];
for (const t of tables) {
  const r = await pool.query(
    `select column_name, data_type, is_nullable, column_default from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position`,
    [t]
  );
  console.log(`== ${t} ==`);
  console.log(r.rows.map((c) => `${c.column_name}:${c.data_type}${c.is_nullable==='NO'?'!':''}`).join(", "));
}
await pool.end();