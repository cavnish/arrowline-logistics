import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

for (const table of ["about_images", "about_pillars", "about_milestones", "about_differentiators"]) {
  const { data, error } = await supabase.from(table).select("*").order("display_order", { ascending: true });
  if (error) {
    console.log(`TABLE ${table}: ERROR ${error.message}`);
    continue;
  }
  console.log(`=== ${table} === count=${data.length}`);
  for (const row of data) {
    if (table === "about_images") {
      console.log(`- slot=${row.slot} | published=${row.is_published} | alt="${row.alt_text}" | ${row.image_url}`);
    } else if (table === "about_pillars") {
      console.log(`- icon=${row.icon} color=${row.color} order=${row.display_order} | ${row.title}`);
    } else if (table === "about_milestones") {
      console.log(`- order=${row.display_order} | ${row.year} | ${row.title}`);
    } else {
      console.log(`- icon=${row.icon} accent=${row.accent} order=${row.display_order} | ${row.title}`);
    }
  }
}

const { data: content, error: ce } = await supabase.from("site_content").select("content_key").eq("section", "About").order("content_key");
console.log(`=== site_content (About section) === count=${ce ? "ERR" : content.length}`);
if (!ce) console.log(content.map((r) => r.content_key).join(", "));