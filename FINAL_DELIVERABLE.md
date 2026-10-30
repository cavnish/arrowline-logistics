# Arrowline Logistics — Static-First Content Pipeline & Audit Report

**Audit date:** 2026-10-27  
**Branch:** `audit/pre-migration-checkpoint`  
**Production content version:** `20261027T055913Z-575685d4`  
**Snapshot checksum:** `575685d476c82462d3cec83c1d2431e5bf1129dd2fc297d0d4942cc8bca26d05`

---

## 1. Executive summary

The public Arrowline Logistics site was a client-rendered React SPA that fetched all editable content from the Express/Supabase backend at visitor time. Search engines and social crawlers received one generic HTML shell for every URL, and a backend outage could leave pages blank or stuck behind the boot loader.

The site is now **static-first**:

- Published Supabase content is exported into a validated, versioned snapshot committed to the repository.
- Every public route is prerendered to a real `index.html` with unique title, description, canonical, Open Graph/Twitter tags, JSON-LD, and visible page content before JavaScript runs.
- Public pages make **no Supabase or Express content requests** at runtime.
- The admin panel, lead form, Cloudinary uploads, and Resend email flow are preserved.
- A protected admin action can trigger a Vercel rebuild. Failed exports or builds leave the previous deployment live.
- The deployed content version is exposed at `/content-version.json` and `/content-version.txt`.

**Current coverage:** 32 public routes, 26 exported tables, 393 published records.

**Verified build:** `node scripts/build.mjs` — 32 routes, 42 static checks, 70.9 seconds.  
**Verified pipeline:** 28 exporter/preservation/outage checks.  
**TypeScript:** `npx tsc --noEmit` passes. No ESLint configuration exists in this repository.

---

## 2. Audit findings and resolution

| Area | Finding | Resolution |
| --- | --- | --- |
| Rendering | React SPA only; every URL returned the same `index.html`. Per-page metadata was changed by client-side effects after load. | Build-time SSR (`renderToStaticMarkup`) for all 32 routes; metadata injected into each route file. |
| Content source | Public components called `/api/services`, `/api/faqs`, `/api/about`, `/api/testimonials`, `/api/content`, etc. every visit. | All public rendering reads `src/data/content-snapshot.json` synchronously. Runtime content fetches removed. |
| Availability | Supabase/Express outage produced empty sections or a loading state. | Content is bundled into HTML and JS; public pages render offline. Forms fail visibly with a 503 instead of pretending success. |
| SEO | Generic title/description, one canonical, sitemap drift, no crawler-visible service text. | Unique metadata, canonical URLs, JSON-LD, and body content per route; sitemap generated from the same route list. |
| Draft safety | Editable tables contain drafts; a naive export could publish them. | Exporter filters `is_published` (and `is_public` for settings) before validation. Regression test covers drafts/private rows. |
| Pagination | Supabase REST defaults could silently truncate large tables. | Exporter pages in batches of 1000 and reads until exhausted; tested with 1200 rows. |
| Failed export | A failed or empty pull could overwrite good content. | Atomic temp-file rename, required-table guards, validation, and “previous snapshot” preservation in soft mode. |
| Broken route | `/services` had no page and no redirect. | 308 redirect to `/services/road-transportation` in Vercel and the preview/Express servers. |
| Offline loader | The boot splash covered prerendered HTML until React mounted. | Prerender removes the splash; `window.__ARROWLINE_PRERENDERED__` disables the client loader. |
| Publish | No secure rebuild trigger existed. | Admin-only `POST /api/admin/publish` calls a Vercel Deploy Hook; strict build exports fresh published rows. |
| Secrets | A build could accidentally bake server credentials into `dist`. | `verify-build.mjs` scans built text files for configured secret values and fails on a match. |
| Content drift | Static fallback arrays duplicated live content and could diverge. | Published snapshot overrides the static fallbacks at module load; fallbacks remain for a fresh checkout. |

**Intentionally unchanged:** React 19 + Vite 7 + TypeScript + Tailwind CSS, branding and layout, Framer Motion interactions, admin CRUD/media library, Supabase Auth sessions, lead validation/storage, Resend notifications, Cloudinary uploads.

**No database schema changes and no production content updates were made by this work.** The export and build scripts write only to repository files (`src/data/content-snapshot*.json`, `dist/`, `public/sitemap.xml`, `dist-ssr/`); they never write to Supabase.

---

## 3. Content inventory

### 3.1 Discovery method

- Live Supabase REST/OpenAPI schema read on 2026-10-27.
- Public schema contains **31 tables**: 26 exported content tables, 2 relationship/junction tables, and 3 private operational tables.
- The snapshot contains only published/public rows. Counts below are from the committed snapshot and match the live export.
- Empty tables are still exported as empty arrays so downstream code has a stable shape.

### 3.2 Exported tables and counts

| # | Table | Public filter | Published rows | Consumed by |
| --- | --- | --- | ---: | --- |
| 1 | `site_content` | `is_published` | 56 | Hero, header/footer, contact details, CTA copy, About copy |
| 2 | `site_settings` | `is_public` | 11 | Company name/tagline, phone, WhatsApp, email, head office |
| 3 | `services` | `is_published` | 4 | Main service routes, home service cards |
| 4 | `service_items` | `is_published` | 22 | Sub-service routes and service navigation |
| 5 | `service_faqs` | `is_published` | 28 | Service and sub-service FAQ accordions |
| 6 | `service_process_steps` | `is_published` | 24 | Service process timelines |
| 7 | `service_visual_showcase` | `is_published` | 59 | Service galleries/showcase grids |
| 8 | `service_cargo_applications` | `is_published` | 112 | “Cargo we handle” sections |
| 9 | `industries` | `is_published` | 8 | Industries page and home industry cards |
| 10 | `clients` | `is_published` | 0 | Client logo slot (falls back to `trusted_network`) |
| 11 | `trusted_network` | `is_published` | 10 | Client/partner logo strip |
| 12 | `about_images` | `is_published` | 4 | About page image slots |
| 13 | `about_pillars` | `is_published` | 4 | About pillars |
| 14 | `about_milestones` | `is_published` | 5 | About timeline |
| 15 | `about_differentiators` | `is_published` | 3 | About differentiators |
| 16 | `leadership` | `is_published` | 3 | About leadership cards |
| 17 | `core_values` | `is_published` | 5 | About values |
| 18 | `testimonials` | `is_published` | 6 | Testimonials section |
| 19 | `faqs` | `is_published` | 6 | General FAQ section |
| 20 | `statistics` | `is_published` | 4 | Homepage statistics counters |
| 21 | `blog_categories` | `is_published` | 0 | Reserved for future blog routes |
| 22 | `blog_posts` | `is_published` | 0 | Reserved for future blog routes |
| 23 | `gallery_items` | `is_published` | 5 | Gallery page |
| 24 | `case_studies` | `is_published` | 4 | Gallery/case-study section |
| 25 | `social_videos` | `is_published` | 0 | Reserved for future video section |
| 26 | `locations` | `is_published` | 10 | Network hubs and transit-time estimator |

### 3.3 Complete exported column list

Columns below are the live columns observed in the Supabase OpenAPI schema. A snapshot row contains every column returned by `select=*`, including empty/null values.

```text
site_content (56)
id, content_key, content_value, content_type, section, is_published, updated_at, updated_by

site_settings (11)
id, setting_key, setting_value, setting_type, is_public, updated_at

services (4)
id, slug, title, short_description, full_description, icon, hero_image, is_published,
display_order, meta_title, meta_description, canonical_url, og_image, cta_text, cta_url,
created_at, updated_at, hero_video, hero_fallback_image, capabilities, benefits, category,
key_capability, hero_badge, hero_headline, hero_subheadline, hero_description, highlights,
about_badge, about_heading, about_description, about_bullet_points, about_image,
why_arrowline, process_steps, applications, industries, network_description, faqs, gallery,
video_url, video_poster, cta_headline, seo_title, seo_desc, image_alt, image_public_id,
showcase_heading, showcase_description, cargo_heading, cargo_description

service_items (22)
id, service_id, slug, title, short_description, full_description, hero_image, hero_video,
hero_fallback_image, is_published, display_order, meta_title, meta_description,
canonical_url, og_image, capabilities, benefits, parent_slug, parent_name, hero_badge,
hero_headline, hero_subheadline, about_badge, about_heading, about_description,
about_bullet_points, about_image, why_arrowline, process_steps, applications, industries,
faqs, gallery, video_url, video_poster, cta_headline, seo_title, seo_desc, keywords,
created_at, updated_at, image_alt, image_public_id, showcase_heading,
showcase_description, cargo_heading, cargo_description

service_faqs (28)
id, service_id, service_item_id, question, answer, display_order, is_published,
created_at, updated_at

service_process_steps (24)
id, service_id, service_item_id, step, title, subtitle, description, icon, image,
display_order, is_published, created_at, updated_at

service_visual_showcase (59)
id, service_id, service_item_id, title, caption, alt_text, image_url, image_public_id,
image_format, image_width, image_height, image_bytes, display_order, is_published,
created_at, updated_at

service_cargo_applications (112)
id, service_id, service_item_id, title, description, alt_text, image_url,
image_public_id, image_format, image_width, image_height, image_bytes, display_order,
is_published, created_at, updated_at

industries (8)
id, slug, title, description, icon, cargo_types, image, is_published, display_order,
created_at, updated_at

clients (0)
id, name, logo, category, website, is_featured, is_published, display_order, created_at,
updated_at

trusted_network (10)
id, name, logo, category, website, is_featured, is_published, display_order, created_at,
updated_at, description, logo_public_id, logo_format, logo_width, logo_height, logo_alt,
logo_resource_type, logo_bytes

about_images (4)
id, slot, title, alt_text, image_url, image_public_id, is_published, display_order,
created_at, updated_at

about_pillars (4)
id, icon, title, text, color, is_published, display_order, created_at, updated_at

about_milestones (5)
id, year, title, text, is_published, display_order, created_at, updated_at

about_differentiators (3)
id, icon, title, text, accent, is_published, display_order, created_at, updated_at

leadership (3)
id, name, role, location, email, bio, image, image_public_id, image_alt, display_order,
is_published, created_at, updated_at

core_values (5)
id, title, description, icon, display_order, is_published, created_at, updated_at

testimonials (6)
id, customer_name, company, position, testimonial, photo, rating, is_published,
display_order, created_at, updated_at, is_verified

faqs (6)
id, question, answer, category, is_published, display_order, created_at, updated_at

statistics (4)
id, value, label, description, icon, is_published, display_order, created_at, updated_at

blog_categories (0)
id, name, slug, description, is_published, created_at, updated_at

blog_posts (0)
id, title, slug, category_id, author, featured_image, excerpt, content, meta_title,
meta_description, keywords, published_at, is_published, created_at, updated_at,
display_order

gallery_items (5)
id, title, description, category, image, alt_text, is_published, display_order,
created_at, updated_at

case_studies (4)
id, slug, client_name, title, industry, location, description, challenge, solution,
results, featured_image, images, meta_title, meta_description, is_published,
display_order, created_at, updated_at

social_videos (0)
id, title, video_url, embed_url, thumbnail, description, platform, is_published,
display_order, created_at, updated_at

locations (10)
id, slug, name, state, city, description, address, image, map_url, meta_title,
meta_description, is_published, display_order, created_at, updated_at
```

### 3.4 Tables deliberately not exported

| Table(s) | Reason |
| --- | --- |
| `service_industries`, `service_item_industries` | Junction/lookup rows. The rendered relationship is already stored in the published `services.industries` and `service_items.industries` arrays. No public component reads the junction tables. |
| `leads`, `lead_notes` | Customer enquiry data. Private; must never be bundled. |
| `admin_sessions` | Admin session registry. Private security data. |

The public snapshot contains no rows from these tables and no credential fields.

---

## 4. Snapshot format and validation

### 4.1 Files

| File | Purpose |
| --- | --- |
| `src/data/content-snapshot.json` | Bundled published content. Top-level `schemaVersion`, `contentVersion`, `generatedAt`, `source`, `checksum`, `tables`. |
| `src/data/content-snapshot.manifest.json` | Build-friendly metadata: same version/checksum, `totalRecords`, per-table counts, file paths. |
| `src/data/snapshot.ts` | Typed accessors and UI mapping from snapshot rows to existing component models. |
| `src/data/static-export/index.ts` | Compatibility re-export only; it is not the snapshot. |

### 4.2 Exporter behaviour (`scripts/export-content.mjs`)

- Reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from process environment first, then root `.env`, `.env.production`, and `server/.env`. Real CI/build variables are never overridden by files.
- Reads 26 tables with `select=*`, `order=id.asc`, `limit=1000`, `offset` pagination until a short page is returned. Safety cap: offset 500,000.
- Filters every row before validation:
  - `is_published` must be true for all content tables.
  - `site_settings.is_public` must be true.
- Sorts rows by `display_order`, then slug/content key/setting key/id for deterministic output.
- Validates:
  - `site_content`, `site_settings`, and `services` are non-empty.
  - Required fields per table (IDs, slugs, titles, images, FAQ question/answer, etc.).
  - Asset URLs are absolute `http(s)` or root-relative.
  - IDs are unique within every table.
  - Slugs are unique for services, sub-services, industries, case studies, and locations.
  - Published children reference published parents (`service_items`, service FAQs/steps/showcase/cargo → services/service items).
  - `site_content.content_key` and `site_settings.setting_key` are unique.
- Computes a SHA-256 checksum over canonical, key-sorted JSON.
- `contentVersion` = UTC timestamp + first 8 checksum characters, e.g. `20261027T055913Z-575685d4`.
- Writes atomically: temp file then `renameSync`. A crash cannot leave a half-written snapshot.
- Refuses to overwrite when the new export has fewer services than the previous snapshot.
- On any failure, exits non-zero **without touching** the previous snapshot.

### 4.3 Modes

| Invocation | Network | On failure |
| --- | --- | --- |
| `node scripts/export-content.mjs --check` | No | Non-zero; reports validation errors. |
| `node scripts/export-content.mjs` | Yes | Non-zero; previous snapshot untouched. |
| `node scripts/export-content.mjs --soft` | Yes | Keeps the last valid snapshot and exits 0. |
| `node scripts/export-content.mjs --from-file fixture.json` | No | Validates/filters fixture rows. Used by tests. |
| `node scripts/export-content.mjs --remote https://api.example.com` | Yes | Reads `GET /api/content/snapshot` instead of Supabase. |
| `CONTENT_EXPORT_STRICT=1 npm run build` | Yes | Build fails; previous Vercel deployment stays live. |
| `CONTENT_EXPORT_OFFLINE=1 npm run build` | No | Validates the committed snapshot only. |
| `npm run build` (default) | Yes | Refreshes from Supabase when credentials exist, otherwise from the backend snapshot; falls back to the committed snapshot on a local/offline failure. |

Production Vercel builds are strict by default (`VERCEL_ENV=production`): if the
live source cannot be read, the build fails and the previous deployment stays
live. Set `CONTENT_EXPORT_ALLOW_STALE=1` only as an explicit escape hatch.

---

## 5. Render strategy and route inventory

### 5.1 Build pipeline (`scripts/build.mjs`)

1. Refresh the published-content snapshot from Supabase (or from the backend
   `GET /api/content/snapshot` when no Supabase credentials are present).
2. Re-validate the snapshot.
3. TypeScript strict typecheck.
4. Client Vite build → `dist/`.
5. SSR Vite build of `src/entry-server.tsx` → `dist-ssr/`.
6. Prerender 32 routes, sitemap, content-version markers.
7. Verify static output (route files, metadata, assets, sitemap, secrets, offline rendering).
8. Write `dist/build-report.json`.

A failure at any step aborts the build. On Vercel, the previous successful deployment remains live.

### 5.2 Per-route HTML

- `src/entry-server.tsx` renders the app with `renderToStaticMarkup` and `initialPage`/`ssr` props.
- `scripts/prerender.mjs` takes the client-built `dist/index.html`, injects the route body into `#root`, and replaces the marked head block with route-specific tags.
- Each route file includes:
  - unique `<title>`, meta description, keywords, canonical;
  - Open Graph and Twitter tags;
  - route-appropriate JSON-LD;
  - fully rendered visible content;
  - `window.__ARROWLINE_PRERENDERED__ = true`;
  - no boot splash.
- Client entry uses `createRoot` and the same snapshot, so content does not depend on a successful hydration match.
- Output: `dist/index.html`, `dist/about/index.html`, `dist/services/<slug>/index.html`, etc.

### 5.3 Hosting behaviour

- Vercel resolves generated files first (filesystem-first).
- `vercel.json` rewrites unmatched paths to `index.html` for the client-rendered admin area.
- `server/index.js` resolves prerendered route files safely, redirects `/services`, and preserves `/api/*` and admin routing when Express serves `dist/`.
- `scripts/preview.mjs` mirrors this locally, resolving extensionless directory routes instead of returning the SPA shell.

### 5.4 Routes (32)

| Group | Path |
| --- | --- |
| Core | `/` |
| Core | `/about` |
| Core | `/industries` |
| Core | `/gallery` |
| Core | `/contact` |
| Core | `/transit-time-estimator` |
| Service | `/services/road-transportation` |
| Sub-service | `/services/road-transportation/container-transportation` |
| Sub-service | `/services/road-transportation/ftl-ltl-transportation` |
| Sub-service | `/services/road-transportation/odc-heavy-haulage` |
| Sub-service | `/services/road-transportation/project-cargo-transportation` |
| Sub-service | `/services/road-transportation/trailer-multi-axle-transportation` |
| Sub-service | `/services/road-transportation/machinery-industrial-cargo-transportation` |
| Service | `/services/rail-transportation` |
| Sub-service | `/services/rail-transportation/rail-freight-transportation` |
| Sub-service | `/services/rail-transportation/container-rail-transportation` |
| Sub-service | `/services/rail-transportation/full-train-load-ftl` |
| Sub-service | `/services/rail-transportation/multimodal-rail-transportation` |
| Sub-service | `/services/rail-transportation/intermodal-rail-freight` |
| Sub-service | `/services/rail-transportation/bulk-industrial-cargo` |
| Service | `/services/project-cargo-transportation` |
| Sub-service | `/services/project-cargo-transportation/heavy-odc-cargo` |
| Sub-service | `/services/project-cargo-transportation/breakbulk-cargo` |
| Sub-service | `/services/project-cargo-transportation/industrial-machinery` |
| Sub-service | `/services/project-cargo-transportation/multi-axle-special-trailer` |
| Sub-service | `/services/project-cargo-transportation/end-to-end-project-logistics` |
| Service | `/services/warehousing-storage` |
| Sub-service | `/services/warehousing-storage/general-industrial-warehousing` |
| Sub-service | `/services/warehousing-storage/distribution-fulfillment` |
| Sub-service | `/services/warehousing-storage/inventory-management` |
| Sub-service | `/services/warehousing-storage/container-storage-handling` |
| Sub-service | `/services/warehousing-storage/loading-unloading` |

`/services` → `308 /services/road-transportation` (Vercel, preview server, Express).

### 5.5 Generated markers

| Artifact | Content |
| --- | --- |
| `/content-version.json` | `contentVersion`, `schemaVersion`, `generatedAt`, `checksum`, `source`, `totalRecords`, `counts`, `routes`. |
| `/content-version.txt` | Human-readable one-line version. |
| `/prerender-manifest.json` | Route list, metadata version, counts, prerender timestamp. |
| `/build-report.json` | Build mode, steps, durations, Node version, content checksum, route count. |
| `/sitemap.xml` | 32 canonical URLs with lastmod/changefreq/priority. |

The deployed content version can be checked without the admin panel:

```bash
curl https://arrowlinelogistics.in/content-version.json
```

---

## 6. Publishing workflow

### 6.1 Secure trigger design

- Admin logs in at `/arrowline-admin` using Supabase Auth; the server issues an httpOnly session cookie.
- “Publish latest content” in the admin dashboard calls `POST /api/admin/publish`.
- The endpoint requires an authenticated admin session (`requireAdmin`).
- The Vercel Deploy Hook URL lives only in `VERCEL_DEPLOY_HOOK_URL` on the Express server. It is never returned to the browser, never prefixed `VITE_`, and never included in the build.
- The endpoint has a 60-second cooldown, 15-second hook timeout, and returns:
  - `202` when the deploy is queued;
  - `429` during the cooldown;
  - `503` when the hook is not configured;
  - `502` when Vercel rejects or the hook is unreachable.
- `GET /api/admin/publish/status` reports whether publishing is configured, the last trigger (in memory), and the deployed content version.

### 6.2 End-to-end flow

1. Editor creates/updates content and marks rows published.
2. Editor clicks **Publish latest content**.
3. Express calls the Vercel Deploy Hook.
4. Vercel runs `npm run build`; production builds are strict.
5. Exporter pulls all published rows from Supabase (when build credentials are
   configured) or from the backend snapshot endpoint, validates, and writes the
   snapshot.
6. TypeScript → client build → SSR build → prerender → static verification.
7. Vercel promotes the new deployment only if every step passes.
8. `/content-version.json` changes to the new version; the admin panel can read it from the public site (15-second cache).

If Supabase is down, the export fails validation, the build stops, and the previous deployment stays live. Drafts and private settings never enter the snapshot.

### 6.3 Required Vercel configuration

- Build command: `npm run build`
- Output directory: `dist`
- Production environment (either source works):
  - `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server/build only), **or**
  - leave them unset and let the build read
    `https://arrowline-logistics.onrender.com/api/content/snapshot`
    (override with `CONTENT_EXPORT_SOURCE_URL`).
  - `CONTENT_EXPORT_STRICT=1` is optional; production builds are already strict.
- Optional frontend variables:
  - `VITE_API_URL` (Render API origin for forms/admin)
  - `VITE_GA_ID`
  - `VITE_GOOGLE_MAPS_API_KEY`

### 6.4 Required Render/server configuration

- `VERCEL_DEPLOY_HOOK_URL`
- `PUBLIC_SITE_URL` (optional; defaults to `https://arrowlinelogistics.in`)
- All existing Supabase, Resend, Cloudinary, admin, and CORS variables.

---

## 7. Files added or changed

### New build/content pipeline

- `scripts/build.mjs` — build orchestration and mode handling.
- `scripts/export-content.mjs` — live/fixture exporter, pagination, validation, atomic writes.
- `scripts/prerender.mjs` — 32-route HTML, metadata, sitemap, content-version output.
- `scripts/verify-build.mjs` — route/meta/asset/sitemap/secret/offline checks.
- `scripts/test-content-pipeline.mjs` — 28 regression checks.
- `scripts/preview.mjs` — production-like static preview server.
- `src/data/content-snapshot.json` — committed published snapshot.
- `src/data/content-snapshot.manifest.json` — counts and checksum manifest.
- `src/data/snapshot.ts` — typed snapshot accessors and UI mappings.
- `src/data/static-export/index.ts` — compatibility re-export.
- `src/entry-server.tsx` — SSR render entry used only at build time.

### Application changes

- `src/App.tsx` — `initialPage`/`ssr` props, prerender-aware loader, SSR-safe motion.
- `src/hooks/useSiteContent.ts` — synchronous snapshot content.
- `src/hooks/useScrollReveal.ts` — SSR guards.
- `src/components/CountUp.tsx` — SSR guards.
- `src/components/CookieConsent.tsx` — SSR guard.
- `src/components/HeroSection.tsx` — SSR guard.
- `src/components/FAQSection.tsx` — snapshot FAQs, no axios.
- `src/components/ServicesSection.tsx` — snapshot services, no async fetch.
- `src/components/TestimonialsSection.tsx` — snapshot testimonials, no axios.
- `src/components/TrustStrip.tsx` — snapshot partner logos, no fetch.
- `src/components/services/ServiceRouteView.tsx` — synchronous service/sub-service data.
- `src/pages/About.tsx` — snapshot About data, no content service calls.
- `src/data/servicesData.ts` — snapshot overrides for services/sub-services.
- `src/data/logisticsData.ts` — snapshot overrides for industries, FAQs, testimonials, gallery, case studies, team, values, stats, logos, hubs.
- `src/components/admin/PublishPanel.jsx` — new admin publish UI.
- `src/pages/AdminDashboard.jsx` — mounts the publish panel.
- `index.html` — marked head/splash regions for prerender injection.

### Backend changes

- `server/index.js` — `/services` redirect, safe prerendered-file resolution, preserved API/admin routes.
- `server/routes/admin.js` — protected publish trigger/status, remote deployed-version read, no hook leakage.
- `server/package.json` — corrected description.
- `server/README.md` — accurate runtime, endpoint, environment, and publishing documentation.

### Configuration and documentation

- `package.json` — build, preview, export, check, verify, test scripts.
- `vercel.json` — `/services` redirects, immutable asset caching, version-marker revalidation, `trailingSlash: false`, SPA/admin fallback.
- `render.yaml` — `VERCEL_DEPLOY_HOOK_URL` and `PUBLIC_SITE_URL`.
- `.env.example` — build-time export and publishing variables.
- `server/.env.example` — deploy hook and public site variables.
- `.gitignore` — ignores `dist-ssr/`.
- `public/sitemap.xml` — regenerated for 32 routes.
- `FINAL_DELIVERABLE.md` — this report.

### Workspace note

- `src/components/IndustriesSection.tsx` is an untracked, currently unused component (no imports). It is retained to avoid discarding prior uncommitted work and has no build impact.
- All changes remain uncommitted on `audit/pre-migration-checkpoint`. No existing user changes were reverted.

---

## 8. Test results

All results below are from the final workspace state.

| Test | Command | Result |
| --- | --- | --- |
| Full production build | `node scripts/build.mjs` | **PASS** — 32 routes, 42 static checks, 70.9s |
| Content pipeline | `node scripts/test-content-pipeline.mjs` | **PASS** — 28/28 checks |
| Snapshot validation | `node scripts/export-content.mjs --check` | **PASS** — 4 services, 22 sub-services |
| TypeScript | `npx tsc --noEmit` | **PASS** — no errors |
| Static output verification | `node scripts/verify-build.mjs` | **PASS** — 42 checks |
| Server syntax | `node --check server/routes/admin.js` | **PASS** |
| Admin endpoint auth | Local Express on :5055 | `POST /api/admin/publish` → 401 unauth; `GET /api/admin/publish/status` → 401; `/health` → 200 |
| Production preview | `node scripts/preview.mjs` | **PASS** — see smoke list below |

### 8.1 Content pipeline coverage (28 checks)

- Valid fixture export writes snapshot and manifest.
- Draft content and private settings are excluded.
- Every committed row is published/public.
- Pagination reads all 1200 rows across multiple requests and requests offset 1000.
- Failed/invalid export does not overwrite a valid snapshot.
- Strict mode fails without replacing the previous snapshot.
- Soft mode and Supabase outage keep the last valid snapshot.
- Outage without `--soft` fails the export.
- Committed snapshot contains no secret-looking content.

### 8.2 Production preview smoke test

| Check | Result |
| --- | --- |
| `/`, `/about`, `/industries`, `/gallery`, `/contact`, `/transit-time-estimator` | 200 with unique titles and canonicals |
| `/services/road-transportation` | 200, 304 KB prerendered HTML |
| `/services/road-transportation/odc-heavy-haulage` | 200, unique title/canonical |
| `/services/warehousing-storage` | 200, unique content |
| `/services` | 308 → `/services/road-transportation` |
| `/arrowline-admin` | 200 SPA shell (client-rendered admin preserved) |
| `/content-version.json` | 200, version `20261027T055913Z-575685d4`, 393 records, 32 routes |
| `/sitemap.xml` | 200, 32 `<loc>` entries |
| `/assets/*.js` | 200, `Cache-Control: public, max-age=31536000, immutable` |
| Missing asset | 404 |
| Offline lead POST | 503 (graceful failure, not false success) |
| Direct refresh `/about` | 200 with rendered About content |

### 8.3 Build output

- Pre-rendered HTML sizes: 78 KB (`/contact`) to 305 KB (`/services/rail-transportation`).
- Main JS chunk: 1,381.73 kB (363.19 kB gzip) — pre-existing size warning; admin/jsPDF/html2canvas remain lazy chunks.
- CSS: 127.16 kB (20.21 kB gzip).
- Vite warns the main chunk exceeds 1000 kB. This is not a build failure.

### 8.4 Not exercised end-to-end

- A real Vercel Deploy Hook was not triggered because no hook is configured in this local workspace. The unauth/auth boundary, cooldown, timeout, and error paths are implemented and syntax-checked; production validation requires the deployed hook.
- Live Supabase was read during the audit/export, but the final build intentionally used the committed snapshot.

---

## 9. Remaining external dependencies

| Dependency | Used for | Impact if unavailable |
| --- | --- | --- |
| **Supabase** | Admin content CRUD, admin Auth, lead storage, strict publish export. | Public site keeps serving the last static snapshot. Admin/forms/publishing unavailable. |
| **Express on Render** | `/api/lead`, admin APIs, media library, publish trigger. | Public content and navigation still work. Forms show an error; admin/publish unavailable. |
| **Cloudinary** | All live images and some service video assets. | Text/layout still render; images/video may not load. |
| **Resend** | Lead notification and customer confirmation email. | Lead can still be stored; `emailSent` is false and the UI reports the degraded state. |
| **Google Maps/Places** | Optional transit-time estimator routing. | Falls back to Arrowline’s offline hub/network model. |
| **Vercel** | Static hosting, deploy hook, build execution. | No deployment; last live build remains. |

Public page rendering has **no runtime dependency** on Supabase, Express content endpoints, or Resend.

---

## 10. Environment variables (names only, no secrets)

### Frontend — root `.env` / Vercel (browser-visible)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | No | Express API origin for forms/admin. Empty means same-origin `/api/*`. |
| `VITE_GA_ID` | No | Google Analytics measurement ID. |
| `VITE_GOOGLE_MAPS_API_KEY` | No | Browser-restricted Maps/Places key for the estimator; offline model fallback. |

### Build — Vercel (server-side; never `VITE_*`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Optional | Supabase project URL; when both Supabase variables are set the build reads Supabase directly. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Read published rows during export. Server/build only. |
| `CONTENT_EXPORT_SOURCE_URL` | Optional | Backend base URL for the credential-free `GET /api/content/snapshot` refresh. Defaults to the production API. |
| `CONTENT_EXPORT_STRICT` | Optional | `1` requires a fresh valid export; failed build keeps previous deployment. Production builds are strict by default. |
| `CONTENT_EXPORT_OFFLINE` | Optional | `1` skips the live refresh and validates the committed snapshot only. |
| `CONTENT_EXPORT_ALLOW_STALE` | Optional | `1` lets a production build fall back to the committed snapshot when the live source is unreachable. |

### Backend — `server/.env` / Render

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Render-provided | HTTP port; local default 5000. |
| `CORS_ORIGIN` | Yes | Comma-separated allowed origins, no trailing slash. |
| `SUPABASE_URL` | Yes | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side Supabase access. Never expose. |
| `RESEND_API_KEY` | Yes for email | Resend API key. |
| `RESEND_FROM_EMAIL` | Yes for email | Verified sender identity. |
| `LEAD_NOTIFICATION_EMAIL` | Yes for email | Business inbox receiving enquiries. |
| `FROM_EMAIL`, `NOTIFY_EMAILS` | Legacy | Fallbacks for older deployments. |
| `ADMIN_API_KEY` | Yes | 32+ character JWT signing secret for the admin cookie. |
| `ADMIN_EMAIL` | Yes | Primary confirmed Supabase Auth admin user. |
| `ADMIN_EMAILS` | Optional | Additional confirmed admin accounts. |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud. |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary key. |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary secret. Never expose. |
| `VERCEL_DEPLOY_HOOK_URL` | For publishing | Deploy Hook called by the admin Publish button. Never expose. |
| `PUBLIC_SITE_URL` | Optional | Public origin used to read `content-version.json`; defaults to `https://arrowlinelogistics.in`. |
| `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`, `DATABASE_URL` | Optional diagnostics | Only used by `server/scripts/*`; not by the running API. |

`verify-build.mjs` fails if any configured secret value appears in built text files. Secrets are never placed in `VITE_*` variables.

---

## 11. Runbook

### 11.1 Local development

```bash
npm install
npm run dev
```

Public content comes from the committed snapshot; the admin still needs the Express server:

```bash
cd server
npm install
npm run dev
```

### 11.2 Refresh the snapshot from Supabase

```bash
# Hard refresh; fails without overwriting the previous snapshot
npm run content:export

# Keep the last valid snapshot on failure
node scripts/export-content.mjs --soft

# Validate only
npm run content:check
```

Credentials are read from process environment, root `.env`, `.env.production`, or `server/.env`. Never commit them.

### 11.3 Build and preview

```bash
npm run build      # validate/export -> typecheck -> client -> SSR -> prerender -> verify
npm run preview    # http://127.0.0.1:4173 with extensionless route resolution
npm run verify     # static output checks only
npm test           # content pipeline regression tests
```

### 11.4 Publish content

1. Log in at `/arrowline-admin`.
2. Edit and publish rows in Supabase.
3. Click **Publish latest content** (or trigger the Vercel Deploy Hook manually).
4. Watch the Vercel build; a failure leaves the previous deployment live.
5. Confirm the new version:

```bash
curl https://arrowlinelogistics.in/content-version.json
```

6. Hard-refresh a changed route and verify the content and metadata.

### 11.5 Rollback

**Website deployment**

- Vercel dashboard → Deployments → select the last good deployment → **Promote/Rollback**.
- Because failed builds are not promoted, the previous deployment is already the fallback.

**Content snapshot**

```bash
git checkout <last-good-commit> -- src/data/content-snapshot.json src/data/content-snapshot.manifest.json
npm run build
```

Then deploy the rollback commit. `public/sitemap.xml` is regenerated by the build.

**Source code**

- Revert the relevant commit or redeploy the previous Git commit.
- Do not delete `src/data/content-snapshot.json`; the build requires it.

### 11.6 Recovery scenarios

| Scenario | Behaviour | Recovery |
| --- | --- | --- |
| Supabase outage during strict publish | Build fails before Vite; previous deployment stays live. | Retry when Supabase is back, or deploy the committed snapshot with `npm run build`. |
| Supabase returns empty/invalid data | Validation fails; no snapshot write. | Fix data in Supabase, then republish. |
| Export has fewer services than before | Exporter refuses to overwrite. | Confirm whether services were intentionally unpublished; if intentional, use a reviewed manual snapshot change. |
| Vercel unavailable | No new deployment. | Last deployment remains live; retry later. |
| Deploy hook missing | Admin endpoint returns 503. | Set `VERCEL_DEPLOY_HOOK_URL` on Render, or deploy manually. |
| Express/API offline | Public site still renders. Forms return 503 and show an error. | Restart API; no content rebuild needed. |
| Cloudinary offline | Text/layout render; images fail. | Restore Cloudinary or update asset URLs in content. |
| Admin session expired | Admin API returns 401. | Log in again. |
| Need to identify live content | `/content-version.json` and `/content-version.txt`. | Compare with `src/data/content-snapshot.manifest.json` or `dist/build-report.json`. |

### 11.7 Security checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_API_KEY`, `RESEND_API_KEY`, `CLOUDINARY_API_SECRET`, and `VERCEL_DEPLOY_HOOK_URL` are server/build only.
- [x] No secret values in `VITE_*` variables.
- [x] No secret values in the public snapshot or built text assets (verified automatically).
- [x] Publish endpoint requires an admin session.
- [x] Deploy hook URL never returned to the browser.
- [x] Drafts and private settings excluded from export.
- [x] Private lead/session tables excluded from export.
- [x] Publish endpoint has cooldown and timeout.
- [x] Snapshot write is atomic and guarded.

---

## 12. Acceptance checklist

| Requirement | Status |
| --- | --- |
| Keep React + Vite + TypeScript + Tailwind and branding | Done |
| Preserve admin panel, forms, and integrations | Done |
| Export actual published Supabase content | Done — 26 tables, 393 rows |
| Respect `is_published` / `is_public` | Done and tested |
| Include all rows beyond pagination limits | Done — 1000-row pages; 1200-row test |
| Validate required fields/assets/relationships | Done |
| Never overwrite a good snapshot with a failed export | Done and tested |
| Keep previous deployment live on failure | Done via strict build failure semantics |
| Real per-route HTML with unique metadata | Done — 32 routes |
| Visible content before JS | Done |
| Direct URL access/refresh | Done — file-per-route + fallback |
| Offline rendering without infinite loader | Done — no public API calls, splash removed |
| Preserve client logos | Done — 10 `trusted_network` logos |
| Snapshot schema/version/timestamp/manifest/logs | Done |
| Identify deployed content version | `/content-version.json`, `.txt`, build report, admin panel |
| Secure publish trigger | Done — admin-only endpoint + server-only hook |
| Builds/tests/preview executed | Done — results in §8 |
| Documentation | This report + `server/README.md` |

---

## 13. Known limitations and follow-ups

1. **Main JS chunk is 1.38 MB** (363 kB gzip). The build succeeds but Vite warns. Code-splitting the public bundle (for example, deferring estimator/map code) would improve LCP. This is pre-existing and outside the content pipeline.
2. **`clients` has 0 published rows.** The logo strip uses `trusted_network` (10 rows). Publishing `clients` will automatically be included in future snapshots once the UI consumes that table; currently `trusted_network` is the rendered source.
3. **Some content is intentionally empty.** `site_content.hero_video` is empty; the road service uses its own Cloudinary hero video. No route depends on a global hero video.
4. **Admin remains client-rendered.** `/arrowline-admin` uses the SPA fallback, not a prerendered admin page. This is intentional because admin data is session-specific.
5. **Publish “last triggered” state is in memory.** It resets when the Render service restarts. The deployed content version is durable via the public marker.
6. **No ESLint configuration exists.** TypeScript strict mode plus `verify-build.mjs` are the current quality gates.
7. **A real deploy-hook call was not executed in this workspace.** The endpoint’s auth boundary was verified against the local Express server (401 unauthenticated); the Vercel hook path requires production credentials.

---

*Report generated: 2026-10-27*  
*Final verified build: 32 routes, content `20261027T055913Z-575685d4`, checksum `575685d476c82462d3cec83c1d2431e5bf1129dd2fc297d0d4942cc8bca26d05`.*
