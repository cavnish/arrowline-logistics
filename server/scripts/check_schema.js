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
  console.log('=== CHECK SERVICES COLUMNS ===');
  // Try inserting a test service or selecting specific columns to see if they exist
  const columnsToTest = [
    'id', 'slug', 'title', 'short_description', 'full_description',
    'hero_image', 'hero_video', 'hero_fallback_image',
    'is_published', 'display_order', 'meta_title', 'meta_description',
    'canonical_url', 'og_image', 'capabilities', 'benefits'
  ];

  for (const col of columnsToTest) {
    const { error } = await supabase.from('services').select(col).limit(1);
    if (error) {
      console.log(`❌ Column ${col} NOT present:`, error.message);
    } else {
      console.log(`✅ Column ${col} exists`);
    }
  }

  // Also check if there is any data in services
  const { data: services, error: sErr } = await supabase.from('services').select('*');
  console.log(`\nExisting services: ${services?.length || 0}`);
  if (services && services.length > 0) {
    console.log(JSON.stringify(services, null, 2));
  }
}

main().catch(console.error);
