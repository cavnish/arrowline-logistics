#!/usr/bin/env node
/**
 * Phase 2 — Testimonials CMS full E2E verification
 *
 * Run from repo root:  node server/scripts/_final_testimonials_e2e.mjs
 *
 * Tests:
 * 1. Admin login → cookie
 * 2. Search filter bug fix verification (numeric columns excluded from OR search)
 * 3. Full CRUD: create → verify admin+public → edit → rating/verified/draft/reorder → publish → delete
 * 4. Public endpoint returns only is_published=true, ordered by display_order
 * 5. Supabase direct-row verification
 *
 * Exits 0 on ALL PASS, 1 on ANY FAIL.
 */

import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "http://localhost:5000";
const RESULTS = [];
let COOKIE = "";
let SUPA_HEADERS = {};

function ok(label, detail = "") {
  RESULTS.push({ label, ok: true, detail });
  console.log(`  ✅  ${label}${detail ? " — " + detail : ""}`);
}
function fail(label, detail = "") {
  RESULTS.push({ label, ok: false, detail });
  console.log(`  ❌  ${label}${detail ? " — " + detail : ""}`);
}

function summary() {
  const passed = RESULTS.filter(r => r.ok).length;
  const failed = RESULTS.filter(r => !r.ok).length;
  console.log(`\n══════════════════════════════════════════`);
  console.log(`  TESTIMONIALS E2E: ${passed} passed, ${failed} failed`);
  console.log(`══════════════════════════════════════════`);
  if (failed) {
    console.log("  FAILURES:");
    RESULTS.filter(r => !r.ok).forEach(r => console.log(`    ❌  ${r.label}: ${r.detail}`));
  }
  process.exit(failed ? 1 : 0);
}

function cookieStr() { return COOKIE.split(";")[0]; }

async function login() {
  const r = await fetch(BASE + "/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "web.grow.india07@gmail.com", password: "admin123" }),
  });
  const raw = await r.text();
  let data = null;
  try { data = JSON.parse(raw); } catch { }
  const setCookies = r.headers.getSetCookie ? r.headers.getSetCookie() : (r.headers.get("set-cookie") ? [r.headers.get("set-cookie")] : []);
  const at = (setCookies.find(c => c.startsWith("admin_token=")) || "").split(";")[0];
  return { status: r.status, data, cookie: at || "" };
}

async function admin(method, urlPath, body) {
  const opts = { method, headers: { Cookie: cookieStr(), "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(BASE + urlPath, opts);
  const raw = await r.text();
  let data = null;
  try { data = JSON.parse(raw); } catch { /* non-json */ }
  return { status: r.status, data, raw };
}

async function publicGet(urlPath) {
  const r = await fetch(BASE + urlPath);
  const raw = await r.text();
  let data = null;
  try { data = JSON.parse(raw); } catch { /* non-json */ }
  return { status: r.status, data };
}

async function supaGet(table, params = "") {
  const base = process.env.SUPABASE_URL.replace(/\/+$/, "");
  const r = await fetch(`${base}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPA_HEADERS.apikey, Authorization: SUPA_HEADERS.Authorization, "Content-Type": "application/json" },
  });
  return r.json();
}

async function main() {
  console.log("\n════════════════════════════════════════════════════════════");
  console.log("  Phase 2 — Testimonials CMS Full E2E Verification");
  console.log("════════════════════════════════════════════════════════════\n");

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  SUPA_HEADERS = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

  // ── 1. Login ──────────────────────────────────────────
  console.log("1. Admin login");
  const lr = await login();
  if (lr.status === 200 && lr.data?.success) {
    if (lr.cookie) { COOKIE = lr.cookie; ok("Admin login 200", "cookie received"); }
    else fail("Admin login 200 but no Set-Cookie header", JSON.stringify(lr.data));
  } else {
    fail(`Admin login status ${lr.status}`, JSON.stringify(lr.data));
    summary();
  }

  // ── 2. Search filter bug fix verification ─────────────
  console.log("\n2. Search filter bug fix verification");
  // Search for "Tata" — should match customer_name or company only (not rating/display_order numeric cols)
  const search1 = await admin("GET", "/api/admin/testimonials?search=Tata");
  if (search1.status !== 200) fail("Admin search ?search=Tata status", search1.status);
  else {
    const rows = search1.data?.data || [];
    const hasPriyaIyer = rows.some(r => r.customer_name === "Priya Iyer");
    if (hasPriyaIyer) ok("Search 'Tata' returns Priya Iyer (company=Tata Chemicals)");
    else fail("Search 'Tata' does NOT return Priya Iyer", `results: ${rows.map(r => r.customer_name).join(", ")}`);

    // verify no 500 error (the bug was numeric column ILIKE causing PostgREST error)
    if (search1.data?.success) ok("No 500 error from numeric-column exclusion bug");
    else fail("Search request failed", JSON.stringify(search1.data));
  }

  // verify search returns no results for nonsense (no crash)
  const search2 = await admin("GET", "/api/admin/testimonials?search=ZZZ_NONEXISTENT_" + Date.now());
  if (search2.status === 200 && Array.isArray(search2.data?.data)) ok("Nonsense search returns empty array (no crash)");
  else fail("Nonsense search failed", JSON.stringify(search2.data).slice(0, 200));

  // ── 3. Full CRUD ──────────────────────────────────────
  console.log("\n3. Full CRUD: create → admin+public → edit → rating/verified/draft/reorder → publish → delete");
  const CUST_NAME = "CZ_E2E_Testimonial_" + Date.now();
  const cr = await admin("POST", "/api/admin/testimonials", {
    customer_name: CUST_NAME,
    company: "E2E Corp",
    position: "QA Lead",
    testimonial: "This is an E2E test testimonial for Arrowline.",
    rating: 3,
    is_verified: false,
    is_published: false,
    display_order: 9999,
  });
  if (cr.status !== 201 || !cr.data?.success) fail("Create testimonial", JSON.stringify(cr.data));
  else {
    const tid = cr.data.data.id;
    ok("Created testimonial 201", `id=${tid}`);

    // admin GET contains it
    const tAdmin = await admin("GET", `/api/admin/testimonials?search=${encodeURIComponent(CUST_NAME)}`);
    const foundAdmin = (tAdmin.data?.data || []).find(r => r.id === tid);
    if (foundAdmin) ok("Found in admin GET");
    else fail("Missing from admin GET");

    // public: should NOT appear (is_published=false)
    const tPub = await publicGet("/api/testimonials");
    const foundDraft = (tPub.data?.data || []).some(r => r.id === tid);
    if (!foundDraft) ok("Draft testimonial hidden from public /api/testimonials");
    else fail("Draft testimonial SHOWN in public (should be hidden)");

    // edit: update text + rating + is_verified + is_published
    const edit1 = await admin("PATCH", `/api/admin/testimonials/${tid}`, {
      testimonial: "Updated E2E testimonial text",
      rating: 5,
      is_verified: true,
      is_published: true,
    });
    if (edit1.status !== 200 || !edit1.data?.success) fail("Edit testimonial", JSON.stringify(edit1.data));
    else {
      ok("Edited testimonial (rating=5, verified=true, published=true)");
      // public now shows it
      const pub2 = await publicGet("/api/testimonials");
      const foundPub = (pub2.data?.data || []).find(r => r.id === tid);
      if (foundPub && foundPub.rating === 5 && foundPub.is_verified === true)
        ok("Published testimonial in public with correct rating=5, is_verified=true");
      else fail("Published testimonial NOT in public or wrong attrs", JSON.stringify(foundPub).slice(0, 200));
    }

    // reorder: set display_order=1 → should be first in public list
    const reorder = await admin("PATCH", `/api/admin/testimonials/${tid}`, { display_order: 1 });
    if (reorder.status !== 200) fail("Reorder testimonial", JSON.stringify(reorder));
    else {
      const pub3 = await publicGet("/api/testimonials");
      const pubRows = pub3.data?.data || [];
      const pos = pubRows.findIndex(r => r.id === tid);
      if (pos === 0) ok("Testimonial at position 0 after reorder to display_order=1");
      else fail(`Position after reorder is ${pos}, expected 0`);

      // restore to 9999
      await admin("PATCH", `/api/admin/testimonials/${tid}`, { display_order: 9999 });
    }

    // toggle published off then back on
    await admin("PATCH", `/api/admin/testimonials/${tid}`, { is_published: false });
    const pub4 = await publicGet("/api/testimonials");
    const gone1 = !(pub4.data?.data || []).some(r => r.id === tid);
    if (gone1) ok("Unpublished testimonial hidden from public");
    else fail("Unpublished testimonial STILL in public");

    await admin("PATCH", `/api/admin/testimonials/${tid}`, { is_published: true });
    const pub5 = await publicGet("/api/testimonials");
    const back1 = (pub5.data?.data || []).some(r => r.id === tid);
    if (back1) ok("Re-published testimonial back in public");
    else fail("Re-published testimonial NOT in public");

    // delete
    const del = await admin("DELETE", `/api/admin/testimonials/${tid}`);
    if (del.status !== 200 || !del.data?.success) fail("Delete testimonial", JSON.stringify(del));
    else {
      ok("Deleted testimonial");
      const pub6 = await publicGet("/api/testimonials");
      const gone2 = !(pub6.data?.data || []).some(r => r.id === tid);
      if (gone2) ok("Deleted testimonial gone from public");
      else fail("Deleted testimonial STILL in public");
    }
  }

  // ── 4. Public endpoint: all rows is_published=true, ordered by display_order
  console.log("\n4. Public endpoint validation");
  const pubAll = await publicGet("/api/testimonials");
  if (pubAll.status !== 200 || !pubAll.data?.success) fail("Public /api/testimonials status", JSON.stringify(pubAll.data));
  else {
    const rows = pubAll.data.data;
    const allPublished = rows.every(r => r.is_published === true);
    if (allPublished) ok("All public testimonials have is_published=true");
    else {
      const drafts = rows.filter(r => r.is_published !== true);
      fail(`${drafts.length} non-published testimonials in public`, drafts.map(r => r.id).join(","));
    }
    // verify order is non-decreasing display_order
    let ordered = true;
    for (let i = 1; i < rows.length; i++) {
      if ((rows[i].display_order ?? 0) < (rows[i - 1].display_order ?? 0)) { ordered = false; break; }
    }
    if (ordered) ok("Public testimonials ordered by display_order (non-decreasing)");
    else fail("Public testimonials NOT in display_order order");
  }

  // ── 5. Supabase direct verification ───────────────────
  console.log("\n5. Supabase direct-row verification");
  try {
    const tbRows = await supaGet("testimonials", "select=id&limit=100");
    if (Array.isArray(tbRows)) ok(`testimonials: ${tbRows.length} rows (DB verified)`);
    else fail("testimonials direct query failed", JSON.stringify(tbRows).slice(0, 200));

    // all public rows have is_published=true in DB
    const pubRows = await supaGet("testimonials", "select=id,is_published&is_published=eq.true&limit=100");
    const adminRows = await supaGet("testimonials", "select=id,is_published&limit=100");
    if (Array.isArray(pubRows) && Array.isArray(adminRows)) {
      const draftCount = adminRows.filter(r => r.is_published === false).length;
      ok(`DB: ${pubRows.length} published, ${draftCount} draft`);
    }
  } catch (e) {
    fail("Supabase direct verification exception", e.message);
  }

  summary();
}

main().catch(e => {
  console.error("Unhandled error:", e);
  fail("Unhandled exception", e.message);
  summary();
});
