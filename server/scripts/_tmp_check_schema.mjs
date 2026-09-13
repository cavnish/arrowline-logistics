import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const TABLES = [
  "site_content", "industries", "services", "service_items", "service_faqs",
  "service_process_steps", "service_industries", "service_item_industries",
  "admin_sessions", "leads", "lead_notes", "case_studies", "gallery_items",
  "locations", "faqs", "testimonials", "blog_categories", "blog_posts",
  "social_videos", "statistics", "site_settings", "clients", "trusted_network",
];

for (const t of TABLES) {
  const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
  const status = error ? `ERROR: ${error.message}` : `OK rows=${count ?? "?"}`;
  console.log(`  ${t.padEnd(28)} ${status}`);
}

const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
if (bErr) console.log("buckets ERROR:", bErr.message);
else console.log("buckets:", buckets.map((b) => b.name).join(", "));

const { data: users, error: uErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
console.log("auth users:", uErr ? "ERROR " + uErr.message : (users?.users || []).map((u) => `${u.email} confirmed=${!!u.email_confirmed_at}`).join(" | "));