import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('SUPABASE_URL set:', Boolean(supabaseUrl));
console.log('SERVICE_ROLE set:', Boolean(supabaseServiceRoleKey));
console.log('CLOUDINARY_CLOUD_NAME set:', Boolean(process.env.CLOUDINARY_CLOUD_NAME));
console.log('CLOUDINARY_API_KEY set:', Boolean(process.env.CLOUDINARY_API_KEY));
console.log('CLOUDINARY_API_SECRET set:', Boolean(process.env.CLOUDINARY_API_SECRET));
console.log('ADMIN_API_KEY set:', Boolean(process.env.ADMIN_API_KEY));
console.log('RESEND_API_KEY set:', Boolean(process.env.RESEND_API_KEY));

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.log('Cannot connect - missing credentials');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } });

async function probe(table) {
  const { data, error } = await supabase.from(table).select('*').order('display_order', { ascending: true });
  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

for (const t of ['trusted_network', 'clients']) {
  const r = await probe(t);
  if (r.error) {
    console.log(`\n=== ${t}: ERROR ===\n${r.error}`);
  } else {
    console.log(`\n=== ${t}: ${r.data.length} rows ===`);
    for (const row of r.data) {
      console.log(JSON.stringify(row));
    }
  }
}

const { data: content, error: contentErr } = await supabase
  .from('site_content')
  .select('content_key, content_value, content_type')
  .ilike('content_key', '%trusted%');
console.log('\n=== site_content trusted keys ===');
if (contentErr) console.log('ERR', contentErr.message);
else content.forEach((c) => console.log(JSON.stringify(c)));

const { data: sess, error: sessErr } = await supabase.from('admin_sessions').select('jti, email, revoked_at, expires_at').limit(3);
console.log('\n=== admin_sessions sample ===');
if (sessErr) console.log('ERR', sessErr.message);
else sess.forEach((s) => console.log(JSON.stringify(s)));
process.exit(0);