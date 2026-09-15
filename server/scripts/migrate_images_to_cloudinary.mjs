// One-shot idempotent migration:
// 1. Uploads every file under public/images/ to Cloudinary with a deterministic
//    public_id (overwrite:true, unique_filename:false) so re-runs are safe.
// 2. Writes server/scripts/_image_map.json (local path -> cloudinary URL).
// 3. Rewrites every local /images/ reference stored in services and
//    service_items rows (hero_image, about_image, gallery[].url,
//    applications[].image) to the matching Cloudinary URL and sets
//    image_public_id for the hero asset.
// 4. Sanitizes corrupted trusted_network.logo values (e.g. "[object Object]").
// Prints a summary; never writes .env values.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import cloudinaryPkg from "cloudinary";

const { v2: cloudinary } = cloudinaryPkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const publicImagesDir = path.join(repoRoot, "public", "images");
const mapPath = path.join(__dirname, "_image_map.json");

if (!fs.existsSync(publicImagesDir)) {
  console.error("public/images not found at", publicImagesDir);
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase env");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function upload(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto", overwrite: true, unique_filename: false, ...options },
      (error, result) => (error ? reject(error) : resolve(result))
    ).end(fileBuffer);
  });
}

const isLocalImageRef = (v) => typeof v === "string" && /^\/images\/[\w./-]+\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(v);

async function uploadAllImages() {
  const map = {};
  const files = [];
  const walk = (dir, prefix) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, `${prefix}${entry.name}/`);
      else files.push({ rel: `${prefix}${entry.name}`, full });
    }
  };
  walk(publicImagesDir, "");

  console.log(`Uploading ${files.length} local images to Cloudinary...`);
  for (const { rel, full } of files) {
    const normalizedRel = rel.split(path.sep).join("/");
    const ext = path.extname(rel).slice(1).toLowerCase();
    if (!/^(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(ext)) continue;
    const isServiceAsset = normalizedRel.startsWith("services/");
    const folder = isServiceAsset ? "arrowline/services" : "arrowline/general";
    const publicId = path.basename(rel, path.extname(rel));
    const key = `/images/${normalizedRel}`;
    try {
      const result = await upload(fs.readFileSync(full), { folder, public_id: publicId });
      map[key] = {
        key,
        file: normalizedRel,
        url: result.secure_url || result.url,
        public_id: result.public_id,
        format: result.format,
        width: result.width || null,
        height: result.height || null,
        bytes: result.bytes || null,
      };
      console.log(`  uploaded ${key} -> ${map[key].public_id}`);
    } catch (err) {
      console.error(`  FAILED ${key}:`, err?.error?.message || err?.message || String(err));
    }
  }
  fs.writeFileSync(mapPath, JSON.stringify(map, null, 2), "utf8");
  console.log(`Image map written to ${mapPath} (${Object.keys(map).length} entries)`);
  return map;
}

function resolveImage(map, value) {
  if (!isLocalImageRef(value)) return value;
  const entry = map[value];
  return entry ? entry.url : value;
}

async function transformAndUpdate(table, rows, map) {
  let changedRefs = 0;
  for (const row of rows) {
    const patch = {};
    const setUrl = (key) => {
      const next = resolveImage(map, row[key]);
      if (next !== row[key]) {
        patch[key] = next;
        changedRefs += 1;
      }
    };

    setUrl("hero_image");
    setUrl("about_image");

    // hero -> image_public_id (only when the hero is a local file we uploaded)
    if (isLocalImageRef(row.hero_image) && map[row.hero_image] && !row.image_public_id) {
      patch.image_public_id = map[row.hero_image].public_id;
    }

    if (Array.isArray(row.gallery)) {
      const next = row.gallery.map((item) => {
        const url = resolveImage(map, item?.url);
        return url === item?.url ? item : { ...item, url };
      });
      if (JSON.stringify(next) !== JSON.stringify(row.gallery)) {
        patch.gallery = next;
        changedRefs += 1;
      }
    }

    if (Array.isArray(row.applications)) {
      const next = row.applications.map((item) => {
        const image = resolveImage(map, item?.image);
        return image === item?.image ? item : { ...item, image };
      });
      if (JSON.stringify(next) !== JSON.stringify(row.applications)) {
        patch.applications = next;
        changedRefs += 1;
      }
    }

    if (Object.keys(patch).length === 0) continue;

    const { error } = await supabase.from(table).update(patch).eq("id", row.id);
    if (error) console.error(`  UPDATE FAILED ${table}/${row.slug} (${row.id}):`, error.message);
    else console.log(`  updated ${table}/${row.slug} fields=${Object.keys(patch).join(",")}`);
  }
  return changedRefs;
}

async function sanitizeTrustedNetwork() {
  const { data: trusted, error } = await supabase.from("trusted_network").select("id,name,logo");
  if (error) { console.error("Trusted fetch error:", error.message); return 0; }
  let fixed = 0;
  for (const t of trusted || []) {
    const valid = typeof t.logo === "string" && /^https?:\/\//i.test(t.logo);
    if (t.logo && !valid) {
      await supabase.from("trusted_network").update({ logo: null }).eq("id", t.id);
      console.log(`  sanitized trusted_network/${t.name}: removed invalid logo`);
      fixed += 1;
    }
  }
  return fixed;
}

async function verifyNoLocalsRemain() {
  const isLocal = (v) => typeof v === "string" && /^\/images\//.test(v);
  const count = (rows) => {
    let n = 0;
    const walkLocal = (obj) => {
      if (!obj || typeof obj !== "object") return;
      if (Array.isArray(obj)) { obj.forEach(walkLocal); return; }
      for (const v of Object.values(obj)) {
        if (isLocal(v)) n += 1;
        else if (v && typeof v === "object") walkLocal(v);
      }
    };
    rows.forEach(walkLocal);
    return n;
  };

  const [s, i, t] = await Promise.all([
    supabase.from("services").select("*"),
    supabase.from("service_items").select("*"),
    supabase.from("trusted_network").select("*"),
  ]);
  const servicesLeft = count(s.data || []);
  const itemsLeft = count(i.data || []);
  const trustedInvalid = (t.data || []).filter((x) => x.logo && !/^https?:\/\//i.test(String(x.logo))).length;
  return { servicesLeft, itemsLeft, trustedInvalid };
}

const map = await uploadAllImages();

console.log("\n=== Updating services ===");
const { data: services, error: svcErr } = await supabase.from("services").select("*");
if (svcErr) console.error("Fetch services error:", svcErr.message);
else await transformAndUpdate("services", services || [], map);

console.log("\n=== Updating service_items ===");
const { data: items, error: itemErr } = await supabase.from("service_items").select("*");
if (itemErr) console.error("Fetch service_items error:", itemErr.message);
else await transformAndUpdate("service_items", items || [], map);

console.log("\n=== Sanitizing trusted_network ===");
await sanitizeTrustedNetwork();

console.log("\n=== Verify ===");
const remaining = await verifyNoLocalsRemain();
console.log(JSON.stringify(remaining, null, 2));
if (remaining.servicesLeft === 0 && remaining.itemsLeft === 0 && remaining.trustedInvalid === 0) {
  console.log("OK: no local /images/ references remain in services, service_items or trusted_network.");
} else {
  console.log("WARNING: some local/invalid references remain (see above).");
}