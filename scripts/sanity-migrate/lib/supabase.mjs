import { createClient } from "@supabase/supabase-js";
import { config } from "./env.mjs";

export const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** CMS tables that become Sanity content. Transactional tables are never read. */
export const CMS_TABLES = [
  "site_content",
  "site_settings",
  "services",
  "service_items",
  "service_faqs",
  "service_process_steps",
  "service_visual_showcase",
  "service_cargo_applications",
  "service_industries",
  "service_item_industries",
  "industries",
  "clients",
  "trusted_network",
  "testimonials",
  "faqs",
  "statistics",
  "gallery_items",
  "blog_categories",
  "blog_posts",
  "case_studies",
  "social_videos",
  "locations",
  "about_images",
  "about_pillars",
  "about_milestones",
  "about_differentiators",
  "leadership",
  "core_values",
];

/** Fetch all rows of a table. Missing tables return [] and are reported. */
export async function fetchTable(table) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    return { table, rows: [], error: error.message };
  }
  return { table, rows: data || [], error: null };
}

export async function exportAllTables() {
  const dump = {};
  const problems = [];
  for (const table of CMS_TABLES) {
    const { rows, error } = await fetchTable(table);
    dump[table] = rows;
    if (error) problems.push(`${table}: ${error}`);
    process.stdout.write(`  ${error ? "✗" : "✓"} ${table.padEnd(30)} ${error ? error : `${rows.length} rows`}\n`);
  }
  return { dump, problems };
}
