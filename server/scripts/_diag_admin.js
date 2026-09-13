import "dotenv/config";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const cols = await pool.query(
    `select column_name, data_type, is_nullable, column_default
     from information_schema.columns
     where table_schema='public' and table_name='admin_sessions'
     order by ordinal_position`
  );
  console.log("== admin_sessions columns ==");
  console.table(cols.rows);

  const keys = await pool.query(
    `select a.attname as column, 'pk' as kind
     from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum = any(i.indkey)
     where i.indrelid='public.admin_sessions'::regclass and i.indisprimary`
  );
  console.log("== pk ==");
  console.table(keys.rows);

  const rls = await pool.query(
    `select relrowsecurity, relforcerowsecurity from pg_class where oid='public.admin_sessions'::regclass`
  );
  console.log("== rls ==");
  console.table(rls.rows);

  const pol = await pool.query(
    `select pol.polname, pol.polcmd, pg_get_expr(pol.polqual, pol.polrelid) as using_expr, pg_get_expr(pol.polwithcheck, pol.polrelid) as check_expr
     from pg_policy pol join pg_class c on c.oid=pol.polrelid
     where c.oid='public.admin_sessions'::regclass`
  );
  console.log("== policies ==");
  console.table(pol.rows);

  const cnt = await pool.query(`select count(*) from public.admin_sessions`);
  console.log("== row count ==", cnt.rows[0].count);

  const { data: users, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 50 });
  if (error) console.log("listUsers error:", error.message);
  console.log("== auth users ==");
  (users?.users || []).forEach((u) => {
    console.log(`${u.email} | confirmed=${u.email_confirmed_at} | created=${u.created_at} | id=${u.id}`);
  });

  const allowlist = [process.env.ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS || "").split(",")]
    .map((s) => s?.trim().toLowerCase())
    .filter(Boolean);
  console.log("== allowlist ==", JSON.stringify(allowlist));

  await pool.end();
}

main().catch((e) => {
  console.error("DIAG FAIL:", e.message);
  process.exit(1);
});