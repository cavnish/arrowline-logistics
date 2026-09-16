import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "server", ".env") });

const env = process.env;
console.log("SUPABASE_URL set:", Boolean(env.SUPABASE_URL));
console.log("SERVICE_KEY set:", Boolean(env.SUPABASE_SERVICE_ROLE_KEY));

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: true });
  if (error) {
    console.error("ERROR:", JSON.stringify(error, null, 2));
    return;
  }
  console.log("COUNT:", data.length);
  console.log(JSON.stringify(data, null, 2));
}

main();