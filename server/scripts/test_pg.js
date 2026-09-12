import pg from 'pg';
const { Client } = pg;

const password = 'Arrowline@1234';
const projectRef = 'vsbircholpdlhyznlrgi';

const connectionStrings = [
  `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`,
  `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
];

async function tryConnect() {
  for (const connStr of connectionStrings) {
    console.log('\nTrying:', connStr.replace(encodeURIComponent(password), '***'));
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });
    try {
      await client.connect();
      console.log('✅ Connected successfully!');
      const res = await client.query('SELECT current_database(), version();');
      console.log('Result:', res.rows[0]);
      await client.end();
      return connStr;
    } catch (err) {
      console.log('❌ Failed:', err.message);
      try { await client.end(); } catch (_) {}
    }
  }
  return null;
}

tryConnect().then(res => {
  if (res) {
    console.log('\n🎉 FOUND WORKING CONNECTION STRING!');
  } else {
    console.log('\nCould not connect via tested poolers/direct.');
  }
}).catch(console.error);
