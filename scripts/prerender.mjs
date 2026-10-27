#!/usr/bin/env node
/**
 * Per-route static prerenderer.
 *
 * Takes the client-built dist/index.html, renders every public route through
 * the SSR entry, and writes a real directory index.html per route:
 *
 *   dist/index.html
 *   dist/about/index.html
 *   dist/services/road-transportation/index.html
 *   dist/services/road-transportation/container-transportation/index.html
 *   ...
 *
 * Each file gets unique <title>, description, canonical, Open Graph,
 * Twitter and JSON-LD plus the fully rendered page content. The boot splash
 * is removed so content is visible before JS loads.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SSR_ENTRY = path.join(ROOT, "dist-ssr", "entry-server.js");
const SNAPSHOT_FILE = path.join(ROOT, "src", "data", "content-snapshot.json");
const MANIFEST_FILE = path.join(ROOT, "src", "data", "content-snapshot.manifest.json");

const SITE_URL = "https://arrowlinelogistics.in";
const SITE_NAME = "ARROWLINE LOGISTICS";
const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg";
const DEFAULT_KEYWORDS =
  "multimodal logistics India, road transport FTL, coastal shipping India, Mundra Port logistics, ODC transport Gujarat, rail freight CONCOR, project cargo India, customs brokerage Mundra, shipping cargo India";

function fail(message) {
  console.error(`[prerender] ERROR: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`Unable to read ${path.relative(ROOT, file)}: ${error.message}`);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function absolute(pathname) {
  if (/^https?:\/\//i.test(pathname)) return pathname.split("#")[0];
  if (!pathname || pathname === "/") return SITE_URL;
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${clean}`;
}

function routeFile(routePath) {
  if (routePath === "/") return path.join(DIST, "index.html");
  return path.join(DIST, ...routePath.split("/").filter(Boolean), "index.html");
}

function loadSnapshot() {
  if (!fs.existsSync(SNAPSHOT_FILE)) fail("src/data/content-snapshot.json is missing");
  const snapshot = readJson(SNAPSHOT_FILE);
  const manifest = fs.existsSync(MANIFEST_FILE) ? readJson(MANIFEST_FILE) : {};
  return { snapshot, manifest };
}

function buildRoutes(snapshot) {
  const tables = snapshot.tables || {};
  const content = Object.fromEntries(
    (tables.site_content || []).map((row) => [row.content_key, String(row.content_value ?? "")])
  );
  const settings = Object.fromEntries(
    (tables.site_settings || []).map((row) => [row.setting_key, String(row.setting_value ?? "")])
  );

  const homeTitle =
    "Mundra Port Logistics & Pan-India Transportation Services | Arrowline";
  const homeDescription =
    content.hero_description ||
    "Arrowline Logistics is an authorized logistics company headquartered at Mundra Port, Gujarat. Premier container haulage, FTL road freight, rail rakes, and warehousing across India.";

  const routes = [
    {
      path: "/",
      pageId: "home",
      title: homeTitle,
      description: homeDescription,
      keywords: DEFAULT_KEYWORDS,
      changefreq: "weekly",
      priority: "1.0",
      ogImage: content.hero_image || DEFAULT_OG_IMAGE,
    },
    {
      path: "/about",
      pageId: "about",
      title: "About Us | Logistics Company in Mundra & Pan-India Network | Arrowline",
      description:
        "Learn about Arrowline Logistics, an authorized logistics company headquartered at Mundra Port, Gujarat. Connecting Mundra Port to Delhi-NCR, Mumbai, Jaipur, and nationwide manufacturing hubs.",
      keywords:
        "About Arrowline Logistics, Logistics Company in Mundra, Mundra Port Logistics Company, Pan-India Transportation Company, Multimodal Logistics India",
      changefreq: "monthly",
      priority: "0.8",
      ogImage:
        content.about_image ||
        "https://res.cloudinary.com/uorctww6/image/upload/v1789450172/arrowline/site-content/p3ixo6zur8vmvldgq2ff.jpg",
    },
    {
      path: "/industries",
      pageId: "industries",
      title:
        "Industries We Serve | Specialized Cargo Logistics from Mundra Port & Pan-India | Arrowline",
      description:
        "Tailored multimodal logistics and industrial material transportation from Mundra Port for Automotive, Solar & Clean Energy, Steel, Chemicals, and Manufacturing across India.",
      keywords:
        "FMCG logistics India, Automotive logistics India, Manufacturing logistics India, Solar equipment logistics Mundra, Steel transport India, Material transportation India, Pan-India industrial transport",
      changefreq: "monthly",
      priority: "0.8",
      ogImage: content.industries_image || DEFAULT_OG_IMAGE,
    },
    {
      path: "/gallery",
      pageId: "gallery",
      title: "Case Studies & Operational Photo Gallery | Arrowline Logistics",
      description:
        "Review successful logistics case studies from Arrowline Logistics. Highlights include heavy-lift ODC cargo moves, coastal transport loops, and customs brokerage approvals.",
      keywords: DEFAULT_KEYWORDS,
      changefreq: "monthly",
      priority: "0.7",
      ogImage: content.hero_image || DEFAULT_OG_IMAGE,
    },
    {
      path: "/contact",
      pageId: "contact",
      title: "Contact Us | Mundra Port Logistics Desk & Pan-India Offices | Arrowline",
      description:
        "Contact Arrowline Logistics headquarters at Mundra Port, Kutch, Gujarat. 24/7 dispatch desk for container transport, FTL freight quotes, and pan-India route coordination.",
      keywords:
        "Contact Arrowline Logistics, Logistics Office Mundra, Mundra Port Transport Contact, Logistics Quote India, Freight Forwarder Mundra Kutch",
      changefreq: "yearly",
      priority: "0.8",
      ogImage: content.cta_image || DEFAULT_OG_IMAGE,
    },
    {
      path: "/transit-time-estimator",
      pageId: "transit-time-estimator",
      title:
        "Transit Time Estimator | Road Transit Between Any Two Indian Cities | Arrowline",
      description:
        "Estimate road distance, transit days, and delivery window between any two Indian cities - Mundra, Delhi NCR, Mumbai, Jaipur, Bengaluru & 100+ hubs - for containers, FTL, trailers, ODC & project cargo.",
      keywords:
        "Mundra to Delhi transit time, Mundra to Mumbai road distance, FTL transit time India, container transport days Mundra, road freight delivery estimate India",
      changefreq: "monthly",
      priority: "0.7",
      ogImage: content.hero_image || DEFAULT_OG_IMAGE,
    },
  ];

  const services = (tables.services || []).filter((row) => row.is_published !== false);
  const serviceItems = (tables.service_items || []).filter((row) => row.is_published !== false);
  const byParent = new Map();
  for (const item of serviceItems) {
    if (!byParent.has(item.service_id)) byParent.set(item.service_id, []);
    byParent.get(item.service_id).push(item);
  }

  for (const service of services) {
    routes.push({
      path: `/services/${service.slug}`,
      pageId: `services/${service.slug}`,
      title: service.seo_title || service.meta_title || service.title,
      description:
        service.seo_desc ||
        service.meta_description ||
        service.short_description ||
        `${service.title} services from Arrowline Logistics.`,
      keywords: DEFAULT_KEYWORDS,
      changefreq: "monthly",
      priority: "0.9",
      ogImage: service.hero_image || DEFAULT_OG_IMAGE,
      service,
    });

    for (const item of byParent.get(service.id) || []) {
      routes.push({
        path: `/services/${service.slug}/${item.slug}`,
        pageId: `services/${service.slug}/${item.slug}`,
        title: item.seo_title || item.meta_title || `${item.title} | Arrowline Logistics`,
        description:
          item.seo_desc ||
          item.meta_description ||
          item.short_description ||
          `${item.title} by Arrowline Logistics.`,
        keywords: DEFAULT_KEYWORDS,
        changefreq: "monthly",
        priority: "0.7",
        ogImage: item.hero_image || service.hero_image || DEFAULT_OG_IMAGE,
        service: item,
        parentService: service,
      });
    }
  }

  return { routes, content, settings };
}

function organizationSchema(settings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name || "Arrowline Logistics",
    alternateName: "Arrowline Multimodal Logistics",
    description:
      settings.aboutShort ||
      "Arrowline Logistics is a multimodal logistics and transportation company headquartered at Mundra Port, Gujarat.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/arrowline-logo.png`,
    email: settings.primaryEmail || "mundra@arrowlinelogistics.in",
    telephone: settings.phone || "+91 99222 04446",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.headOffice || "Mundra Port Road, Mundra",
      addressLocality: "Mundra",
      addressRegion: "Gujarat",
      postalCode: "370421",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone || "+91 99222 04446",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "gu"],
    },
  };
}

function localBusinessSchema(settings) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.name || "Arrowline Logistics",
    image: DEFAULT_OG_IMAGE,
    url: SITE_URL,
    telephone: settings.phone || "+91 99222 04446",
    email: settings.primaryEmail || "mundra@arrowlinelogistics.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.headOffice || "Mundra Port Road, Mundra",
      addressLocality: "Mundra",
      addressRegion: "Gujarat",
      postalCode: "370421",
      addressCountry: "IN",
    },
    areaServed: "India",
    priceRange: "$$",
  };
}

function serviceSchema(route) {
  if (!route.service) return null;
  const service = route.service;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.category || "Logistics",
    description: service.seo_desc || service.short_description || service.title,
    url: absolute(route.path),
    areaServed: { "@type": "Country", name: "India" },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

function breadcrumbSchema(route) {
  if (!route.path.startsWith("/services/")) return null;
  const parts = route.path.split("/").filter(Boolean);
  const items = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: route.parentService?.title || route.service?.title || "Services", url: `${SITE_URL}/services/${parts[1] || ""}` },
  ];
  if (parts.length > 2) {
    items.push({ name: route.service.title, url: absolute(route.path) });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function renderHead(route, settings) {
  const canonical = absolute(route.path);
  const title = `${route.title}${route.path === "/" ? "" : ` | ${SITE_NAME}`}`;
  const description = String(route.description || "").replace(/\s+/g, " ").trim();
  const image = route.ogImage || DEFAULT_OG_IMAGE;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Arrowline Logistics",
      alternateName: "Arrowline Logistics India Pvt Ltd",
      url: SITE_URL,
      inLanguage: "en-IN",
    },
    organizationSchema(settings),
    localBusinessSchema(settings),
    serviceSchema(route),
    breadcrumbSchema(route),
  ].filter(Boolean);

  return `<!-- PRERENDER:HEAD:START -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="Arrowline Logistics" />
    <meta name="keywords" content="${escapeHtml(route.keywords || DEFAULT_KEYWORDS)}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Arrowline Logistics" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <script id="seo-structured-data" type="application/ld+json">
${jsonLd(schemas)}
    </script>
    <!-- PRERENDER:HEAD:END -->`;
}

function injectIntoShell(shell, route, body, settings) {
  let html = shell;

  if (!html.includes("<!-- PRERENDER:SPLASH:START -->")) {
    fail("dist/index.html is missing PRERENDER:SPLASH markers (was the client build run first?)");
  }
  if (!html.includes("<!-- PRERENDER:SPLASH_STYLE:START -->")) {
    fail("dist/index.html is missing PRERENDER:SPLASH_STYLE markers");
  }
  if (!html.includes("<!-- PRERENDER:HEAD:START -->")) {
    fail("dist/index.html is missing PRERENDER:HEAD markers");
  }

  // Static-looking pages should not pay for an intro loader on every load.
  // NOTE: this must happen before the splash removal (the Vite module script
  // lives in <head> and could otherwise be swallowed by a broad marker range).
  html = html.replace(
    "<script type=\"module\"",
    "<script>window.__ARROWLINE_PRERENDERED__=true;</script>\n    <script type=\"module\""
  );

  html = html.replace(
    /<!-- PRERENDER:HEAD:START -->[\s\S]*?<!-- PRERENDER:HEAD:END -->/,
    () => renderHead(route, settings)
  );
  html = html.replace(
    /<!-- PRERENDER:SPLASH_STYLE:START -->[\s\S]*?<!-- PRERENDER:SPLASH_STYLE:END -->/,
    "<!-- prerendered: no boot splash styles (content is already rendered) -->"
  );
  html = html.replace(
    /<!-- PRERENDER:SPLASH:START -->[\s\S]*?<!-- PRERENDER:SPLASH:END -->/,
    "<!-- prerendered: no boot splash (content is already rendered) -->"
  );
  html = html.replace(
    /<div id="root"><\/div>/,
    () => `<div id="root">${body}</div>`
  );

  return html;
}

function buildSitemap(routes, lastmod) {
  const urls = routes
    .slice()
    .sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path)))
    .map((route) => {
      const priority = route.priority || "0.7";
      return `  <url>
    <loc>${escapeHtml(absolute(route.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq || "monthly"}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  if (!fs.existsSync(SSR_ENTRY)) {
    fail(`SSR entry not found at ${path.relative(ROOT, SSR_ENTRY)}. Run the SSR build first.`);
  }
  const shellPath = path.join(DIST, "index.html");
  if (!fs.existsSync(shellPath)) fail("dist/index.html is missing. Run the client build first.");

  const { snapshot, manifest } = loadSnapshot();
  const { routes, settings } = buildRoutes(snapshot);
  const shell = fs.readFileSync(shellPath, "utf8");
  const { renderRoute } = await import(pathToFileURL(SSR_ENTRY).href);

  if (typeof renderRoute !== "function") fail("SSR entry does not export renderRoute()");

  const startedAt = Date.now();
  const rendered = [];

  for (const route of routes) {
    let body;
    try {
      body = renderRoute(route.pageId);
    } catch (error) {
      fail(`SSR render failed for ${route.path}: ${error.stack || error.message}`);
    }

    if (!body || body.trim().length < 500) {
      fail(`SSR render for ${route.path} produced suspiciously small output (${body?.length || 0} bytes)`);
    }

    const html = injectIntoShell(shell, route, body, settings);
    const output = routeFile(route.path);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, html, "utf8");
    rendered.push({
      path: route.path,
      file: path.relative(DIST, output).split(path.sep).join("/"),
      title: route.title,
      description: route.description,
      canonical: absolute(route.path),
      bytes: Buffer.byteLength(html),
      bodyBytes: Buffer.byteLength(body),
    });
    console.log(`[prerender] ${route.path.padEnd(62)} ${String(Buffer.byteLength(html)).padStart(7)} bytes`);
  }

  const lastmod = (snapshot.generatedAt || new Date().toISOString()).slice(0, 10);
  const sitemap = buildSitemap(routes, lastmod);
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), sitemap, "utf8");

  const contentVersion = {
    contentVersion: snapshot.contentVersion,
    schemaVersion: snapshot.schemaVersion,
    generatedAt: snapshot.generatedAt,
    checksum: snapshot.checksum,
    source: snapshot.source,
    totalRecords: manifest.totalRecords ?? null,
    counts: manifest.counts ?? {},
    routes: rendered.length,
  };
  fs.writeFileSync(
    path.join(DIST, "content-version.json"),
    `${JSON.stringify(contentVersion, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(DIST, "prerender-manifest.json"),
    `${JSON.stringify(
      {
        ...contentVersion,
        prerenderedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        routes: rendered,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  // A tiny plain-text version marker is useful for uptime/deploy checks.
  fs.writeFileSync(
    path.join(DIST, "content-version.txt"),
    `${snapshot.contentVersion}\n`,
    "utf8"
  );

  console.log(`[prerender] Done: ${rendered.length} routes, content ${snapshot.contentVersion}`);
}

main().catch((error) => {
  fail(error?.stack || error?.message || String(error));
});
