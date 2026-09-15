import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

const connStr = process.env.DATABASE_URL || '';
const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();

  const cols = await client.query(
    `select column_name, data_type, is_nullable, column_default
     from information_schema.columns
     where table_schema = 'public' and table_name = 'trusted_network'
     order by ordinal_position`
  );
  console.log('--- COLUMNS ---');
  for (const c of cols.rows) console.log(`${c.column_name} | ${c.data_type} | nullable=${c.is_nullable} | default=${c.column_default}`);

  const rows = await client.query(
    `select name, category, display_order, is_published, coalesce(logo,'') as logo
     from public.trusted_network order by display_order`
  );
  console.log(`\n--- ROWS (${rows.rowCount}) ---`);
  for (const r of rows.rows) console.log(`${r.display_order}\t${r.name}\t${r.category}\t${r.is_published}\tlogo=${r.logo ? 'set' : 'empty'}`);

  const idx = await client.query(
    `select indexname from pg_indexes where schemaname='public' and tablename='trusted_network'`
  );
  console.log(`\n--- INDEXES ---`);
  for (const i of idx.rows) console.log(i.indexname);
} finally {
  await client.end();
}