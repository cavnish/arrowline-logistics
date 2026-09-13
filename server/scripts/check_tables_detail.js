import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false }
});

async function main() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set in server/.env');
    process.exit(1);
  }
  const tables = ['service_items', 'service_faqs', 'service_process_steps', 'service_industries', 'service_item_industries'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table ${t}: error:`, error.message, error.code);
    } else {
      console.log(`Table ${t}: OK, data:`, data);
    }
  }
}

main().catch(console.error);
