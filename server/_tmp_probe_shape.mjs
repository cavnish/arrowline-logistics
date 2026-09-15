import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data: s } = await supabase.from("services").select("slug,gallery,applications,process_steps,why_arrowline").eq("slug","road-transportation").maybeSingle();
console.log("=== SERVICE road-transportation ===");
console.log("GALLERY:", JSON.stringify(s?.gallery));
console.log("APPLICATIONS:", JSON.stringify(s?.applications));
console.log("PROCESS[0]:", JSON.stringify(s?.process_steps?.[0]));
console.log("WHY[0]:", JSON.stringify(s?.why_arrowline?.[0]));

const { data: it } = await supabase.from("service_items").select("slug,gallery,applications,process_steps,capabilities").eq("slug","container-transportation").maybeSingle();
console.log("\n=== ITEM container-transportation ===");
console.log("GALLERY:", JSON.stringify(it?.gallery));
console.log("APPLICATIONS:", JSON.stringify(it?.applications));
console.log("PROCESS[0]:", JSON.stringify(it?.process_steps?.[0]));
console.log("CAPABILITIES:", JSON.stringify(it?.capabilities));
