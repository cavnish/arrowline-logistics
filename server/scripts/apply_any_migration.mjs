import 'dotenv/config';
import fs from 'node:fs';
import pg from 'pg';
const { Client } = pg;

const connStr = process.env.DATABASE_URL || '';
const file = process.argv[2];

async function main() {
  if (!connStr) { console.error('DATABASE_URL not set'); process.exit(1); }
  if (!file) { console.error('usage: node apply_any_migration.mjs <file.sql>'); process.exit(1); }
  const sql = fs.readFileSync(file, 'utf8');
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected. Applying:', file);
  await client.query(sql);
  console.log('OK: migration applied.');
  await client.end();
}

main().catch((e) => { console.error('Migration error:', e); process.exit(1); });