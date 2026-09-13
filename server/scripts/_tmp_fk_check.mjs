import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } });

async function main() {
  const fks = await pool.query(`
    SELECT rc.relname as tbl, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    JOIN pg_class rc ON rc.oid = c.conrelid
    WHERE c.contype = 'f' AND rc.relname IN ('lead_notes','service_faqs','service_process_steps','service_industries','service_item_industries','blog_posts')
    ORDER BY rc.relname
  `);
  console.log("FOREIGN KEYS:");
  for (const r of fks.rows) console.log(`  ${r.tbl}: ${r.def}`);

  const uniques = await pool.query(`
    SELECT rc.relname as tbl, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    JOIN pg_class rc ON rc.oid = c.conrelid
    WHERE c.contype = 'u' AND rc.relname IN ('services','service_items','leads','clients','trusted_network')
    ORDER BY rc.relname
  `);
  console.log("\nUNIQUE constraints:");
  for (const r of uniques.rows) console.log(`  ${r.tbl}: ${r.def}`);

  const idxs = await pool.query(`
    SELECT tablename, indexname, indexdef FROM pg_indexes
    WHERE schemaname='public' AND tablename IN ('services','service_items','leads','admin_sessions')
    ORDER BY tablename, indexname
  `);
  console.log("\nINDEXES:");
  for (const r of idxs.rows) console.log(`  ${r.tablename}.${r.indexname}`);

  await pool.end();
}
main().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });