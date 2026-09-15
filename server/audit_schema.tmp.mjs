import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = fs.readFileSync("C:/Users/AIS/Downloads/arrowline-logistics-frontend-development/server/.env", "utf8");
const get = (k) => { const m = env.split("\n").find(l => l.startsWith(k + "=")); return m ? m.split("=").slice(1).join("=").trim() : ""; };

const supabase = createClient(get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

// Raw RPC to inspect live schema (avoids schema cache errors for missing tables)
const { data, error } = await supabase.from("services").select("id,slug,hero_image,showcase_heading,showcase_description,cargo_heading,cargo_description,gallery,applications").limit(1).maybeSingle();
console.log("services columns probe:", JSON.stringify({ data, error: error?.message }));

const { data: ind, error: indErr } = await supabase.from("industries").select("*").limit(1).maybeSingle();
console.log("industries columns:", JSON.stringify({ data: ind, error: indErr?.message }));

const { data: ss, error: ssErr } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
console.log("site_settings columns:", JSON.stringify({ data: ss, error: ssErr?.message }));

// Does a 'core_values' or 'leadership' or 'team_members' table exist?
for (const t of ["core_values", "leadership", "team_members", "site_content", "trusted_network", "service_visual_showcase", "service_cargo_applications"]) {
  const { error: e } = await supabase.from(t).select("id").limit(1);
  console.log(`table ${t}:`, e?.message || "EXISTS");
}