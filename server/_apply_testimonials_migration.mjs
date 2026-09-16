import "dotenv/config";
import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const connStr = process.env.DATABASE_URL || "";
const sqlPath = path.join(__dirname, "..", "supabase", "migrations", "20260915_testimonials_cms.sql");

async function main() {
  if (!connStr) {
    console.error("DATABASE_URL is not set in server/.env");
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected to Supabase PostgreSQL.");
  await client.query(sql);
  console.log("Testimonials CMS migration applied.");
  const { rows } = await client.query(
    "select customer_name, company, position, rating, is_published, is_verified, display_order, (testimonial is not null) as has_text from public.testimonials order by display_order"
  );
  console.table(rows);
  await client.end();
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});