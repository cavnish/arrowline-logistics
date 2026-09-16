import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

const { data: content, error } = await supabase
  .from("site_content")
  .select("*")
  .order("content_key", { ascending: true });

if (error) {
  console.error("ERROR:", error.message);
  process.exit(1);
}

console.log("=== SITE_CONTENT === total:", content.length);
for (const row of content) {
  console.log(`- key=${row.content_key} | type=${row.content_type} | section=${row.section} | published=${row.is_published}`);
  console.log(`    value=${String(row.content_value).slice(0, 160)}`);
}

for (const table of ["services", "service_items", "industries", "clients", "case_studies", "gallery_items", "locations", "faqs", "testimonials", "social_videos", "statistics", "site_settings", "leadership", "core_values", "trusted_network"]) {
  const { data: rows, error: e2 } = await supabase.from(table).select("id").limit(1);
  console.log(`TABLE ${table}: exists=${!e2 && rows !== null} count_sample=${e2 ? "ERR" : rows.length}`);
}