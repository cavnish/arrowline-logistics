import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Client } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SQL_FILES = [
  { label: 'core_values fix', file: '_fix_core_values.sql' },
  { label: 'industries seed', file: '_seed_industries.sql' },
];

const connStr = process.env.DATABASE_URL;
if (!connStr) {
  console.error('DATABASE_URL is not set. Add it to server/.env and re-run.');
  process.exit(1);
}

const client = new Client({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log('Connected to database.\n');

  for (const { label, file } of SQL_FILES) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.error(`  [SKIP] ${label} — file not found: ${filePath}`);
      continue;
    }
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      await client.query(sql);
      console.log(`  [OK]   ${label}`);
    } catch (err) {
      console.error(`  [FAIL] ${label} — ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log('\nDone.');
} finally {
  await client.end();
}
