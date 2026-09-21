import "dotenv/config";

// Test utility for the trusted-network upload flow. It obtains a fresh admin
// cookie by logging in with credentials from the environment — never with a
// hardcoded token. Set TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD in server/.env
// (the account must be on the ADMIN_EMAIL(S) allowlist).
const API = process.env.API_URL || "http://localhost:5000";

async function getAdminToken() {
  const email = process.env.TEST_ADMIN_EMAIL;
  const password = process.env.TEST_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in server/.env to run this test script.");
  }
  const res = await fetch(`${API}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`Admin login failed (${res.status}): ${JSON.stringify(json)}`);
  }
  const setCookie = res.headers.getSetCookie?.().join("; ") || res.headers.get("set-cookie") || "";
  const match = setCookie.match(/admin_token=([^;]+)/);
  if (!match) {
    throw new Error("Login succeeded but no admin_token cookie was returned.");
  }
  return match[1];
}

// 1x1 transparent PNG base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const pngBuffer = Buffer.from(pngBase64, "base64");

const formData = new FormData();
const blob = new Blob([pngBuffer], { type: "image/png" });
formData.append("file", blob, "test-logo.png");
formData.append("folder", "trusted-network");

async function test() {
  const token = await getAdminToken();

  // 1. Upload to Cloudinary via admin media endpoint
  const res = await fetch(`${API}/api/admin/media`, {
    method: "POST",
    headers: { Cookie: "admin_token=" + token },
    body: formData
  });
  const json = await res.json();
  console.log("Upload Status:", res.status);
  console.log("Upload Response:", JSON.stringify(json, null, 2));

  if (!json.success || !json.data?.url) {
    console.error("Upload failed");
    return;
  }

  const logoUrl = json.data.url;
  const recordId = "b9de396b-5049-4346-84ae-755b63b17013"; // Reliance

  // 2. Update trusted-network record with logo URL via PUT /api/admin/trusted-network/:id
  const updateRes = await fetch(`${API}/api/admin/trusted-network/` + recordId, {
    method: "PUT",
    headers: {
      "Cookie": "admin_token=" + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Reliance",
      category: "Petrochemicals",
      description: "Reliance operates across petrochemicals, refining, oil & gas, and retail — a major industrial logistics origin across India.",
      website: "https://www.reliance.com",
      display_order: 1,
      is_published: true,
      is_featured: false,
      logo: logoUrl,
      logo_alt: "Reliance Industries Logo"
    })
  });
  const updateJson = await updateRes.json();
  console.log("Update Status:", updateRes.status);
  console.log("Update Response:", JSON.stringify(updateJson, null, 2));

  // 3. Verify public API shows the logo
  const pubRes = await fetch(`${API}/api/trusted-network`);
  const pubJson = await pubRes.json();
  const reliance = pubJson.data.find(t => t.name === "Reliance");
  console.log("Public API Reliance logo:", reliance?.logo);
}

test().catch(console.error);