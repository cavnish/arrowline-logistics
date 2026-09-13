import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await s.from("services").select("slug,hero_image");
console.log(JSON.stringify(data, null, 1));
const r = await s.rpc(undefined).catch(() => null);