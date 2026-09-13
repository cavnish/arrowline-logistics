import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

const password = process.env.SUPABASE_DB_PASSWORD || '';
const projectRef = process.env.SUPABASE_PROJECT_REF || 'vsbircholpdlhyznlrgi';

const regions = [
  'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
  'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1', 'sa-east-1'
];

async function main() {
  if (!password) {
    console.error('SUPABASE_DB_PASSWORD is not set in server/.env');
    process.exit(1);
  }
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connStr = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@${host}:6543/postgres`;
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000
    });
    try {
      await client.connect();
      console.log(`✅ SUCCESS with region ${region}!`);
      const res = await client.query('SELECT 1 as connected;');
      console.log(res.rows);
      await client.end();
      return region;
    } catch (e) {
      if (!e.message.includes('tenant/user') && !e.message.includes('timeout')) {
        console.log(`Region ${region}: ${e.message}`);
      }
      try { await client.end(); } catch (_) {}
    }
  }
  console.log('No matching pooler region found.');
}

main().catch(console.error);
