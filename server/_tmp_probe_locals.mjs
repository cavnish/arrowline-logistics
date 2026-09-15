import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const tables = ["services","service_items","industries","clients","case_studies","gallery_items","locations","testimonials","blog_posts","social_videos","trusted_network","site_content","lead_notes","leads","faqs"];

const isLocal = (v) => typeof v === "string" && /^\/images\//.test(v);
const findLocal = (row) => {
  const found = [];
  const walk = (obj, path) => {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) { obj.forEach((o, i) => walk(o, `${path}[${i}]`)); return; }
    for (const [k, v] of Object.entries(obj)) {
      if (isLocal(v)) found.push(`${path}.${k} = ${v}`);
      else if (v && typeof v === "object") walk(v, `${path}.${k}`);
    }
  };
  walk(row, "");
  return found;
};

for (const t of tables) {
  const { data, error } = await supabase.from(t).select("*");
  if (error) { console.log(`[${t}] ERR ${error.message}`); continue; }
  const localRefs = [];
  for (const row of data || []) localRefs.push(...findLocal(row));
  console.log(`[${t}] count=${data?.length || 0} localRefs=${localRefs.length}`);
  for (const r of localRefs.slice(0, 40)) console.log("   ", r);
  if (localRefs.length > 40) console.log(`    ...and ${localRefs.length - 40} more`);
}
