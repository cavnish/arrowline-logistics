import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } });

async function main() {
  const tables = ["services", "service_items", "leads", "lead_notes", "admin_sessions", "clients", "trusted_network", "industries", "site_content"];
  for (const t of tables) {
    const rls = await pool.query(
      `select c.relrowsecurity, c.relforcerowsecurity from pg_class c where c.oid = 'public.${t}'::regclass`
    );
    const pols = await pool.query(
      `select pol.polname, pol.polcmd from pg_policy pol join pg_class c on c.oid = pol.polrelid where c.oid = 'public.${t}'::regclass order by pol.polname`
    );
    const cols = await pool.query(
      `select count(*) as n from information_schema.columns where table_schema='public' and table_name='${t}'`
    );
    console.log(`${t.padEnd(18)} RLS=${rls.rows[0].relrowsecurity} force=${rls.rows[0].relforcerowsecurity} cols=${cols.rows[0].n} policies=${pols.rows.map(p => p.polname + "(" + p.polcmd + ")").join(",") || "none"}`);
  }

  const fks = await pool.query(
    `select rc.relname as tbl, tc.constraint_name, pg_get_constraintdef(tc.oid) as def
     from pg_constraint tc
     join pg_class rc on rc.oid = tc.conrelid
     where tc.contype='f' and rc.relname in ('service_faqs','service_process_steps','service_industries','service_item_industries','lead_notes','blog_posts')
     order by rc.relname`
  );
  console.log("\nFOREIGN KEYS:");
  for (const r of fks.rows) console.log(`  ${r.tbl}: ${r.def}`);

  await pool.end();
}
main().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });