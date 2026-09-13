import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const services = (await s.from("services").select("id,slug,title,hero_image").order("display_order")).data;
for (const sv of services) {
  console.log("## " + sv.slug + " | " + sv.title + " | hero=" + sv.hero_image);
  const { data: items } = await s.from("service_items").select("slug,title,hero_image").eq("service_id", sv.id).order("display_order");
  for (const it of items) console.log("   " + it.slug + " | " + it.title + " | hero=" + it.hero_image);
}