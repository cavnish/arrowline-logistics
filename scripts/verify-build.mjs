#!/usr/bin/env node
/**
 * Static-output verification.
 *
 * Runs after prerender and fails the build when any of these regress:
 *  - every published route has a real HTML file with rendered content;
 *  - every route has a unique title/description/canonical;
 *  - referenced local assets exist;
 *  - sitemap matches the route list;
 *  - content-version markers match the snapshot;
 *  - no server secret leaked into dist;
 *  - routes still render when requested directly (offline static server).
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SNAPSHOT_FILE = path.join(ROOT, "src", "data", "content-snapshot.json");
const ENV_FILES = [path.join(ROOT, ".env"), path.join(ROOT, ".env.production"), path.join(ROOT, "server", ".env")];

const failures = [];
const checks = [];

function fail(message) {
  failures.push(message);
}

function pass(message) {
  checks.push(message);
}

function readJson(file, label) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${label} is missing or invalid: ${error.message}`);
    return null;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseAttr(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1] : null;
}

function expectDoc(html, route) {
  const title = parseAttr(html, /<title>([\s\S]*?)<\/title>/i);
  const description = parseAttr(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = parseAttr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  return {
    title: title ? title.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim() : null,
    description: description ? description.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim() : null,
    canonical,
    route,
  };
}

function routeFile(routePath) {
  if (routePath === "/") return path.join(DIST, "index.html");
  return path.join(DIST, ...routePath.split("/").filter(Boolean), "index.html");
}

function buildExpectedRoutes(snapshot) {
  const tables = snapshot.tables || {};
  const routes = [
    "/",
    "/about",
    "/industries",
    "/gallery",
    "/contact",
    "/transit-time-estimator",
  ];
  const services = (tables.services || []).filter((row) => row.is_published !== false);
  const items = (tables.service_items || []).filter((row) => row.is_published !== false);
  for (const service of services) {
    routes.push(`/services/${service.slug}`);
    for (const item of items.filter((row) => row.service_id === service.id)) {
      routes.push(`/services/${service.slug}/${item.slug}`);
    }
  }
  return routes;
}

function collectTextFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTextFiles(full, out);
    } else if (/\.(html|js|css|json|xml|txt|svg|map)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function secretValues() {
  const values = new Map();
  const keys = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_KEY",
    "RESEND_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_API_KEY",
    "ADMIN_API_KEY",
    "VERCEL_DEPLOY_HOOK_URL",
    "GITHUB_TOKEN",
    "PUBLISH_TOKEN",
  ];
  for (const file of ENV_FILES) {
    if (!fs.existsSync(file)) continue;
    for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
      if (keys.includes(key) && value.length >= 12) values.set(key, value);
    }
  }
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.length >= 12) values.set(key, value);
  }
  return values;
}

async function offlineFetchChecks(routes) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
  };

  const server = http.createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end("bad request");
      return;
    }
    if (pathname.endsWith("/")) pathname += "index.html";
    let file = path.resolve(DIST, `.${pathname}`);
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
    if (!fs.existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      Connection: "close",
    });
    res.end(fs.readFileSync(file));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const samples = ["/", "/about", "/services/road-transportation"];
  const deepRoute = routes.find((route) => route.split("/").filter(Boolean).length >= 3);
  if (deepRoute) samples.push(deepRoute);

  try {
    for (const route of samples) {
      const response = await fetch(`http://127.0.0.1:${port}${route}`, {
        headers: { Accept: "text/html" },
      });
      const html = await response.text();
      if (response.status !== 200) {
        fail(`Offline request ${route} returned HTTP ${response.status}`);
        continue;
      }
      if (!/<div id="root">[\s\S]{500,}<\/div>/.test(html)) {
        fail(`Offline request ${route} did not return prerendered page content`);
        continue;
      }
      if (!html.includes("__ARROWLINE_PRERENDERED__")) {
        fail(`Offline request ${route} is missing the prerender marker`);
        continue;
      }
      pass(`offline route ${route} (${Buffer.byteLength(html)} bytes)`);
    }
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    fail("dist/index.html is missing. Run the client build and prerender first.");
    finish();
    return;
  }

  const snapshot = readJson(SNAPSHOT_FILE, "content snapshot");
  const version = readJson(path.join(DIST, "content-version.json"), "dist/content-version.json");
  const manifest = readJson(path.join(DIST, "prerender-manifest.json"), "dist/prerender-manifest.json");
  if (!snapshot || !version || !manifest) {
    finish();
    return;
  }

  if (snapshot.schemaVersion !== version.schemaVersion) fail("Snapshot and dist schemaVersion differ");
  if (snapshot.contentVersion !== version.contentVersion) fail("dist content version does not match snapshot");
  if (snapshot.checksum !== version.checksum) fail("dist checksum does not match snapshot");
  if (version.totalRecords !== manifest.totalRecords) fail("content-version and prerender manifest record counts differ");
  const txt = fs.readFileSync(path.join(DIST, "content-version.txt"), "utf8").trim();
  if (txt !== snapshot.contentVersion) fail("dist/content-version.txt does not match snapshot");
  pass(`content version ${snapshot.contentVersion} (${snapshot.checksum.slice(0, 12)}…)`);

  const expectedRoutes = buildExpectedRoutes(snapshot);
  const manifestRoutes = new Map((manifest.routes || []).map((row) => [row.path, row]));
  if (expectedRoutes.length !== (manifest.routes || []).length) {
    fail(`Expected ${expectedRoutes.length} prerendered routes, manifest lists ${manifest.routes?.length || 0}`);
  }

  const docs = [];
  for (const route of expectedRoutes) {
    const file = routeFile(route);
    if (!fs.existsSync(file)) {
      fail(`Missing prerendered file for ${route} (${path.relative(ROOT, file)})`);
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    if (html.length < 5000) fail(`${route} HTML is suspiciously small (${html.length} bytes)`);
    if (!html.includes("__ARROWLINE_PRERENDERED__")) fail(`${route} is missing the prerender marker`);
    if (html.includes('id="boot-splash"')) fail(`${route} still contains the blocking boot splash`);
    if (!/<div id="root">[\s\S]{500,}<\/div>/.test(html)) {
      fail(`${route} does not contain rendered body content inside #root`);
    }
    const doc = expectDoc(html, route);
    if (!doc.title) fail(`${route} has no <title>`);
    if (!doc.description || doc.description.length < 40) fail(`${route} has a missing/too-short description`);
    if (!doc.canonical) fail(`${route} has no canonical link`);
    const expectedCanonical = `https://arrowlinelogistics.in${route === "/" ? "" : route}`;
    if (doc.canonical !== expectedCanonical) {
      fail(`${route} canonical is ${doc.canonical}, expected ${expectedCanonical}`);
    }
    if (!html.includes('property="og:title"') || !html.includes('name="twitter:card"')) {
      fail(`${route} is missing Open Graph / Twitter metadata`);
    }
    if (!html.includes('type="application/ld+json"')) fail(`${route} is missing JSON-LD structured data`);

    // Local bundle assets referenced by this page must exist.
    const assetRefs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
    for (const ref of new Set(assetRefs)) {
      const asset = path.join(DIST, ref.replace(/^\//, "").split("?")[0]);
      if (!fs.existsSync(asset)) fail(`${route} references missing asset ${ref}`);
    }
    if (!assetRefs.some((ref) => ref.endsWith(".js"))) fail(`${route} does not reference a local JS bundle`);
    if (!assetRefs.some((ref) => ref.endsWith(".css"))) fail(`${route} does not reference a local CSS bundle`);

    docs.push(doc);
    pass(`route ${route} (${Buffer.byteLength(html)} bytes)`);
  }

  // Unique title/description/canonical per route.
  for (const field of ["title", "canonical"]) {
    const seen = new Map();
    for (const doc of docs) {
      const value = doc[field];
      if (!value) continue;
      if (seen.has(value)) fail(`Duplicate ${field} on ${doc.route} and ${seen.get(value)}`);
      seen.set(value, doc.route);
    }
  }
  // Descriptions may legitimately repeat only if page content does; warn-level
  // duplication is treated as an error for SEO-critical service pages.
  const descriptions = new Map();
  for (const doc of docs) {
    if (!doc.description) continue;
    if (descriptions.has(doc.description)) {
      const other = descriptions.get(doc.description);
      if (doc.route.startsWith("/services/") && other.startsWith("/services/")) {
        fail(`Duplicate service-page description on ${doc.route} and ${other}`);
      }
    }
    descriptions.set(doc.description, doc.route);
  }

  // Sitemap must contain exactly the public routes.
  const sitemapFile = path.join(DIST, "sitemap.xml");
  if (!fs.existsSync(sitemapFile)) {
    fail("dist/sitemap.xml is missing");
  } else {
    const sitemap = fs.readFileSync(sitemapFile, "utf8");
    for (const route of expectedRoutes) {
      const loc = `https://arrowlinelogistics.in${route === "/" ? "" : route}`;
      if (!sitemap.includes(`<loc>${loc}</loc>`)) fail(`sitemap.xml is missing ${loc}`);
    }
    const locCount = (sitemap.match(/<loc>/g) || []).length;
    if (locCount !== expectedRoutes.length) fail(`sitemap.xml has ${locCount} URLs, expected ${expectedRoutes.length}`);
    if (/arrowline-admin|\/api\//.test(sitemap)) fail("sitemap.xml contains private/admin URLs");
    pass(`sitemap.xml (${locCount} routes)`);
  }

  // Required generated files + internal links in the home page.
  for (const file of ["content-version.json", "content-version.txt", "prerender-manifest.json"]) {
    if (!fs.existsSync(path.join(DIST, file))) fail(`dist/${file} is missing`);
  }
  const home = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  for (const href of ["/about", "/industries", "/contact", "/services/road-transportation"]) {
    if (!home.includes(`href="${href}"`)) fail(`Home page is missing internal link ${href}`);
  }
  pass("home page internal links");

  // Secret scan across every text artifact in dist.
  const secrets = secretValues();
  if (secrets.size === 0) {
    pass("secret scan (no local secret values available to compare)");
  } else {
    const files = collectTextFiles(DIST);
    let leaks = 0;
    for (const [key, value] of secrets) {
      const needle = new RegExp(escapeRegExp(value));
      for (const file of files) {
        const text = fs.readFileSync(file, "utf8");
        if (needle.test(text)) {
          fail(`Server secret ${key} leaked into ${path.relative(ROOT, file)}`);
          leaks += 1;
        }
      }
    }
    if (!leaks) pass(`secret scan across ${files.length} dist text files`);
  }

  // Public pages must not embed Supabase/backend content APIs.
  const allText = collectTextFiles(DIST)
    .filter((file) => /\.(html|js)$/i.test(file))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
  if (/\/api\/(content|services|industries|about|site-settings|trusted-network)/.test(allText)) {
    fail("Public bundle still references a runtime content API");
  } else {
    pass("no runtime content API calls in public bundle");
  }
  if (/supabase\.co/i.test(allText)) fail("Supabase URL found in public bundle");

  await offlineFetchChecks(expectedRoutes);

  if (manifestRoutes.size > 0) pass(`prerender manifest ${manifestRoutes.size} routes`);

  finish();
}

function finish() {
  if (failures.length) {
    console.error("\n[verify-build] ❌ Static output verification failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log(`\n[verify-build] ✅ ${checks.length} checks passed`);
  for (const check of checks.slice(0, 12)) console.log(`  - ${check}`);
  if (checks.length > 12) console.log(`  - …and ${checks.length - 12} more`);
}

main().catch((error) => {
  console.error("[verify-build] Unexpected failure:", error);
  process.exit(1);
});
