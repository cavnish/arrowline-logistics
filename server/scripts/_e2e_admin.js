const API = "http://localhost:5000/api/admin";
const EMAIL = "web.grow.india07@gmail.com";
const PASSWORD = process.env.ADMIN_TEST_PASSWORD;

let cookie = "";

async function req(method, path, { body, extraHeaders = {} } = {}) {
  const headers = { ...extraHeaders };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (cookie) headers["Cookie"] = cookie;
  const res = await fetch(API + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json, setCookie };
}

function log(name, res, extra = "") {
  console.log(`\n### ${name} -> ${res.status}` + extra);
  if (res.json) console.log("    body:", JSON.stringify(res.json).slice(0, 400));
  if (res.setCookie && res.setCookie.includes("admin_token")) {
    console.log("    set-cookie: " + res.setCookie.split(";")[0] + "; expires=" + (/Expires=([^;]+)/.exec(res.setCookie)?.[1] || "/"));
  }
}

function extractCookie(setCookie) {
  if (!setCookie) return null;
  const m = /admin_token=([^;]+)/.exec(setCookie);
  return m ? `admin_token=${m[1]}` : null;
}

async function main() {
  // 1. Login
  let r = await req("POST", "/login", { body: { email: EMAIL, password: PASSWORD } });
  log("LOGIN", r, r.status === 200 ? "  <<< SUCCESS" : "  <<< FAIL");
  cookie = extractCookie(r.setCookie) || "";

  // 2. Unauthenticated admin route (before login we cannot test; use separation)
  const rNo = await req("GET", "/me", { extraHeaders: { Cookie: "" } });
  log("AUTH CHECK (no cookie)", rNo);

  // 3. Authenticated
  r = await req("GET", "/me");
  log("ME (with cookie)", r);
  r = await req("GET", "/stats");
  log("STATS (with cookie)", r);
  r = await req("GET", "/enquiries?limit=5");
  log("ENQUIRIES LIST (with cookie)", r);
  r = await req("GET", "/services");
  log("SERVICES LIST (with cookie)", r);
  r = await req("GET", "/service-items");
  log("SERVICE-ITEMS LIST (with cookie)", r);
  r = await req("GET", "/media/list");
  log("MEDIA LIST (with cookie)", r);

  // 4. CRUD: Services
  const createSrv = await req("POST", "/services", { body: { title: "_e2e_test_service", slug: "_e2e-test-service", short_description: "temp", is_published: false, display_order: 999 } });
  log("SERVICES CREATE", createSrv);
  const srvId = createSrv.json?.data?.id;
  if (srvId) {
    const upd = await req("PATCH", `/services/${srvId}`, { body: { title: "_e2e_test_service_updated" } });
    log("SERVICES UPDATE", upd);
    const del = await req("DELETE", `/services/${srvId}`);
    log("SERVICES DELETE", del);
  }

  // 5. CRUD: Service items (attach to road-transportation)
  const { data: rm } = await (async () => {
    const res = await fetch(API + "/services", { headers: { Cookie: cookie } });
    const j = await res.json();
    return { data: (j.data || []).find((s) => s.slug === "road-transportation") };
  })();
  if (rm) {
    const cr = await req("POST", "/service-items", { body: { service_id: rm.id, parent_slug: "road-transportation", title: "_e2e_test_item", slug: "_e2e-test-item", short_description: "temp", is_published: false, display_order: 999 } });
    log("SERVICE-ITEMS CREATE", cr);
    const itemId = cr.json?.data?.id;
    if (itemId) {
      const up = await req("PATCH", `/service-items/${itemId}`, { body: { title: "_e2e_test_item_updated" } });
      log("SERVICE-ITEMS UPDATE", up);
      const dl = await req("DELETE", `/service-items/${itemId}`);
      log("SERVICE-ITEMS DELETE", dl);
    }
  }

  // 6. CRUD: leads (create via public API, manage via admin)
  const leadRes = await fetch("http://localhost:5000/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "_e2e test", company: "ACME", email: "e2e@example.com", phone: "+919999999999", service: "Road Transportation", message: "temp e2e lead" }),
  });
  const lead = await leadRes.json();
  const leadId = lead.data?.id || (Array.isArray(lead) ? null : lead.id);
  console.log("\n### PUBLIC LEAD CREATE ->", leadRes.status, JSON.stringify(lead).slice(0, 200));
  const list = await req("GET", "/enquiries?limit=5&search=_e2e");
  log("ENQUIRIES SEARCH _e2e", list);
  const foundLead = (list.json?.data || []).find((l) => (l.name || "").startsWith("_e2e") || (l.company || "") === "ACME");
  if (foundLead) {
    const lr = await req("GET", `/enquiries/${foundLead.id}`);
    log("ENQUIRY GET", lr);
    const pu = await req("PATCH", `/enquiries/${foundLead.id}`, { body: { status: "follow_up", notes: "test note" } });
    log("ENQUIRY PATCH", pu);
    const n = await req("POST", `/enquiries/${foundLead.id}/notes`, { body: { note: "_e2e note" } });
    log("ENQUIRY NOTE ADD", n);
    const noteId = n.json?.data?.id;
    if (noteId) {
      const nd = await req("DELETE", `/enquiries/${foundLead.id}/notes/${noteId}`);
      log("ENQUIRY NOTE DELETE", nd);
    }
    const dl = await req("DELETE", `/enquiries/${foundLead.id}`);
    log("ENQUIRY DELETE", dl);
  }

  // 7. Logout
  r = await req("POST", "/logout");
  log("LOGOUT", r);
  const cleared = r.setCookie && (r.setCookie.includes("Expires=Thu, 01 Jan 1970") || r.setCookie.includes("Max-Age=0"));
  console.log("    cookie cleared:", cleared ? "YES" : "check: " + (r.setCookie || "none"));

  // 8. After logout authed check
  r = await req("GET", "/me");
  log("ME AFTER LOGOUT (expect 401)", r);
}

main().catch((e) => { console.error("E2E FAIL:", e); process.exit(1); });