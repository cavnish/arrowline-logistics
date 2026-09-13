import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DEST = join(import.meta.dirname, "..", "..", "public", "images", "services");

const FIX = [
  {
    slug: "inventory-management",
    thumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/111-SC-10222_-_Interior_or_large_warehouse_at_Bassens_Docks%2C_Bordeaux%2C_France._-_NARA_-_55180777.jpg/1280px-111-SC-10222_-_Interior_or_large_warehouse_at_Bassens_Docks%2C_Bordeaux%2C_France._-_NARA_-_55180777.jpg",
    lic: "Public domain (NARA)",
    artist: "U.S. National Archives (NARA)",
  },
  {
    slug: "loading-unloading",
    thumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Forklifts_load_crates_onto_trailer_trucks_at_the_warehouse_operated_by_the_1st_Logistical_Command_at_Cam_Ranh_Bay.jpg/1280px-Forklifts_load_crates_onto_trailer_trucks_at_the_warehouse_operated_by_the_1st_Logistical_Command_at_Cam_Ranh_Bay.jpg",
    lic: "Public domain",
    artist: "U.S. Army",
  },
];

for (const f of FIX) {
  const name = `sub-${f.slug}.jpg`;
  process.stdout.write(f.slug + " ... ");
  const res = await fetch(f.thumb, { headers: { "User-Agent": "ArrowlineCMS/1.0" } });
  if (!res.ok) { console.log("HTTP", res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 15000) { console.log("TOO SMALL", buf.length); continue; }
  writeFileSync(join(DEST, name), buf);
  console.log("OK", name, String(buf.length).padStart(6));
  const attrPath = join(DEST, "ATTRIBUTIONS.json");
  const all = JSON.parse(readFileSync(attrPath, "utf8"));
  const rec = all.find((r) => r.slug === f.slug && r.type === "sub");
  if (rec) { rec.license = f.lic; rec.artist = f.artist; rec.bytes = buf.length; writeFileSync(attrPath, JSON.stringify(all, null, 2)); }
}
console.log("done");