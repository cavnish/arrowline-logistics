import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vsbircholpdlhyznlrgi.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYmlyY2hvbHBkbGh5em5scmdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQ5NDU3MSwiZXhwIjoyMTAzMDcwNTcxfQ.q2Usht9aYcuqQIGBSgJQlyeYercJTZ-Y-xJcY6zfxaQ';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false }
});

async function main() {
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
