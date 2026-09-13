import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const DB = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DEST = join(import.meta.dirname, "..", "..", "public", "images", "services");
if (existsSync(DEST)) { for (const f of readdirSync(DEST)) if (f !== "ATTRIBUTIONS.json") rmSync(join(DEST, f), { force: true }); }
mkdirSync(DEST, { recursive: true });
function existsSync(p) { try { readdirSync(p); return true; } catch { return false; } }

const ALLOWED_LIC = /^(public domain|cc0|cc by|cc by-sa|pd|no restrictions)/i;
const ALLOWED_MIME = /^(image\/jpeg|image\/png|image\/webp|image\/avif)$/i;

const E = [
  ["svc", "road-transportation", "truck highway", "semi-trailer truck"],
  ["svc", "rail-transportation", "freight train", "railway freight wagons"],
  ["svc", "project-cargo-transportation", "port crane", "heavy cargo port"],
  ["svc", "warehousing-storage", "warehouse racking", "warehouse interior"],
  ["sub", "container-transportation", "container truck", "shipping container highway"],
  ["sub", "ftl-ltl-transportation", "truck fleet", "convoy trucks"],
  ["sub", "odc-heavy-haulage", "oversized load trailer", "heavy haulage truck"],
  ["sub", "project-cargo-transportation", "heavy transport trailer", "project cargo on road"],
  ["sub", "trailer-multi-axle-transportation", "multi axle trailer", "modular trailer"],
  ["sub", "machinery-industrial-cargo-transportation", "excavator transport", "heavy machinery trailer"],
  ["sub", "rail-freight-transportation", "freight wagon", "coal wagon train"],
  ["sub", "container-rail-transportation", "container train", "stacked containers rail"],
  ["sub", "full-train-load-ftl", "locomotive freight train", "long goods train"],
  ["sub", "multimodal-rail-transportation", "harbor containers rail", "port rail intermodal"],
  ["sub", "intermodal-rail-freight", "intermodal yard crane", "container crane rail"],
  ["sub", "bulk-industrial-cargo", "conveyor belt bulk", "coal conveyor"],
  ["sub", "heavy-odc-cargo", "oversized cargo trailer", "overload truck bridge"],
  ["sub", "breakbulk-cargo", "cargo ship crane", "port loading crane"],
  ["sub", "industrial-machinery", "turbine transport", "power plant turbine"],
  ["sub", "multi-axle-special-trailer", "heavy transport trailer", "hydraulic trailer"],
  ["sub", "end-to-end-project-logistics", "heavy lift crane", "mobile crane site"],
  ["sub", "general-industrial-warehousing", "warehouse pallets", "industrial warehouse"],
  ["sub", "distribution-fulfillment", "parcel conveyor sorting", "logistics conveyor"],
  ["sub", "inventory-management", "warehouse barcode scan", "barcode scanner warehouse"],
  ["sub", "container-storage-handling", "container yard", "shipping containers stacking"],
  ["sub", "loading-unloading", "warehouse forklift", "forklift warehouse"],
];

async function pagesOf(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + " filetype:bitmap")}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&format=json&origin=*`;
  for (let retry = 0; retry < 3; retry++) {
    const res = await fetch(url, { headers: { "User-Agent": "ArrowlineCMS/1.0" } });
    if (!res.ok) { await new Promise((r) => setTimeout(r, 3500)); continue; }
    return Object.values((await res.json())?.query?.pages || {});
  }
  return [];
}

async function pick(query, used) {
  const pages = await pagesOf(query);
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    if (!ALLOWED_MIME.test(ii.mime)) continue;
    const lic = ii.extmetadata?.LicenseShortName?.value || "";
    if (!ALLOWED_LIC.test(lic)) continue;
    const thumb = ii.thumburl || ii.url;
    if (used.has(thumb)) continue;
    if (ii.width < 800 || ii.height < 500) continue;
    used.add(thumb);
    return { thumb, mime: ii.mime, lic, artist: (ii.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 80), w: ii.width, h: ii.height, commons: p.title };
  }
  return null;
}

const used = new Set();
const ATTR = [];
const REPORT = [];
for (const [type, slug, q1, q2] of E) {
  process.stdout.write(`${type}:${slug} ... `);
  let hit = await pick(q1, used);
  if (!hit) { await new Promise((r) => setTimeout(r, 1200)); hit = await pick(q2, used); }
  if (!hit) { console.log("NO FOUND"); continue; }
  await new Promise((r) => setTimeout(r, 250));
  const res = await fetch(hit.thumb);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 12000) { console.log("TOO SMALL", buf.length); continue; }
  const ext = hit.mime === "image/jpeg" ? "jpg" : hit.mime === "image/png" ? "png" : "webp";
  const fname = `${type}-${slug}.${ext}`;
  writeFileSync(join(DEST, fname), buf);
  ATTR.push({ type, slug, publicPath: `/images/services/${fname}`, commons_title: hit.commons, license: hit.lic, artist: hit.artist, w: hit.w, h: hit.h, bytes: buf.length });
  REPORT.push({ type, slug, file: fname, bytes: buf.length, lic: hit.lic });
  console.log("OK", fname, String(buf.length).padStart(6), hit.lic);
}

writeFileSync(join(DEST, "ATTRIBUTIONS.json"), JSON.stringify(ATTR, null, 2));
console.log("\nSourced:", REPORT.length, "images.");

const { data: svc } = await DB.from("services").select("id,slug");
const { data: items } = await DB.from("service_items").select("id,slug");
const svcLookup = Object.fromEntries(ATTR.filter((r) => r.type === "svc").map((r) => [r.slug, r]));
const subLookup = Object.fromEntries(ATTR.filter((r) => r.type === "sub").map((r) => [r.slug, r]));
let upd = 0;
for (const s of svc) {
  const a = svcLookup[s.slug];
  if (a) { await DB.from("services").update({ hero_image: a.publicPath, image_alt: s.slug.replace(/-/g, " ").trim() }).eq("id", s.id); upd++; }
}
for (const it of items) {
  const a = subLookup[it.slug];
  if (a) { await DB.from("service_items").update({ hero_image: a.publicPath, image_alt: it.slug.replace(/-/g, " ").trim() }).eq("id", it.id); upd++; }
}
console.log("DB rows updated:", upd);
console.log("NOT FOUND:", E.filter(([t, s]) => !ATTR.some((r) => r.type === (t === "svc" ? "svc" : "sub") && r.slug === s)).map(([t, s]) => `${t}:${s}`).join(", ") || "(all sourced)");