const API = "http://localhost:5000";
let cookie = "";

async function req(method, path, { body, withCookie = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (withCookie && cookie) headers["Cookie"] = cookie;
  const res = await fetch(API + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  let json = null;
  try { json = await res.json(); } catch {}
  const sc = res.headers.get("set-cookie");
  if (sc && /admin_token=[^;]+/.test(sc)) cookie = /admin_token=[^;]+/.exec(sc)[0].split(";")[0];
  return { status: res.status, json, sc };
}

const health = await req("GET", "/health");
console.log("1) GET /health                   ->", health.status);

// Test A: wrong email (not allowlisted)
const wa = await req("POST", "/api/admin/login", { body: { email: "notadmin@example.com", password: "whatever123" }, withCookie: false });
console.log("2) login wrong email (expect 403) ->", wa.status, wa.json.message);

// Test B: correct email + wrong password
const wp = await req("POST", "/api/admin/login", { body: { email: "web.grow.india07@gmail.com", password: "wrong-password-zz" }, withCookie: false });
console.log("3) login wrong password (expect 401) ->", wp.status, wp.json.message);

// Test C: correct login
const ok = await req("POST", "/api/admin/login", { body: { email: "web.grow.india07@gmail.com", password: process.env.ADMIN_TEST_PASSWORD }, withCookie: false });
const sc = ok.sc || "";
console.log("4) login correct (expect 200)      ->", ok.status, ok.json.message);
console.log("   cookie httpOnly:", sc.includes("HttpOnly"), "| SameSite:", /SameSite=(\w+)/.exec(sc)?.[1], "| Secure:", sc.includes("Secure"), "| maxAge:", /Max-Age=(\d+)/.exec(sc)?.[1]);

// Test D: protected endpoints with cookie
for (const p of ["/api/admin/me", "/api/admin/stats", "/api/admin/enquiries?limit=2"]) {
  const r = await req("GET", p);
  console.log(`5) GET ${p} (with cookie)   ->`, r.status, r.json?.success ? "success" : "FAIL");
}

// Test E: login again -> should still work (refresh session) and no dup issues
const again = await req("POST", "/api/admin/login", { body: { email: "web.grow.india07@gmail.com", password: process.env.ADMIN_TEST_PASSWORD }, withCookie: false });
console.log("6) second login (session rotate)   ->", again.status);

// Test F: no cookie -> 401
const nc = await req("GET", "/api/admin/me", { withCookie: false });
console.log("7) GET /api/admin/me no cookie     ->", nc.status, nc.json.message);

// Test G: logout + post-logout 401
const lo = await req("POST", "/api/admin/logout");
  const cleared = (lo.sc || "").includes("admin_token=;") && (lo.sc || "").includes("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  console.log("8) POST /api/admin/logout          ->", lo.status, "| cookie cleared:", cleared);
cookie = "";
const after = await req("GET", "/api/admin/me", { withCookie: false });
console.log("9) GET /api/admin/me after logout  ->", after.status, after.json.message);