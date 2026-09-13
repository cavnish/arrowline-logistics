import "dotenv/config";
import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const tables = ["services", "service_items"];
const cols = ["image_alt", "image_public_id"];
for (const t of tables) {
  const { rows } = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 AND column_name = ANY($2)`,
    [t, cols]
  );
  const have = rows.map((r) => r.column_name);
  console.log(t, "has:", have.join(", ") || "(none)");
  for (const c of cols) {
    if (!have.includes(c)) {
      await pool.query(`ALTER TABLE public.${t} ADD COLUMN IF NOT EXISTS ${c} text`);
      console.log("  + added", c);
    }
  }
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_${t}_hero_image ON public.${t}(hero_image)`);
}
await pool.end();
console.log("done");