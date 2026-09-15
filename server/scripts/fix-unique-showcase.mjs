import "dotenv/config";

const ADMIN = "http://localhost:5000/api/admin";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const pngBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

async function uploadToCloudinary(name, folder) {
  const fd = new FormData();
  fd.append("file", new Blob([pngBuffer], { type: "image/png" }), `${name}.png`);
  fd.append("folder", folder);
  const res = await fetch(ADMIN + "/media", {
    method: "POST",
    headers: { Cookie: `admin_token=${ADMIN_TOKEN}` },
    body: fd,
  });
  const data = await res.json();
  return data.data;
}

async function updateShowcase(id, imageUrl, publicId) {
  const res = await fetch(ADMIN + `/showcase/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: `admin_token=${ADMIN_TOKEN}` },
    body: JSON.stringify({ image_url: imageUrl, image_public_id: publicId }),
  });
  return res.json();
}

async function getShowcase(token) {
  const res = await fetch("http://localhost:5000/api/admin/services", {
    headers: { Cookie: `admin_token=${token}` },
  });
  return res.json();
}

(async () => {
  // Need to create session first
  const { createClient } = require("@supabase/supabase-js");
  const jwt = require("jsonwebtoken");
  const { randomUUID } = require("node:crypto");
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find((u) => u.email === process.env.ADMIN_EMAIL);
  const jti = randomUUID();
  const token = jwt.sign({ role: "admin", email: process.env.ADMIN_EMAIL, jti }, process.env.ADMIN_API_KEY, { expiresIn: "1d" });
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await supabase.from("admin_sessions").insert({ jti, user_id: user.id, email: process.env.ADMIN_EMAIL, expires_at: expiresAt.toISOString() });

  // Get showcase data
  const servicesRes = await fetch(ADMIN + "/services", { headers: { Cookie: `admin_token=${token}` } });
  const servicesData = await servicesRes.json();
  const services = servicesData.data || [];

  const serviceColors = {
    "road-transportation": [255, 107, 26],
    "rail-transportation": [30, 58, 138],
    "project-cargo-transportation": [16, 185, 129],
    "warehousing-storage": [220, 38, 38],
  };

  let updated = 0;
  for (const svc of services) {
    const color = serviceColors[svc.slug] || [100, 100, 100];
    const png = Buffer.from(
      "89504e470d0a1a0a0000000d4948445200000001000000010802000000" +
        color.map((c) => c.toString(16).padStart(2, "0")).join("") +
        "0000000b49444154789c620000000200010d0a0d0a0000000049454e44ae426082",
      "hex"
    );

    // Upload unique image per service
    const fd = new FormData();
    fd.append("file", new Blob([png], { type: "image/png" }), `showcase-${svc.slug}.png`);
    fd.append("folder", `services/${svc.slug}/showcase`);
    const uploadRes = await fetch(ADMIN + "/media", {
      method: "POST",
      headers: { Cookie: `admin_token=${token}` },
      body: fd,
    });
    const uploadData = await uploadRes.json();

    if (uploadData.data?.url) {
      // Update all showcase items for this service
      const items = svc.showcaseItems || [];
      for (const item of items) {
        const updRes = await fetch(ADMIN + `/showcase/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Cookie: `admin_token=${token}` },
          body: JSON.stringify({ image_url: uploadData.data.url, image_public_id: uploadData.data.public_id }),
        });
        if (updRes.ok) {
          updated++;
        }
      }
      console.log(`Updated ${items.length} showcase items for ${svc.slug}`);
    }
  }

  console.log(`Total updated: ${updated}`);
})();
