import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } });

const { data, error } = await supabase
  .from('trusted_network')
  .select('*')
  .limit(1);
console.log('trusted_network error:', error ? error.message : 'OK (0 rows)');
console.log('rows:', JSON.stringify(data));

const { data: c, error: ce } = await supabase
  .from('clients')
  .select('*')
  .limit(1);
console.log('clients error:', ce ? ce.message : 'OK');
console.log('clients rows:', JSON.stringify(c));

// raw SQL introspection via rpc if available
const { data: cols, error: colErr } = await supabase.rpc('check_column_exists', {});
console.log('rpc check_column_exists:', colErr ? 'NOT_AVAILABLE ' + colErr.message : JSON.stringify(cols));

process.exit(0);