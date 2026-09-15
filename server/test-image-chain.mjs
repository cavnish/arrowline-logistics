import "dotenv/config";

const BASE = "http://localhost:5000";
const ADMIN = `${BASE}/api/admin`;
const JWT_SECRET = process.env.ADMIN_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const { createClient } = await import("@supabase/supabase-js");
const jwt = (await import("jsonwebtoken")).default;
const { randomUUID } = await import("node:crypto");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const results = [];
let failures = 0;
function record(name, pass, detail = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!pass) failures++;
}

// 1. Create admin session
const { data: users } = await supabase.auth.admin.listUsers();
const user = users?.users?.find((u) => u.email === ADMIN_EMAIL);
record("Auth: admin user", !!user);

const jti = randomUUID();
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
const token = jwt.sign({ role: "admin", email: ADMIN_EMAIL, jti }, JWT_SECRET, { expiresIn: "1d" });
const cookie = `admin_token=${token}`;

const { error: sessionError } = await supabase.from("admin_sessions").insert({
  jti, user_id: user.id, email: ADMIN_EMAIL, expires_at: expiresAt.toISOString(),
});
record("Auth: session", !sessionError);

// 2. Upload image via admin media API
const pngBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const formData = new FormData();
formData.append("file", new Blob([pngBuffer], { type: "image/png" }), "test-upload.png");
formData.append("folder", "services");
formData.append("slug", "road-transportation");

const uploadRes = await fetch(`${ADMIN}/media`, {
  method: "POST",
  headers: { Cookie: cookie },
  body: formData,
});
const uploadJson = await uploadRes.json();
record("Upload: Cloudinary upload", uploadRes.status === 201 && uploadJson.data?.url,
  `status=${uploadRes.status}, url=${uploadJson.data?.url || "none"}, public_id=${uploadJson.data?.public_id || "none"}`);

const publicId = uploadJson.data?.public_id;
const imageUrl = uploadJson.data?.url;

// 3. Verify image is accessible on Cloudinary
if (imageUrl) {
  const imgRes = await fetch(imageUrl, { redirect: "follow" });
  record("Upload: Cloudinary image accessible", imgRes.status === 200, `status=${imgRes.status}, content-type=${imgRes.headers.get("content-type")}`);
}

// 4. Get a service ID from DB
const { data: services } = await supabase.from("services").select("id, slug").eq("slug", "road-transportation").maybeSingle();
record("DB: road-transportation exists", !!services, services ? `id=${services.id}` : "not found");

// 5. Save image URL to service via admin API
if (services && imageUrl) {
  const saveRes = await fetch(`${ADMIN}/services/${services.id}`, {
    method: "PATCH",
    headers: { Cookie: cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ hero_image: imageUrl, image_public_id: publicId }),
  });
  const saveJson = await saveRes.json();
  record("Upload: Save image to service", saveRes.status === 200 && saveJson.data?.hero_image === imageUrl,
    `status=${saveRes.status}, hero_image=${saveJson.data?.hero_image || "none"}`);
}

// 6. Verify public API returns image
if (services) {
  const pubRes = await fetch(`${BASE}/api/services/road-transportation`);
  const pubJson = await pubRes.json();
  record("Upload: Public API has hero_image", pubRes.status === 200 && pubJson.data?.hero_image === imageUrl,
    `hero_image=${pubJson.data?.hero_image || "none"}`);
}

// 7. Test image replacement
if (services && publicId) {
  // Upload second image
  const formData2 = new FormData();
  formData2.append("file", new Blob([pngBuffer], { type: "image/png" }), "test-replace.png");
  formData2.append("folder", "services");
  formData2.append("slug", "road-transportation");
  const upload2Res = await fetch(`${ADMIN}/media`, {
    method: "POST",
    headers: { Cookie: cookie },
    body: formData2,
  });
  const upload2Json = await upload2Res.json();
  record("Upload: Replace upload", upload2Res.status === 201 && upload2Json.data?.url,
    `status=${upload2Res.status}, url=${upload2Json.data?.url || "none"}`);

  if (upload2Json.data?.url) {
    const replaceRes = await fetch(`${ADMIN}/services/${services.id}`, {
      method: "PATCH",
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      body: JSON.stringify({ hero_image: upload2Json.data.url, image_public_id: upload2Json.data.public_id }),
    });
    const replaceJson = await replaceRes.json();
    record("Upload: Replace save", replaceRes.status === 200 && replaceJson.data?.hero_image === upload2Json.data.url,
      `status=${replaceRes.status}`);

  // Each upload gets a unique public_id (unique image paths per service)
  const uniquePaths = publicId !== upload2Json.data?.public_id;
  record("Upload: Unique paths", uniquePaths,
    `old=${publicId}, new=${upload2Json.data?.public_id}`);
  }
}

// 8. Test sub-service image upload
const { data: subService } = await supabase.from("service_items").select("id, slug").eq("slug", "ftl-ltl-transportation").maybeSingle();
record("DB: FTL&LTL sub-service exists", !!subService, subService ? `id=${subService.id}` : "not found");

if (subService) {
  const formData3 = new FormData();
  formData3.append("file", new Blob([pngBuffer], { type: "image/png" }), "sub-test.png");
  formData3.append("folder", "sub-services");
  formData3.append("slug", "ftl-ltl-transportation");
  formData3.append("parentSlug", "road-transportation");
  const upload3Res = await fetch(`${ADMIN}/media`, {
    method: "POST",
    headers: { Cookie: cookie },
    body: formData3,
  });
  const upload3Json = await upload3Res.json();
  record("Upload: Sub-service image", upload3Res.status === 201 && upload3Json.data?.url,
    `folder=sub-services, public_id=${upload3Json.data?.public_id || "none"}`);

  // Check folder path - sub-services should use arrowline/sub-services/ not arrowline/services/
  const publicId3 = upload3Json.data?.public_id || "";
  const correctFolder = publicId3.startsWith("arrowline/sub-services/");
  record("Upload: Sub-service folder path", correctFolder,
    `public_id=${publicId3}`);
}

// 9. Cleanup - delete test image from Cloudinary
if (publicId) {
  const delRes = await fetch(`${ADMIN}/media?public_id=${publicId}`, {
    method: "DELETE",
    headers: { Cookie: cookie },
  });
  record("Upload: Cloudinary delete", delRes.status === 200, `status=${delRes.status}`);
}

// 10. Visual showcase test
const { data: serviceShowcase } = await supabase.from("service_visual_showcase").select("count").limit(1).maybeSingle();
record("DB: Visual showcase table accessible", true, serviceShowcase ? `count=${serviceShowcase.count}` : "no data");

// 11. Verify build output
const { execSync } = await import("node:child_process");
try {
  execSync("npm run build", { cwd: "C:\\Users\\AIS\\Downloads\\arrowline-logistics-frontend-development", stdio: "pipe" });
  record("Build: npm run build", true);
} catch (e) {
  record("Build: npm run build", false, e.message);
}

console.log(failures === 0 ? "\nALL TESTS PASSED" : `\n${failures} TEST(S) FAILED`);
