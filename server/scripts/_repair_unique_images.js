import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DB = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DEST = join(import.meta.dirname, "..", "..", "public", "images", "services");
mkdirSync(DEST, { recursive: true });

const ALLOWED_LIC = /^(public domain|cc0|cc by|cc by-sa|pd|no restrictions)/i;
const ALLOWED_MIME = /^(image\/jpeg|image\/png|image\/webp|image\/avif)$/i;

const REPAIR = [
  { type: "sub", slug: "ftl-ltl-transportation", qs: ["truck fleet convoy highway", "semi trucks line"], guard: /truck|lorry|semi|highway|road|fleet|convoy|transport|trailer/i },
  { type: "sub", slug: "multimodal-rail-transportation", qs: ["intermodal rail terminal wagons", "ship rail containers port terminal"], guard: /rail|train|intermodal|wagon|termin[a|l]|container|locomotive|freight|yard/i },
  { type: "sub", slug: "distribution-fulfillment", qs: ["parcel conveyor sorting machine", "logistics center conveyor parcels"], guard: /parcel|sort|conveyor|dispatch|package|logistics|warehouse|fulfil|latex|belt/i },
  { type: "sub", slug: "inventory-management", qs: ["warehouse worker barcode scanner", "stocktaking warehouse scanner"], guard: /barcode|scan|scanner|inventory|warehouse|stock|worker/i },
  { type: "sub", slug: "loading-unloading", qs: ["loading dock truck forklift", "warehouse dock ramp truck"], guard: /dock|forklift|loading|unloading|warehouse|truck|pallet|dockmaker/i },
  { type: "sub", slug: "end-to-end-project-logistics", qs: ["mobile crane heavy lift", "crane lifting heavy load construction"], guard: /crane|lift|heavy|hoist|project|construction|load/i },
];

const used = new Set();
const journal = [];
async function pagesOf(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&gsrnamespace=6&gsrlimit=25&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&format=json&origin=*`;
  for (let retry = 0; retry < 3; retry++) {
    const res = await fetch(url, { headers: { "User-Agent": "ArrowlineCMS/1.0" } });
    if (!res.ok) { await new Promise((r) => setTimeout(r, 3500)); continue; }
    return Object.values((await res.json())?.query?.pages || {});
  }
  return [];
}

for (const rec of REPAIR) {
  process.stdout.write(rec.slug + " ... ");
  let hit = null;
  for (const q of rec.qs) {
    const pages = await pagesOf(q);
    const candidate = pages.find((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return false;
      if (!ALLOWED_MIME.test(ii.mime)) return false;
      if (!ALLOWED_LIC.test(ii.extmetadata?.LicenseShortName?.value || "")) return false;
      if (!rec.guard.test(p.title)) return false;
      if (used.has(ii.thumburl || ii.url)) return false;
      if (ii.width < 900 || ii.height < 600) return false;
      return true;
    });
    if (candidate) { hit = candidate.imageinfo[0]; hit.title = candidate.title; break; }
  }
  if (!hit) { console.log("NO FOUND"); continue; }
  used.add(hit.thumburl || hit.url);
  await new Promise((r) => setTimeout(r, 250));
  const buf = Buffer.from(await (await fetch(hit.thumburl || hit.url)).arrayBuffer());
  if (buf.length < 15000) { console.log("TOO SMALL", buf.length); continue; }
  const ext = hit.mime === "image/jpeg" ? "jpg" : hit.mime === "image/png" ? "png" : "webp";
  const fname = `${rec.type}-${rec.slug}.${ext}`;
  writeFileSync(join(DEST, fname), buf);
  journal.push({ type: rec.type, slug: rec.slug, publicPath: `/images/services/${fname}`, commons_title: hit.title, license: hit.extmetadata?.LicenseShortName?.value, artist: (hit.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 80), w: hit.width, h: hit.height, bytes: buf.length });
  console.log("OK", fname, String(buf.length).padStart(6));
}

// merge with existing attributions, update DB
const attrPath = join(DEST, "ATTRIBUTIONS.json");
const all = JSON.parse(readFileSync(attrPath, "utf8"));
const keptIdx = new Map(all.map((r, i) => [`${r.type}:${r.slug}`, i]));
for (const rec of journal) {
  const key = `${rec.type}:${rec.slug}`;
  if (keptIdx.has(key)) all[keptIdx.get(key)] = rec;
  else { keptIdx.set(key, all.length); all.push(rec); }
}
import { readFileSync } from "node:fs";
writeFileSync(attrPath, JSON.stringify(all, null, 2));

const svcLookup = Object.fromEntries(all.filter((r) => r.type === "svc").map((r) => [r.slug, r]));
const subLookup = Object.fromEntries(all.filter((r) => r.type === "sub").map((r) => [r.slug, r]));
const { data: svc } = await DB.from("services").select("id,slug");
const { data: items } = await DB.from("service_items").select("id,slug");
let upd = 0;
for (const s of svc) { const a = svcLookup[s.slug]; if (a) { await DB.from("services").update({ hero_image: a.publicPath, image_alt: s.slug.replace(/-/g, " ").trim() }).eq("id", s.id); upd++; } }
for (const it of items) { const a = subLookup[it.slug]; if (a) { await DB.from("service_items").update({ hero_image: a.publicPath, image_alt: it.slug.replace(/-/g, " ").trim() }).eq("id", it.id); upd++; } }
console.log("DB rows updated:", upd, "| repaired:", journal.length);