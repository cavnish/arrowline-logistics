import "dotenv/config";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6IndlYi5ncm93LmluZGlhMDdAZ21haWwuY29tIiwianRpIjoiMmExMWIxZDItNWU0MS00NTg3LWFmNTctYzljZjFkZjVhM2VkIiwiaWF0IjoxNzg5MzgyMDg3LCJleHAiOjE3ODk0Njg0ODd9.-iLWS0hNNIhrkXTzp5LQA7zitF9r2vC04bfTKn0NgU8";

// 1x1 transparent PNG base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const pngBuffer = Buffer.from(pngBase64, "base64");

const formData = new FormData();
const blob = new Blob([pngBuffer], { type: "image/png" });
formData.append("file", blob, "test-logo.png");
formData.append("folder", "trusted-network");

async function test() {
  // 1. Upload to Cloudinary via admin media endpoint
  const res = await fetch("http://localhost:5000/api/admin/media", {
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
  const updateRes = await fetch("http://localhost:5000/api/admin/trusted-network/" + recordId, {
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
  const pubRes = await fetch("http://localhost:5000/api/trusted-network");
  const pubJson = await pubRes.json();
  const reliance = pubJson.data.find(t => t.name === "Reliance");
  console.log("Public API Reliance logo:", reliance?.logo);
}

test().catch(console.error);