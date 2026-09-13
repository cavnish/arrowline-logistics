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
  console.log('=== SUPABASE CONNECTION TEST ===');
  console.log('Project:', supabaseUrl);

  const tables = [
    'services', 'service_items', 'service_faqs', 'service_process_steps',
    'service_industries', 'service_item_industries',
    'industries', 'site_content', 'leads', 'lead_notes',
    'case_studies', 'gallery_items', 'locations', 'faqs', 'testimonials',
    'blog_categories', 'blog_posts', 'social_videos', 'statistics', 'site_settings',
    'clients', 'admin_sessions', 'trusted_network'
  ];

  console.log('\n=== TABLE EXISTENCE CHECK ===');
  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`❌ ${table}: ${error.message} (code: ${error.code})`);
      } else {
        console.log(`✅ ${table}: exists (${count} rows)`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }

  console.log('\n=== STORAGE BUCKETS ===');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('❌ Cannot list buckets:', error.message);
    } else {
      for (const bucket of (buckets || [])) {
        console.log(`✅ Bucket: ${bucket.name} (public: ${bucket.public})`);
      }
      if (!buckets || buckets.length === 0) {
        console.log('⚠️ No storage buckets found!');
      }
    }
  } catch (e) {
    console.log('❌ Storage error:', e.message);
  }
}

main().catch(console.error);
