import 'dotenv/config';
import fs from 'node:fs';
import pg from 'pg';
const { Client } = pg;

const connStr = process.env.DATABASE_URL || '';
const filePath = process.argv[2];

if (!connStr || !filePath) {
  console.error('Usage: node _apply_sql_file.mjs <path-to-sql>  (DATABASE_URL required in server/.env)');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`SQL file not found: ${filePath}`);
  process.exit(1);
}

const sql = fs.readFileSync(filePath, 'utf8');

const client = new Client({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log('Connected. Executing migration...');
  await client.query(sql);
  console.log('Migration executed successfully.');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}