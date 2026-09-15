import "dotenv/config";

const ADMIN = "http://localhost:5000/api/admin";
const PUBLIC = "http://localhost:5000/api";
const TOKEN = process.env.ADMIN_TOKEN;

const results = [];
function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
}
function softWarn(name, detail = "") {
  console.log(`WARN  ${name}${detail ? `  — ${detail}` : ""}`);
}

const admin = async (path, { method = "GET", body, headers = {} } = {}) => {
  const options = { method, headers: { Cookie: `admin_token=${TOKEN}`, ...headers } };
  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${ADMIN}${path}`, options);
  let json = null;
  const text = await res.text();
  try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 400) }; }
  return { status: res.status, json };
};

const pub = async (path) => {
  const res = await fetch(`${PUBLIC}${path}`);
  let json = null;
  const text = await res.text();
  try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 400) }; }
  return { status: res.status, json };
};

const httpStatus = async (url) => {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.status;
  } catch {
    return 0;
  }
};

// Minimal well-formed 1x1 PNG (standard bytes) for real image uploads.
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const makePng = async () => Buffer.from(PNG_BASE64, "base64");

async function uploadImage(colorHint, folder) {
  const png = await makePng();
  const fd = new FormData();
  fd.append("file", new Blob([png], { type: "image/png" }), `e2e-${colorHint}.png`);
  fd.append("folder", folder);
  const r = await admin("/media", { method: "POST", body: fd });
  return r.json?.data || null;
}

let failures = 0;
const fail = () => { failures += 1; };

// -----------------------------------------------------------------
// TEST 1 — Trusted Network logo upload  →  public website
// -----------------------------------------------------------------
{
  const site = "https://example.com";
  const imgA = await uploadImage("ff0000", "trusted-network");
  if (!imgA) { record("T1 Trusted logo upload: upload failed", false); fail(); }
  else {
    const fd = new FormData();
    fd.append("name", "E2E Verify Corp A");
    fd.append("category", "Port");
    fd.append("website", site);
    fd.append("display_order", "990");
    fd.append("is_published", "true");
    fd.append("logo_alt", "E2E alt A");
    fd.append("logo", new Blob([await makePng()], { type: "image/png" }), "e2e-a.png");
    const r = await admin("/trusted-network", { method: "POST", body: fd });
    const ok = r.status === 201 && r.json?.data?.logo && r.json.data.logo_public_id;
    record("T1 Trusted logo upload saved", ok, ok ? `public_id=${r.json.data.logo_public_id}` : `status=${r.status}`);
    if (ok) {
      const pubList = await pub("/trusted-network");
      const shown = (pubList.json?.data || []).some((row) => row.name === "E2E Verify Corp A");
      record("T1 logo visible on public /api/trusted-network", shown);
      const adminRefresh = await admin("/trusted-network?search=E2E Verify Corp A");
      const persist = (adminRefresh.json?.data || []).some((row) => row.name === "E2E Verify Corp A" && row.logo === r.json.data.logo);
      record("T1 logo persisted (admin refresh)", persist);

      // Replace test
      const id = r.json.data.id;
      const oldUrl = r.json.data.logo;
      const fd2 = new FormData();
      fd2.append("name", "E2E Verify Corp A");
      fd2.append("website", site);
      fd2.append("logo_alt", "E2E alt A replaced");
      fd2.append("is_published", "true");
      // Visible change: replace with an SVG mark (trusted logos accept SVG).
      const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#00FF00"/></svg>', "utf8");
      fd2.append("logo", new Blob([svg], { type: "image/svg+xml" }), "e2e-b.svg");
      const r2 = await admin(`/trusted-network/${id}`, { method: "PUT", body: fd2 });
      const replaced = r2.status === 200 && r2.json?.data?.logo && r2.json.data.logo !== oldUrl;
      record("T2 Trusted logo replacement saved", replaced, replaced ? `format=${r2.json.data.logo_format}` : `status=${r2.status}; data.logo=${r2.json?.data?.logo === oldUrl ? "UNCHANGED" : "?"}`);
      if (replaced) {
        const pubList2 = await pub("/trusted-network");
        const shown2 = (pubList2.json?.data || []).some((row) => row.name === "E2E Verify Corp A" && row.logo === r2.json.data.logo);
        record("T2 new logo visible on public API", shown2);
        const oldStatus = await httpStatus(oldUrl);
        if (oldStatus === 404) record("T2 old Cloudinary asset destroyed", true);
        else softWarn("T2 old asset still reachable", `HTTP ${oldStatus} (Cloudinary may cache)`);
      }

      // Delete test
      const del = await admin(`/trusted-network/${id}`, { method: "DELETE" });
      const deleted = del.status === 200;
      record("T1 Trusted network delete", deleted);
      const pubAfter = await pub("/trusted-network");
      const gone = !(pubAfter.json?.data || []).some((row) => row.name === "E2E Verify Corp A");
      record("T1 deleted entry gone from public API", gone);
      const newUrl = r2.status === 200 ? r2.json?.data?.logo : null;
      if (newUrl) {
        const st = await httpStatus(newUrl);
        if (st === 404) record("T1 orphaned Cloudinary asset cleaned", true);
        else softWarn("T1 old asset reachable after delete", `HTTP ${st}`);
      }
    } else {
      record("T2/T3 skipped", false, "T1 upload failed");
      fail();
    }
  }
}

// -----------------------------------------------------------------
// TEST 4 — Leadership create/edit → public /api/leadership
// -----------------------------------------------------------------
{
  const img = await uploadImage("0000ff", "leadership");
  const created = await admin("/leadership", {
    method: "POST",
    body: {
      name: "E2E Test Leader",
      role: "E2E Verification Officer",
      location: "E2E HQ",
      email: "e2e@arrowlinelogistics.in",
      bio: "Temporary record used for live verification.",
      image: img?.url || "",
      image_public_id: img?.public_id || null,
      image_alt: "E2E leader alt",
      display_order: 990,
      is_published: true,
    },
  });
  const ok = created.status === 201 && created.json?.data?.id;
  record("T4 Leadership create", ok, ok ? `id=${created.json.data.id}` : `status=${created.status}`);
  if (ok) {
    const id = created.json.data.id;
    const pubList = await pub("/leadership");
    const shownP = (pubList.json?.data || []).some((row) => row.name === "E2E Test Leader");
    record("T4 leader visible on public /api/leadership", shownP);

    const edited = await admin(`/leadership/${id}`, {
      method: "PATCH",
      body: { location: "E2E HQ Updated", email: "e2e.updated@arrowlinelogistics.in" },
    });
    const edOk = edited.status === 200 && edited.json?.data?.location === "E2E HQ Updated";
    record("T4 Leadership edit saved", edOk);
    if (edOk) {
      const pubList2 = await pub("/leadership");
      const shown2 = (pubList2.json?.data || []).some((row) => row.name === "E2E Test Leader" && row.location === "E2E HQ Updated");
      record("T4 edited leader reflects on public API", shown2);
    }
    const del = await admin(`/leadership/${id}`, { method: "DELETE" });
    const delOk = del.status === 200;
    record("T4 Leadership delete", delOk);
    if (delOk) {
      const pubList3 = await pub("/leadership");
      const gone = !(pubList3.json?.data || []).some((row) => row.name === "E2E Test Leader");
      record("T4 deleted leader gone from public API", gone);
      if (img?.public_id) {
        // generic delete destroys image_public_id; media listing should not contain it
        const media = await admin(`/media/list?folder=arrowline/leadership`);
        const orphan = (media.json?.data || []).some((f) => f.public_id === img.public_id);
        if (orphan) softWarn("T4 leadership image still listed", img.public_id);
        else record("T4 leadership image cleaned from Cloudinary", true);
      }
    }
  } else {
    fail();
  }
}

// -----------------------------------------------------------------
// TEST 5 — Core Values edit → public /api/core-values (then restore)
// -----------------------------------------------------------------
{
  const list = await pub("/core-values");
  const first = (list.json?.data || [])[0];
  if (first?.id) {
    const original = { title: first.title, description: first.description };
    const temp = `E2E TEMP ${Date.now()}`;
    const ed = await admin(`/core-values/${first.id}`, { method: "PATCH", body: { title: temp } });
    const edOk = ed.status === 200 && ed.json?.data?.title === temp;
    record("T5 Core Values edit saved", edOk);
    if (edOk) {
      const pubList = await pub("/core-values");
      const shown = (pubList.json?.data || []).some((row) => row.id === first.id && row.title === temp);
      record("T5 edited core value reflects on public API", shown);
    }
    const restore = await admin(`/core-values/${first.id}`, { method: "PATCH", body: original });
    const restoredOk = restore.status === 200 && restore.json?.data?.title === original.title;
    record("T5 original core value restored", restoredOk);
    if (restoredOk) {
      const pubList2 = await pub("/core-values");
      const shown2 = (pubList2.json?.data || []).some((row) => row.id === first.id && row.title === original.title);
      record("T5 restored value back on public API", shown2);
    }
  } else {
    record("T5 Core Values edit", false, "no published core values found"); fail();
  }
}

// -----------------------------------------------------------------
// TEST 6 — Industry edit → public /api/industries (then restore)
// -----------------------------------------------------------------
{
  const list = await pub("/industries");
  const first = (list.json?.data || [])[0];
  if (first?.id) {
    const original = { title: first.title };
    const temp = `${first.title} E2E`;
    const ed = await admin(`/industries/${first.id}`, { method: "PATCH", body: { title: temp } });
    const edOk = ed.status === 200 && ed.json?.data?.title === temp;
    record("T6 Industry edit saved", edOk);
    if (edOk) {
      const pubList = await pub("/industries");
      const shown = (pubList.json?.data || []).some((row) => row.id === first.id && row.title === temp);
      record("T6 edited industry reflects on public API", shown);
    }
    const restore = await admin(`/industries/${first.id}`, { method: "PATCH", body: original });
    const restoredOk = restore.status === 200 && restore.json?.data?.title === original.title;
    record("T6 original industry restored", restoredOk);
    if (restoredOk) {
      const pubList2 = await pub("/industries");
      const shown2 = (pubList2.json?.data || []).some((row) => row.id === first.id && row.title === original.title);
      record("T6 restored industry back on public API", shown2);
    }
  } else {
    record("T6 Industry edit", false, "no published industries found"); fail();
  }
}

// -----------------------------------------------------------------
// TEST 7 — Service edit → public page (then restore)
// TEST 8 — Sub-service edit → public page (then restore)
// -----------------------------------------------------------------
{
  const services = await pub("/services");
  const main = (services.json?.data || [])[0];
  if (main?.id && main?.slug) {
    const originalHeadline = main.hero_headline || null;
    const temp = `E2E VERIFY ${Date.now()}`;
    const ed = await admin(`/services/${main.id}`, { method: "PATCH", body: { hero_headline: temp } });
    const edOk = ed.status === 200 && ed.json?.data?.hero_headline === temp;
    record("T7 Service edit saved", edOk);
    if (edOk) {
      const detail = await pub(`/services/${main.slug}`);
      const shown = detail.json?.data?.hero_headline === temp;
      record("T7 edited service reflects on public page", shown);
    }
    const restoreBody = originalHeadline ? { hero_headline: originalHeadline } : { hero_headline: null };
    const restore = await admin(`/services/${main.id}`, { method: "PATCH", body: restoreBody });
    const restoredOk = restore.status === 200;
    record("T7 original service restored", restoredOk);
    if (restoredOk) {
      const detail2 = await pub(`/services/${main.slug}`);
      const back = detail2.json?.data?.hero_headline === originalHeadline;
      record("T7 restored headline back on public page", back);
    }

    // Sub-service (list endpoint does not embed subs — fetch the detail)
    const mainDetail = await pub(`/services/${main.slug}`);
    const subs = (mainDetail.json?.data?.subServices) || [];
    const sub = subs[0];
    if (sub?.id && sub?.slug) {
      const origSub = sub.hero_headline || null;
      const temp2 = `E2E SUB ${Date.now()}`;
      const ed2 = await admin(`/service-items/${sub.id}`, { method: "PATCH", body: { hero_headline: temp2 } });
      const ed2Ok = ed2.status === 200 && ed2.json?.data?.hero_headline === temp2;
      record("T8 Sub-service edit saved", ed2Ok);
      if (ed2Ok) {
        const detail2 = await pub(`/services/${main.slug}/${sub.slug}`);
        const shown2 = detail2.json?.data?.hero_headline === temp2;
        record("T8 edited sub-service reflects on public page", shown2);
      }
      const restore2Body = origSub ? { hero_headline: origSub } : { hero_headline: null };
      const restore2 = await admin(`/service-items/${sub.id}`, { method: "PATCH", body: restore2Body });
      const restored2Ok = restore2.status === 200;
      record("T8 original sub-service restored", restored2Ok);
      if (restored2Ok) {
        const detail3 = await pub(`/services/${main.slug}/${sub.slug}`);
        const back2 = detail3.json?.data?.hero_headline === origSub;
        record("T8 restored sub-service headline back on public page", back2);
      }
    } else {
      record("T8 Sub-service edit", false, "no published sub-service found on main service"); fail();
    }
  } else {
    record("T7/T8 Service & Sub-service edit", false, "no published services found"); fail();
  }
}

// -----------------------------------------------------------------
// TEST 9 — Showcase image replacement → public page
// TEST with cargo — TEST 10 cargo image replacement → public page
// -----------------------------------------------------------------
{
  const services = await pub("/services");
  const main = (services.json?.data || [])[0];
  if (main?.id && main?.slug) {
    const imgA = await uploadImage("ff8800", "services");
    const imgB = await uploadImage("00ff88", "services");
    if (!imgA || !imgB) {
      record("T9/T10 image uploads for showcase/cargo", false, "media upload failed"); fail();
    } else {
      // Showcase
      const created = await admin("/showcase", {
        method: "POST",
        body: {
          service_id: main.id,
          title: "E2E Showcase Row",
          caption: "E2E caption",
          alt_text: "E2E alt",
          image_url: imgA.url,
          image_public_id: imgA.public_id,
          display_order: 990,
          is_published: true,
        },
      });
      const cOk = created.status === 201 && created.json?.data?.id;
      record("T9 Showcase create", cOk);
      if (cOk) {
        const id = created.json.data.id;
        const detail = await pub(`/services/${main.slug}`);
        const gallery = Array.isArray(detail.json?.data?.showcaseItems) ? detail.json.data.showcaseItems : [];
        const shownP = gallery.some((r) => r.image_url === imgA.url);
        record("T9 showcase row visible on public page", shownP);

        const replaced = await admin(`/showcase/${id}`, {
          method: "PATCH",
          body: {
            image_url: imgB.url,
            image_public_id: imgB.public_id,
            caption: "E2E caption replaced",
          },
        });
        const rOk = replaced.status === 200 && replaced.json?.data?.image_url === imgB.url;
        record("T9 Showcase image replacement saved", rOk);
        if (rOk) {
          const detail2 = await pub(`/services/${main.slug}`);
          const gallery2 = Array.isArray(detail2.json?.data?.showcaseItems) ? detail2.json.data.showcaseItems : [];
          const shown2 = gallery2.some((r) => r.image_url === imgB.url) && !gallery2.some((r) => r.image_url === imgA.url);
          record("T9 replaced showcase image reflects on public page", shown2);
          const oldStatus = await httpStatus(imgA.url);
          if (oldStatus === 404) record("T9 old showcase Cloudinary asset destroyed", true);
          else softWarn("T9 old showcase asset reachable", `HTTP ${oldStatus}`);
        }
        const del = await admin(`/showcase/${id}`, { method: "DELETE" });
        const delOk = del.status === 200;
        record("T9 Showcase delete", delOk);
        if (delOk) {
          const detail3 = await pub(`/services/${main.slug}`);
          const gallery3 = Array.isArray(detail3.json?.data?.showcaseItems) ? detail3.json.data.showcaseItems : [];
          const gone = !gallery3.some((r) => r.title === "E2E Showcase Row");
          record("T9 deleted showcase gone from public page", gone);
          const st = await httpStatus(imgB.url);
          if (st === 404) record("T9 orphaned showcase asset cleaned", true);
          else softWarn("T9 showcase asset reachable after delete", `HTTP ${st}`);
        }
      } else {
        record("T9 showcase replacement/delete skipped", false, "create failed"); fail();
      }

      // Cargo
      const createdC = await admin("/cargo-applications", {
        method: "POST",
        body: {
          service_id: main.id,
          title: "E2E Cargo Row",
          description: "E2E cargo description",
          image_url: imgA.url,
          image_public_id: imgA.public_id,
          display_order: 990,
          is_published: true,
        },
      });
      const c2Ok = createdC.status === 201 && createdC.json?.data?.id;
      record("T10 Cargo create", c2Ok);
      if (c2Ok) {
        const id = createdC.json.data.id;
        const detail = await pub(`/services/${main.slug}`);
        const apps = Array.isArray(detail.json?.data?.cargoApplications) ? detail.json.data.cargoApplications : [];
        const shownP = apps.some((r) => r.image_url === imgA.url);
        record("T10 cargo row visible on public page", shownP);

        const replacedC = await admin(`/cargo-applications/${id}`, {
          method: "PATCH",
          body: { image_url: imgB.url, image_public_id: imgB.public_id },
        });
        const rOk = replacedC.status === 200 && replacedC.json?.data?.image_url === imgB.url;
        record("T10 Cargo image replacement saved", rOk);
        if (rOk) {
          const detail2 = await pub(`/services/${main.slug}`);
          const apps2 = Array.isArray(detail2.json?.data?.cargoApplications) ? detail2.json.data.cargoApplications : [];
          const shown2 = apps2.some((r) => r.image_url === imgB.url) && !apps2.some((r) => r.image_url === imgA.url);
          record("T10 replaced cargo image reflects on public page", shown2);
        }
        const delC = await admin(`/cargo-applications/${id}`, { method: "DELETE" });
        const delOk = delC.status === 200;
        record("T10 Cargo delete", delOk);
        if (delOk) {
          const detail3 = await pub(`/services/${main.slug}`);
          const apps3 = Array.isArray(detail3.json?.data?.cargoApplications) ? detail3.json.data.cargoApplications : [];
          const gone = !apps3.some((r) => r.title === "E2E Cargo Row");
          record("T10 deleted cargo gone from public page", gone);
        }
      } else {
        record("T10 cargo replacement/delete skipped", false, "create failed"); fail();
      }
    }
  } else {
    record("T9/T10 Showcase & Cargo", false, "no published services found"); fail();
  }
}

// -----------------------------------------------------------------
// TEST 10b — About image replacement (site_content) → public /api/content
// -----------------------------------------------------------------
{
  const content = await pub("/content");
  const about = (content.json?.data || []).find((c) => c.content_key === "about_image");
  if (about?.content_value) {
    const original = about.content_value;
    const img = await uploadImage("aa00ff", "site-content");
    if (img) {
      const upd = await admin("/content/about_image", {
        method: "PUT",
        body: { content_value: img.url, section: "About", content_type: "image", is_published: true },
      });
      const updOk = upd.status === 200 && upd.json?.data?.content_value === img.url;
      record("T10 About image replacement saved", updOk);
      if (updOk) {
        const after = await pub("/content");
        const shown2 = (after.json?.data || []).some((c) => c.content_key === "about_image" && c.content_value === img.url);
        record("T10 about image reflects on public /api/content", shown2);
      }
      const restore = await admin("/content/about_image", {
        method: "PUT",
        body: { content_value: original, section: "About", content_type: "image", is_published: true },
      });
      record("T10 about image restored", restore.status === 200);
    } else {
      record("T10 About image replacement", false, "media upload failed"); fail();
    }
  } else {
    record("T10 About image replacement", false, "no about_image in /api/content"); fail();
  }
}

// -----------------------------------------------------------------
// Auth & route sanity
// -----------------------------------------------------------------
{
  const noAuth = await fetch(`${ADMIN}/services`);
  record("AUTH unauthenticated admin call rejected", noAuth.status === 401, `status=${noAuth.status}`);
  const me = await admin("/me");
  record("AUTH /me with token", me.status === 200);
  for (const [name, path] of [
    ["services", "/services"],
    ["service-items", "/service-items"],
    ["industries", "/industries"],
    ["leadership", "/leadership"],
    ["core-values", "/core-values"],
    ["trusted-network", "/trusted-network"],
    ["media-list", "/media/list"],
    ["content", "/content"],
    ["enquiries", "/enquiries?limit=1"],
    ["site-settings", "/site-settings"],
  ]) {
    const r = await admin(path);
    const ok = r.status === 200 && Array.isArray(r.json?.data);
    record(`ADMIN GET ${name}`, ok, `status=${r.status}`);
  }
}

console.log("\n================================");
const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass).length;
console.log(`TOTAL ${results.length}  PASS ${passed}  FAIL ${failed}`);
if (failures) console.log(`(additional internal failures: ${failures})`);
console.log("================================\n");

if (failed > 0 || failures > 0) process.exit(1);