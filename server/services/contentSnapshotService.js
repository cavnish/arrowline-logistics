/**
 * Published-content snapshot builder.
 *
 * Produces the exact "tables" shape used by the static frontend snapshot
 * (`src/data/content-snapshot.json`). Only rows that are publicly visible are
 * exported; admin-only tables and drafts are never included.
 *
 * The endpoint that serves this (`GET /api/content/snapshot`) is deliberately
 * public and read-only so a Vercel build can refresh the static snapshot
 * without holding the Supabase service-role key.
 */

/** Tables exported into the public snapshot. `filter` marks a public row. */
export const SNAPSHOT_TABLES = [
  { name: "site_content", filter: "is_published" },
  { name: "site_settings", filter: "is_public" },
  { name: "services", filter: "is_published" },
  { name: "service_items", filter: "is_published" },
  { name: "service_faqs", filter: "is_published" },
  { name: "service_process_steps", filter: "is_published" },
  { name: "service_visual_showcase", filter: "is_published" },
  { name: "service_cargo_applications", filter: "is_published" },
  { name: "industries", filter: "is_published" },
  { name: "clients", filter: "is_published" },
  { name: "trusted_network", filter: "is_published" },
  { name: "about_images", filter: "is_published" },
  { name: "about_pillars", filter: "is_published" },
  { name: "about_milestones", filter: "is_published" },
  { name: "about_differentiators", filter: "is_published" },
  { name: "leadership", filter: "is_published" },
  { name: "core_values", filter: "is_published" },
  { name: "testimonials", filter: "is_published" },
  { name: "faqs", filter: "is_published" },
  { name: "statistics", filter: "is_published" },
  { name: "blog_categories", filter: "is_published" },
  { name: "blog_posts", filter: "is_published" },
  { name: "gallery_items", filter: "is_published" },
  { name: "case_studies", filter: "is_published" },
  { name: "social_videos", filter: "is_published" },
  { name: "locations", filter: "is_published" },
];

export const SNAPSHOT_SCHEMA_VERSION = 1;
const PAGE_SIZE = 1000;

/**
 * Reads every published row for every public table.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<{ schemaVersion: number, generatedAt: string, source: string, tables: Record<string, any[]> }>}
 */
export async function buildContentSnapshot(supabase) {
  const tables = {};

  for (const table of SNAPSHOT_TABLES) {
    const rows = [];
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await supabase
        .from(table.name)
        .select("*")
        .eq(table.filter, true)
        .order("id", { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        throw new Error(`Supabase read failed for ${table.name}: ${error.message}`);
      }

      const page = Array.isArray(data) ? data : [];
      rows.push(...page);
      if (page.length < PAGE_SIZE) break;
      if (offset > 500000) {
        throw new Error(`Pagination safety limit hit for ${table.name}`);
      }
    }

    tables[table.name] = rows;
  }

  return {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    source: "supabase-live",
    tables,
  };
}
