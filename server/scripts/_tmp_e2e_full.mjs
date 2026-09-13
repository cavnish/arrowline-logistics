import "dotenv/config";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const API = "http://localhost:5000";
const EMAIL = (process.env.ADMIN_EMAIL || "web.grow.india07@gmail.com").split(",")[0].trim().toLowerCase();
const JWT_SECRET = process.env.ADMIN_API_KEY;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

let cookie = "";

async function createSession() {
  const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
  const user = (users.users || []).find((u) => u.email === EMAIL);
  if (!user) throw new Error("Admin auth user not found: " + EMAIL);

  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const token = jwt.sign({ role: "admin", email: EMAIL, jti }, JWT_SECRET, { expiresIn: "1h" });

  const { error } = await supabase.from("admin_sessions").insert({
    jti,
    user_id: user.id,
    email: EMAIL,
    expires_at: expiresAt.toISOString(),
  });
  if (error) throw new Error("Session insert failed: " + error.message);
  cookie = `admin_token=${token}`;
  console.log(`[session] created for ${EMAIL} (jti=${jti.slice(0, 8)}…)`);
}

async function req(method, path, { body, form } = {}) {
  const headers = { Cookie: cookie };
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(API + path, { method, headers, body: payload });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

let pass = 0, fail = 0;
function check(name, cond, extra = "") {
  if (cond) { pass++; console.log(`  ✓ ${name} ${extra}`); }
  else { fail++; console.log(`  ✗ FAIL: ${name} ${extra}`); }
}

// 1x1 PNG
const TINY_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function main() {
  await createSession();

  // --- Auth endpoints ---
  let r = await req("GET", "/api/admin/me");
  check("GET /me (authed)", r.status === 200 && r.json?.data?.authenticated === true, `(${r.status})`);

  r = await req("GET", "/api/admin/stats");
  check("GET /stats", r.status === 200 && typeof r.json?.data?.total === "number", `total=${r.json?.data?.total}`);

  r = await req("GET", "/api/admin/services");
  check("GET services (4)", r.status === 200 && r.json?.data?.length === 4, `(${r.json?.data?.length})`);

  r = await req("GET", "/api/admin/service-items");
  check("GET service-items (22)", r.status === 200 && r.json?.data?.length === 22, `(${r.json?.data?.length})`);

  // --- Services CRUD ---
  const svcTitle = "_e2e_test_service";
  r = await req("POST", "/api/admin/services", { body: { title: svcTitle, slug: "_e2e-test-service", short_description: "temp", is_published: false, display_order: 999 } });
  check("Service CREATE", r.status === 201 && r.json?.data?.id, `(${r.status})`);
  const srvId = r.json?.data?.id;
  if (srvId) {
    const upd = await req("PATCH", `/api/admin/services/${srvId}`, { body: { title: "_e2e_test_service_updated", display_order: 1000 } });
    check("Service UPDATE", upd.status === 200 && upd.json?.data?.title === "_e2e_test_service_updated", `(${upd.status})`);
    const dup = await req("POST", "/api/admin/services", { body: { title: "dup", slug: "_e2e-test-service", short_description: "x", is_published: false } });
    check("Service DUPLICATE slug rejected", dup.status === 400, `(${dup.status})`);
    const del = await req("DELETE", `/api/admin/services/${srvId}`);
    check("Service DELETE", del.status === 200, `(${del.status})`);
  }

  // --- Service Items CRUD ---
  const { json: srvList } = await req("GET", "/api/admin/services");
  const road = (srvList.data || []).find((s) => s.slug === "road-transportation");
  let itemId;
  if (road) {
    r = await req("POST", "/api/admin/service-items", { body: { service_id: road.id, parent_slug: "road-transportation", title: "_e2e_test_item", slug: "_e2e-test-item", short_description: "temp", is_published: false, display_order: 999 } });
    check("Service-Item CREATE", r.status === 201 && r.json?.data?.id, `(${r.status})`);
    itemId = r.json?.data?.id;
    if (itemId) {
      const upd = await req("PATCH", `/api/admin/service-items/${itemId}`, { body: { title: "_e2e_test_item_updated" } });
      check("Service-Item UPDATE", upd.status === 200 && upd.json?.data?.title === "_e2e_test_item_updated", `(${upd.status})`);
      const del = await req("DELETE", `/api/admin/service-items/${itemId}`);
      check("Service-Item DELETE", del.status === 200, `(${del.status})`);
      itemId = null;
    }
  }

  // --- Generic collection CRUD: clients ---
  r = await req("POST", "/api/admin/clients", { body: { name: "_e2e_test_client", logo: "/images/business-handshake.jpg", category: "test", is_published: false, display_order: 999 } });
  check("Client CREATE", r.status === 201 && r.json?.data?.id, `(${r.status})`);
  const clientId = r.json?.data?.id;
  if (clientId) {
    const upd = await req("PATCH", `/api/admin/clients/${clientId}`, { body: { name: "_e2e_test_client_updated" } });
    check("Client UPDATE", upd.status === 200 && upd.json?.data?.name === "_e2e_test_client_updated", `(${upd.status})`);
    const del = await req("DELETE", `/api/admin/clients/${clientId}`);
    check("Client DELETE", del.status === 200, `(${del.status})`);
  }

  // --- Content GET/PUT ---
  const k = "_e2e_test_key";
  r = await req("PUT", `/api/admin/content/${k}`, { body: { content_value: "hello e2e", content_type: "text", is_published: true } });
  check("Content PUT (create)", r.status === 200 && r.json?.data?.content_value === "hello e2e", `(${r.status})`);
  r = await req("PUT", `/api/admin/content/${k}`, { body: { content_value: "hello e2e v2" } });
  check("Content PUT (update)", r.status === 200 && r.json?.data?.content_value === "hello e2e v2", `(${r.status})`);
  const { error: delErr } = await supabase.from("site_content").delete().eq("content_key", k);
  check("Content cleanup", !delErr, delErr?.message || "");

  // --- Media: REAL CLOUDINARY UPLOAD ---
  const buf = Buffer.from(TINY_PNG_B64, "base64");
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: "image/png" }), "_e2e_upload.png");
  fd.append("folder", "general");
  r = await req("POST", "/api/admin/media", { form: fd });
  check("Media UPLOAD (Cloudinary)", r.status === 201 && r.json?.data?.url, `(${r.status}) provider=${r.json?.data?.provider}`);
  const publicId = r.json?.data?.public_id;
  const uploadedUrl = r.json?.data?.url;

  // --- Media list ---
  r = await req("GET", "/api/admin/media/list");
  const inList = publicId && (r.json?.data || []).some((m) => m.public_id === publicId);
  check("Media LIST contains upload", r.status === 200 && inList, `(${r.status})`);

  // --- Put the uploaded image on a service then replace (tests image swap) ---
  if (publicId) {
    const { json: svcList2 } = await req("GET", "/api/admin/services");
    const wm = (svcList2.data || []).find((s) => s.slug === "warehousing-storage");
    if (wm) {
      // PATCH hero_image off (don't leave a test URL on a live service) — same call that renders on the website.
      const patched = await req("PATCH", `/api/admin/services/${wm.id}`, { body: { hero_image: uploadedUrl, image_public_id: publicId, image_alt: "e2e test image" } });
      check("Service image ASSIGN", patched.status === 200 && patched.json?.data?.hero_image === uploadedUrl, `(${patched.status})`);
      // Verify public API returns it (live update)
      const pub = await (await fetch(API + "/api/services/warehousing-storage")).json();
      check("Public API shows new image", pub.data?.hero_image === uploadedUrl, "");
      // Remove assignment (revert)
      const revert = await req("PATCH", `/api/admin/services/${wm.id}`, { body: { hero_image: "/images/services/svc-warehousing-storage.jpg", image_public_id: null } });
      check("Service image REVERT", revert.status === 200, `(${revert.status})`);
    }
  }

  // --- Media DELETE (Cloudinary) ---
  if (publicId) {
    r = await req("DELETE", `/api/admin/media?public_id=${encodeURIComponent(publicId)}`);
    check("Media DELETE (Cloudinary)", r.status === 200, `(${r.status}) ${r.json?.data ? JSON.stringify(r.json.data) : r.json?.message || ""}`);
  }

  // --- Lead flow (public) + Resend ---
  const leadRes = await fetch(API + "/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "E2E Tester", company: "E2E Corp", email: "e2etest.arrowline+noreply@gmail.com", phone: "+919999999999", service: "Road Transportation", message: "Automated E2E verification during production audit." }),
  });
  const lead = await leadRes.json();
  check("Lead CREATE (public)", leadRes.status === 201 && Boolean(lead.referenceNumber), `(${leadRes.status}) ref=${lead.referenceNumber || "?"} emailSent=${lead.emailSent ?? "?"} db=${lead.storedInDatabase ?? "?"}`);
  console.log(`  [resend] customerEmail/lead note -> ${lead.message || ""}`);

  // find lead id and clean up
  const leadQ = await req("GET", `/api/admin/enquiries?search=${encodeURIComponent("E2E Corp")}&limit=5`);
  const found = (leadQ.json?.data || []).find((l) => l.company === "E2E Corp" && l.name === "E2E Tester");
  if (found) {
    const note = await req("POST", `/api/admin/enquiries/${found.id}/notes`, { body: { note: "_e2e note" } });
    check("Enquiry NOTE add", note.status === 201, `(${note.status})`);
    const delLead = await req("DELETE", `/api/admin/enquiries/${found.id}`);
    check("Enquiry DELETE", delLead.status === 200, `(${delLead.status})`);
  } else {
    check("Enquiry find after create", false, "(lead not found via admin search)");
  }

  console.log(`\n==== RESULT: ${pass} passed, ${fail} failed ====`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("E2E ERROR:", e); process.exit(1); });