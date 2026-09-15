import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import cloudinaryPkg from "cloudinary";

const { v2: cloudinary } = cloudinaryPkg;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase env");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

const pick = (row) => ({
  id: row?.id,
  slug: row?.slug,
  title: row?.title,
  is_published: row?.is_published,
  display_order: row?.display_order,
  hero_image: row?.hero_image,
  hero_video: row?.hero_video,
  hero_fallback_image: row?.hero_fallback_image,
  image_alt: row?.image_alt,
  image_public_id: row?.image_public_id,
  about_image: row?.about_image,
  video_url: row?.video_url,
  video_poster: row?.video_poster,
  gallery_count: Array.isArray(row?.gallery) ? row.gallery.length : null,
  applications_count: Array.isArray(row?.applications) ? row.applications.length : null,
  process_count: Array.isArray(row?.process_steps) ? row.process_steps.length : null,
  why_count: Array.isArray(row?.why_arrowline) ? row.why_arrowline.length : null,
  faqs_count: Array.isArray(row?.faqs) ? row.faqs.length : null,
  capabilities_count: Array.isArray(row?.capabilities) ? row.capabilities.length : null,
});

const { data: services, error: errServices } = await supabase
  .from("services")
  .select("*")
  .order("display_order");

console.log("=== SERVICES ===");
if (errServices) console.log("ERR:", errServices.message);
else {
  console.log("count:", services.length);
  for (const s of services) console.log(JSON.stringify(pick(s)));
}

const { data: items, error: errItems } = await supabase
  .from("service_items")
  .select("*")
  .order("display_order");

console.log("\n=== SERVICE_ITEMS ===");
if (errItems) console.log("ERR:", errItems.message);
else {
  console.log("count:", items.length);
  for (const s of items) console.log(JSON.stringify({ ...pick(s), service_id: s.service_id, parent_slug: s.parent_slug }));
}

const { data: trusted, error: errTrusted } = await supabase
  .from("trusted_network")
  .select("id,name,category,website,logo,logo_public_id,logo_format,logo_alt,is_published,display_order,is_featured")
  .order("display_order");

console.log("\n=== TRUSTED_NETWORK ===");
if (errTrusted) console.log("ERR:", errTrusted.message);
else {
  console.log("count:", trusted.length);
  for (const t of trusted) console.log(JSON.stringify(t));
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("\n=== CLOUDINARY (resource_type image, max 200) ===");
try {
  const res = await cloudinary.search
    .expression("resource_type:image")
    .max_results(200)
    .sort_by("created_at", "desc")
    .execute();
  console.log("count:", (res.resources || []).length);
  for (const r of res.resources || []) {
    console.log(JSON.stringify({ public_id: r.public_id, folder: r.folder, format: r.format, width: r.width, height: r.height, secure_url: r.secure_url ? "present" : "missing" }));
  }
} catch (err) {
  console.log("CLOUDINARY ERR:", err.error?.message || err.message || JSON.stringify(err));
}