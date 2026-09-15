import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;
const connStr = process.env.DATABASE_URL || '';
if (!connStr) {
  console.log('DATABASE_URL not set');
  process.exit(0);
}
const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
await client.connect();

for (const table of ['trusted_network', 'clients', 'services', 'service_items']) {
  const { rows } = await client.query(
    `select column_name, data_type, is_nullable, column_default
     from information_schema.columns
     where table_schema = 'public' and table_name = $1
     order by ordinal_position`,
    [table]
  );
  console.log(`\n=== ${table} ===`);
  for (const r of rows) {
    console.log(`${r.column_name}\t${r.data_type}\tnullable=${r.is_nullable}\tdefault=${r.column_default}`);
  }
}

await client.end();
process.exit(0);