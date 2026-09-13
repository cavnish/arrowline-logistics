import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DB = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const ATTR = JSON.parse(readFileSync(join(import.meta.dirname, "..", "..", "public", "images", "services", "ATTRIBUTIONS.json"), "utf8"));
const svc = Object.fromEntries(ATTR.filter((r) => r.type === "svc").map((r) => [r.slug, r]));
const sub = Object.fromEntries(ATTR.filter((r) => r.type === "sub").map((r) => [r.slug, r]));
const { data: S } = await DB.from("services").select("id,slug");
const { data: I } = await DB.from("service_items").select("id,slug");
let n = 0, err = [];
for (const row of S || []) {
  const a = svc[row.slug];
  if (a) {
    const u = await DB.from("services").update({ hero_image: a.publicPath, image_alt: row.slug.replace(/-/g, " ").trim(), image_public_id: null }).eq("id", row.id);
    if (u.error) err.push("svc " + row.slug + ": " + u.error.message); else n++;
  }
}
for (const row of I || []) {
  const a = sub[row.slug];
  if (a) {
    const u = await DB.from("service_items").update({ hero_image: a.publicPath, image_alt: row.slug.replace(/-/g, " ").trim(), image_public_id: null }).eq("id", row.id);
    if (u.error) err.push("item " + row.slug + ": " + u.error.message); else n++;
  }
}
console.log("updated:", n, "| errors:", err.length ? err.join("; ") : "none");
if (err.length) process.exit(1);