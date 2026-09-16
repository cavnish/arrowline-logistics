#!/usr/bin/env node
/**
 * Phase 1 — About CMS full E2E verification
 *
 * Run from repo root:  node server/scripts/_final_about_e2e.mjs
 *
 * Tests:
 * 1. Admin login → cookie
 * 2. Site content edit → verify public propagation → revert
 * 3. Pillar edit → verify public propagation → revert
 * 4. Milestone create → verify admin+public → unpublish → republish → reorder → delete
 * 5. About image (hero) upload → associate → verify public → replace → verify → restore original
 * 6. Leadership temp image replace/delete (generic IMAGE_PUBLIC_ID_RESOURCES path)
 * 7. Supabase direct-row verification + correct-project-ref check
 *
 * Exits 0 on ALL PASS, 1 on ANY FAIL. Does NOT claim "production ready".
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "http://localhost:5000";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const TEST_IMAGE = path.join(PROJECT_ROOT, "public/images/truck-fleet-yard.jpg");
const RESULTS = [];
let COOKIE = "";
let SUPA_HEADERS = {};

// ── helpers ──────────────────────────────────────────────

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
  console.log(`  ABOUT E2E: ${passed} passed, ${failed} failed`);
  console.log(`══════════════════════════════════════════`);
  if (failed) {
    console.log("  FAILURES:");
    RESULTS.filter(r => !r.ok).forEach(r => console.log(`    ❌  ${r.label}: ${r.detail}`));
  }
  process.exit(failed ? 1 : 0);
}

function cookieStr() {
  return COOKIE.split(";")[0];
}

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

async function uploadMedia(filePath, folder = "about") {
  const fd = new FormData();
  const buf = fs.readFileSync(filePath);
  fd.append("file", new Blob([buf], { type: "image/jpeg" }), "cz-e2e.jpg");
  fd.append("folder", folder);
  const r = await fetch(BASE + "/api/admin/media", {
    method: "POST",
    headers: { Cookie: cookieStr() },
    body: fd,
  });
  return { status: r.status, data: (await r.json()) };
}

async function replaceMedia(publicId, filePath) {
  const fd = new FormData();
  const buf = fs.readFileSync(filePath);
  fd.append("file", new Blob([buf], { type: "image/jpeg" }), "cz-e2e.jpg");
  const r = await fetch(BASE + `/api/admin/media/${encodeURIComponent(publicId)}/replace`, {
    method: "PUT",
    headers: { Cookie: cookieStr() },
    body: fd,
  });
  return { status: r.status, data: (await r.json()) };
}

async function downloadBuffer(url) {
  const r = await fetch(url);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

function tmpFile(buf, name = "cz-e2e-restore.jpg") {
  const p = path.join(__dirname, name);
  fs.writeFileSync(p, buf);
  return p;
}

async function mediaListFolder(folder) {
  const r = await fetch(`${BASE}/api/admin/media/list?folder=${encodeURIComponent(folder)}`, {
    headers: { Cookie: cookieStr() },
  });
  return (await r.json());
}

async function supaGet(table, params = "") {
  const base = process.env.SUPABASE_URL.replace(/\/+$/, "");
  const r = await fetch(`${base}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPA_HEADERS.apikey, Authorization: SUPA_HEADERS.Authorization, "Content-Type": "application/json" },
  });
  return r.json();
}

// ── main ─────────────────────────────────────────────────

async function main() {
  console.log("\n════════════════════════════════════════════════════════════");
  console.log("  Phase 1 — About CMS Full E2E Verification");
  console.log("════════════════════════════════════════════════════════════\n");

  // ── 0. Supa header setup ───────────────────────────────
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  SUPA_HEADERS = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

  // ── 1. Login ──────────────────────────────────────────
  console.log("1. Admin login");
  const lr = await login();
  if (lr.status === 200 && lr.data?.success) {
    if (lr.cookie) { COOKIE = lr.cookie; ok("Admin login 200", "cookie received"); }
    else fail("Admin login 200 but no Set-Cookie header", lr.raw + " headers=" + JSON.stringify(lr.headers));
  } else {
    fail(`Admin login status ${lr.status}`, JSON.stringify(lr.data));
    summary();
  }

  // ── 2. Site content text edit (about_hero_p1) ─────────
  console.log("\n2. Site content edit + revert (about_hero_p1)");
  const c1 = await admin("GET", "/api/admin/content");
  const heroRow = c1.data?.data?.find(r => r.content_key === "about_hero_p1");
  if (!heroRow) { fail("about_hero_p1 row not found in /api/admin/content"); }
  else {
    const origVal = heroRow.content_value;
    const marker = "E2E_VERIFY_" + Date.now();
    const patched = origVal + " " + marker;

    const put1 = await admin("PUT", `/api/admin/content/about_hero_p1`, { content_value: patched });
    if (put1.status !== 200 || !put1.data?.success) fail("PUT about_hero_p1", JSON.stringify(put1.data));
    else {
      const pub1 = await publicGet("/api/about");
      const pubText = pub1.data?.data?.siteContent?.about_hero_p1 || "";
      if (pubText.includes(marker)) ok("PUT text visible in public /api/about");
      else fail("PUT text NOT in public /api/about", `got: ${pubText.slice(0, 200)}`);

      // revert
      const revert = await admin("PUT", `/api/admin/content/about_hero_p1`, { content_value: origVal });
      if (revert.status === 200 && revert.data?.success) ok("Reverted about_hero_p1");
      else fail("Revert about_hero_p1", JSON.stringify(revert.data));
    }
  }

  // ── 3. Pillar text edit + revert ──────────────────────
  console.log("\n3. Pillar text edit + revert");
  const pillarsAdmin = await admin("GET", "/api/admin/about-pillars");
  const pillars = pillarsAdmin.data?.data || [];
  if (!pillars.length) fail("No about-pillars found");
  else {
    const p = pillars[0];
    const origText = p.text;
    const marker = "PILLAR_E2E_" + Date.now();
    const patched = origText + " " + marker;

    const patch1 = await admin("PATCH", `/api/admin/about-pillars/${p.id}`, { text: patched });
    if (patch1.status !== 200 || !patch1.data?.success) fail("PATCH about-pillars", JSON.stringify(patch1.data));
    else {
      const pub1 = await publicGet("/api/about");
      const pubPillar = pub1.data?.data?.pillars?.find(x => x.id === p.id);
      if (pubPillar?.text?.includes(marker)) ok("Pillar text change visible in public /api/about");
      else fail("Pillar text NOT in public", `got: ${pubPillar?.text?.slice(0, 150)}`);

      const revert = await admin("PATCH", `/api/admin/about-pillars/${p.id}`, { text: origText });
      if (revert.status === 200 && revert.data?.success) ok("Reverted pillar text");
      else fail("Revert pillar text", JSON.stringify(revert.data));
    }
  }

  // ── 4. Milestone full CRUD + publish/unpublish + reorder
  console.log("\n4. Milestone full CRUD + publish/unpublish + reorder");
  const MS_TITLE = "CZ_E2E_MS_" + Date.now();
  const msCreate = await admin("POST", "/api/admin/about-milestones", {
    year: "2099", title: MS_TITLE, text: "E2E temporary milestone", display_order: 500, is_published: true,
  });
  if (msCreate.status !== 201 || !msCreate.data?.success) fail("Create milestone", JSON.stringify(msCreate.data));
  else {
    const msId = msCreate.data.data.id;
    ok("Created milestone 201", `id=${msId}`);

    // verify admin GET
    const msAdmin = await admin("GET", `/api/admin/about-milestones`);
    const foundAdmin = (msAdmin.data?.data || []).find(r => r.id === msId);
    if (foundAdmin) ok("Milestone in admin GET");
    else fail("Milestone missing from admin GET");

    // verify public
    const msPub = await publicGet("/api/about");
    const foundPub = msPub.data?.data?.milestones?.find(r => r.id === msId);
    if (foundPub) ok("Milestone in public /api/about");
    else fail("Milestone missing from public /api/about");

    // unpublish
    const unp = await admin("PATCH", `/api/admin/about-milestones/${msId}`, { is_published: false });
    if (unp.status !== 200) fail("Unpublish milestone", JSON.stringify(unp));
    else {
      const pub2 = await publicGet("/api/about");
      const gone = !(pub2.data?.data?.milestones || []).find(r => r.id === msId);
      if (gone) ok("Milestone hidden in public when draft");
      else fail("Milestone STILL in public when draft");
    }

    // republish
    const rep = await admin("PATCH", `/api/admin/about-milestones/${msId}`, { is_published: true });
    if (rep.status !== 200) fail("Republish milestone", JSON.stringify(rep));
    else {
      const pub3 = await publicGet("/api/about");
      const back = (pub3.data?.data?.milestones || []).find(r => r.id === msId);
      if (back) ok("Milestone re-shown in public when published");
      else fail("Milestone NOT re-shown after republish");
    }

    // reorder: move from 500 → position index 1 (display_order=2)
    const patchOrd = await admin("PATCH", `/api/admin/about-milestones/${msId}`, { display_order: 2 });
    if (patchOrd.status !== 200) fail("Reorder milestone", JSON.stringify(patchOrd));
    else {
      const pub4 = await publicGet("/api/about");
      const ms4 = pub4.data?.data?.milestones || [];
      const pos = ms4.findIndex(r => r.id === msId);
      if (pos === 1) ok("Milestone at position index 1 after reorder to display_order=2");
      else fail(`Milestone position after reorder is ${pos}, expected 1`);

      // restore to 500
      await admin("PATCH", `/api/admin/about-milestones/${msId}`, { display_order: 500 });
    }

    // delete
    const del = await admin("DELETE", `/api/admin/about-milestones/${msId}`);
    if (del.status !== 200 || !del.data?.success) fail("Delete milestone", JSON.stringify(del));
    else {
      const pub5 = await publicGet("/api/about");
      const gone2 = !(pub5.data?.data?.milestones || []).find(r => r.id === msId);
      if (gone2) ok("Milestone gone from public after delete");
      else fail("Milestone STILL in public after delete");
    }
  }

  // ── 5. About image upload → hero replace → restore ─────
  console.log("\n5. About image upload + hero replace + restore");
  const imgAdmin = await admin("GET", "/api/admin/about-images");
  const heroRow2 = (imgAdmin.data?.data || []).find(r => r.slot === "hero");
  if (!heroRow2) fail("No about-images hero row found");
  else {
    const baselineUrl = heroRow2.image_url;
    const baselinePid = heroRow2.image_public_id;
    const baselineTitle = heroRow2.title;
    const baselineAlt = heroRow2.alt_text;
    const baselineOrder = heroRow2.display_order;
    const baselinePublished = heroRow2.is_published;

    // download original asset bytes for safe restore
    let originalBuf;
    try {
      originalBuf = await downloadBuffer(baselineUrl);
    } catch (e) { fail("Download original hero asset", e.message); originalBuf = null; }

    if (originalBuf) {
      // upload temp A
      const upA = await uploadMedia(TEST_IMAGE, "about");
      if (!upA.data?.success) fail("Upload temp image A", JSON.stringify(upA.data));
      else {
        const pidA = upA.data.data.public_id;
        const urlA = upA.data.data.url;
        ok("Uploaded temp image A", `pid=${pidA}`);

        // PATCH hero → A (this destroys original via destroyCloudinaryAsset)
        const patchH = await admin("PATCH", `/api/admin/about-images/${heroRow2.id}`, {
          title: baselineTitle, alt_text: baselineAlt,
          image_url: urlA, image_public_id: pidA,
          is_published: baselinePublished, display_order: baselineOrder,
        });
        if (patchH.status !== 200 || !patchH.data?.success) fail("PATCH hero to temp image A", JSON.stringify(patchH.data));
        else {
          ok("PATCHed hero to temp image A");
          // verify old asset no longer listed in Cloudinary
          const list1 = await mediaListFolder("arrowline/about");
          const oldStillListed = (list1.data || []).some(f => f.public_id === baselinePid);
          if (!oldStillListed) ok("Original hero asset removed from Cloudinary");
          else fail("Original hero asset STILL listed after PATCH (expected destroyed)");

          // verify public image
          const pubA = await publicGet("/api/about");
          const heroPub = (pubA.data?.data?.images || []).find(r => r.slot === "hero");
          if (heroPub?.image_url === urlA) ok("Public hero image shows temp image A");
          else fail("Public hero image mismatch", `expected ${urlA}, got ${heroPub?.image_url}`);

          // ── Restore original via media replace + PATCH back ──
          // 1) PUT replace to recreate original asset at same public_id
          const restorePath = tmpFile(originalBuf, "cz-restore-hero.jpg");
          const replaceResult = await replaceMedia(baselinePid, restorePath);
          fs.unlinkSync(restorePath);
          if (!replaceResult.data?.success) fail("Restore original asset via media replace", JSON.stringify(replaceResult.data));
          else {
            const restoredUrl = replaceResult.data.data.url;
            ok("Re-created original asset via media replace", `pid=${replaceResult.data.data.public_id}`);

            // 2) PATCH hero back to original
            const patchBack = await admin("PATCH", `/api/admin/about-images/${heroRow2.id}`, {
              title: baselineTitle, alt_text: baselineAlt,
              image_url: restoredUrl, image_public_id: baselinePid,
              is_published: baselinePublished, display_order: baselineOrder,
            });
            if (patchBack.status !== 200 || !patchBack.data?.success) fail("PATCH hero back to original", JSON.stringify(patchBack.data));
            else {
              ok("Hero restored to original asset");
              // verify public
              const pubBack = await publicGet("/api/about");
              const heroBack = (pubBack.data?.data?.images || []).find(r => r.slot === "hero");
              if (heroBack?.image_url?.includes(baselinePid)) ok("Public hero image verified after restore");
              else fail("Public hero mismatch after restore", `got: ${heroBack?.image_url}`);
              // confirm temp A no longer in Cloudinary (was destroyed on second PATCH)
              const list2 = await mediaListFolder("arrowline/about");
              const tempAListed = (list2.data || []).some(f => f.public_id === pidA);
              if (!tempAListed) ok("Temp image A removed from Cloudinary (auto-destroyed on PATCH back)");
              else fail("Temp image A STILL in Cloudinary", pidA);
            }
          }
        }
      }
    }
  }

  // ── 6. Leadership temp image replace/delete ────────────
  console.log("\n6. Leadership temp image replace/delete (generic IMAGE_PUBLIC_ID_RESOURCES path)");
  const leadCreate = await admin("POST", "/api/admin/leadership", {
    name: "CZ E2E Leader", role: "E2E Test Role", is_published: false, display_order: 9999,
  });
  if (leadCreate.status !== 201 || !leadCreate.data?.success) fail("Create temp leadership", JSON.stringify(leadCreate.data));
  else {
    const lid = leadCreate.data.data.id;
    ok("Created temp leadership record", `id=${lid}`);

    // upload L1
    const upL1 = await uploadMedia(TEST_IMAGE, "leadership");
    if (!upL1.data?.success) fail("Upload image L1", JSON.stringify(upL1.data));
    else {
      const pidL1 = upL1.data.data.public_id;
      const urlL1 = upL1.data.data.url;
      ok("Uploaded image L1", `pid=${pidL1}`);

      // PATCH to associate L1
      const patchL = await admin("PATCH", `/api/admin/leadership/${lid}`, {
        image: urlL1, image_public_id: pidL1, image_alt: "cz e2e",
      });
      if (patchL.status !== 200 || !patchL.data?.success) fail("PATCH leadership to L1", JSON.stringify(patchL));
      else {
        ok("Associated L1 to temp leadership");

        // upload L2
        const upL2 = await uploadMedia(TEST_IMAGE, "leadership");
        if (!upL2.data?.success) fail("Upload image L2", JSON.stringify(upL2.data));
        else {
          const pidL2 = upL2.data.data.public_id;
          const urlL2 = upL2.data.data.url;
          ok("Uploaded image L2", `pid=${pidL2}`);

          // PATCH replace L1→L2
          const patchL2 = await admin("PATCH", `/api/admin/leadership/${lid}`, {
            image: urlL2, image_public_id: pidL2, image_alt: "cz e2e v2",
          });
          if (patchL2.status !== 200 || !patchL2.data?.success) fail("PATCH leadership L1→L2", JSON.stringify(patchL2));
          else {
            ok("Replaced L1 with L2");
            // L1 should be gone from Cloudinary
            const leadList = await mediaListFolder("arrowline/leadership");
            const l1Gone = !(leadList.data || []).some(f => f.public_id === pidL1);
            if (l1Gone) ok("L1 removed from Cloudinary after PATCH replace");
            else fail("L1 STILL in Cloudinary after PATCH replace", pidL1);
          }

          // DELETE temp leadership (destroys L2)
          const delL = await admin("DELETE", `/api/admin/leadership/${lid}`);
          if (delL.status !== 200 || !delL.data?.success) fail("DELETE temp leadership", JSON.stringify(delL));
          else {
            ok("Deleted temp leadership record");
            const leadList2 = await mediaListFolder("arrowline/leadership");
            const l2Gone = !(leadList2.data || []).some(f => f.public_id === pidL2);
            if (l2Gone) ok("L2 removed from Cloudinary after DELETE");
            else fail("L2 STILL in Cloudinary after DELETE", pidL2);
          }
        }
      }
    }
  }

  // ── 7. Supabase direct-row verification + project ref ──
  console.log("\n7. Supabase direct-row verification");
  try {
    const urlBase = process.env.SUPABASE_URL.replace(/\/+$/, "");
    // project ref check
    const projRef = urlBase.match(/\/\/([a-z]+)\.supabase/)?.[1] || "";
    if (projRef === "vsbircholpdlhyznlrgi") ok("Supabase project ref is vsbircholpdlhyznlrgi (CORRECT)");
    else fail("Unexpected Supabase project ref", projRef);

    // row counts for About tables
    const tables = ["about_images", "about_pillars", "about_milestones", "about_differentiators"];
    for (const t of tables) {
      const rows = await supaGet(t, "select=id&limit=100");
      if (Array.isArray(rows)) ok(`${t}: ${rows.length} rows (DB verified)`);
      else fail(`${t} direct query failed`, JSON.stringify(rows).slice(0, 200));
    }

    // verify hero image row in DB
    const heroDb = await supaGet("about_images", "select=image_public_id,title&slot=eq.hero&limit=1");
    if (Array.isArray(heroDb) && heroDb.length === 1) {
      ok(`DB hero image_public_id=${heroDb[0].image_public_id}, title=${heroDb[0].title}`);
    } else fail("DB hero row not found", JSON.stringify(heroDb).slice(0, 200));

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
