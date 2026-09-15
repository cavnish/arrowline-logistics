// E2E probe for the trusted-network endpoints (public + admin).
// Requires server running on :5000, admin creds in server/.env (dotenv loads it).
import "dotenv/config";
import fs from "node:fs";

const PUBLIC_API = "http://localhost:5000/api";
const ADMIN_API = "http://localhost:5000/api/admin";
const EMAIL = "web.grow.india07@gmail.com";
const PASSWORD = process.env.ADMIN_TEST_PASSWORD;

let cookie = "";

async function req(path, { method = "GET", body, isMultipart = false } = {}) {
  const headers = {};
  if (cookie) headers["Cookie"] = cookie;
  if (body !== undefined && !isMultipart) headers["Content-Type"] = "application/json";
  const res = await fetch(ADMIN_API + path, {
    method,
    headers,
    credentials: "include",
    body: isMultipart ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json, setCookie };
}

function tinyPng() {
  const b64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  return Buffer.from(b64, "base64");
}

function extractCookie(setCookie) {
  if (!setCookie) return "";
  const m = /admin_token=([^;]+)/.exec(setCookie);
  return m ? `admin_token=${m[1]}` : "";
}

async function main() {
  // Public endpoint
  const pub = await fetch(PUBLIC_API + "/trusted-network");
  const pubJson = await pub.json();
  console.log(`PUBLIC /api/trusted-network -> ${pub.status} count=${(pubJson.data || []).length}`);
  for (const item of (pubJson.data || []).slice(0, 3)) {
    console.log(`   ${item.display_order_disabled ?? ""}${item.name} | ${item.category} | logo=${item.logo ? "set" : "empty"} | keys=${Object.keys(item).join(",")}`);
  }

  // Login
  let r = await req("/login", { method: "POST", body: { email: EMAIL, password: PASSWORD } });
  console.log(`LOGIN -> ${r.status}`);
  cookie = extractCookie(r.setCookie);

  if (!cookie) {
    console.error("Login failed — aborting.");
    return;
  }

  // Admin list
  r = await req("/trusted-network");
  console.log(`ADMIN GET /trusted-network -> ${r.status} count=${(r.json?.data || []).length}`);

  // Admin create WITHOUT logo (URL only) - should succeed (no Cloudinary needed)
  r = await req("/trusted-network", {
    method: "POST",
    body: {
      name: "Acme Test Corp",
      category: "Test Partner",
      description: "temp",
      website: "https://acme.example.com",
      display_order: 0,
      is_published: false,
      logo: "https://example.com/acme-logo.png",
    },
  });
  console.log(`ADMIN CREATE (URL logo) -> ${r.status} ${r.json?.message || ""} id=${r.json?.data?.id || "-"}`);

  // Admin create WITH file (multipart) - should reach Cloudinary (expected to fail with stub creds)
  const fd = new FormData();
  fd.append("name", "Acme Test Corp File");
  fd.append("is_published", "false");
  fd.append("display_order", "0");
  fd.append("logo", new Blob([tinyPng()], { type: "image/png" }), "acme.png");
  r = await req("/trusted-network", { method: "POST", isMultipart: true, body: fd });
  console.log(`ADMIN CREATE (multipart logo) -> ${r.status} body=${JSON.stringify(r.json)}`);

  // Admin create invalid (no logo)
  r = await req("/trusted-network", { method: "POST", body: { name: "No Logo Co", is_published: true } });
  console.log(`ADMIN CREATE (no logo, expect 400) -> ${r.status} message=${r.json?.message || ""}`);

  // Cleanup the URL-created record
  const createdId = (await req("/trusted-network?search=Acme Test Corp")).json?.data?.[0]?.id;
  if (createdId) {
    const del = await req(`/trusted-network/${createdId}`, { method: "DELETE" });
    console.log(`ADMIN DELETE cleanup -> ${del.status}`);
  }

  // PUT update (JSON)
  const firstId = (await req("/trusted-network?sort=order")).json?.data?.[0]?.id;
  if (firstId) {
    const upd = await req(`/trusted-network/${firstId}`, {
      method: "PUT",
      body: { name: "Reliance", website: "", is_published: true, display_order: 1 },
    });
    console.log(`ADMIN UPDATE -> ${upd.status} ${upd.json?.message || ""}`);
  }

  // Logout
  r = await req("/logout", { method: "POST" });
  console.log(`LOGOUT -> ${r.status}`);
}

main().catch((e) => { console.error("PROBE FAIL:", e); process.exit(1); });