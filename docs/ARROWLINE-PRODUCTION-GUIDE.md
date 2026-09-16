# Arrowline Logistics - Production & Deployment Guide

Complete, project-specific guide for `https://www.arrowlinelogistics.in`,
based on the actual code in this repository (frontend, Express API, Supabase
schema/migrations, Cloudinary integration, Resend email, Admin CMS).

**Secrets policy:** This file documents environment variable NAMES only.
No production secret values are stored in the repository.

- Frontend: React 19 + Vite + Tailwind CSS v4 (single-file build)
- Backend: Express (Node.js) + Supabase + Cloudinary + Resend
- Admin: Client-side CMS (`#/arrowline-admin`) backed by `/api/admin`

---

## 1. Project Overview

| Layer      | Technology | Role |
|------------|-----------|------|
| Frontend   | React 19, Vite 7, Tailwind CSS 4, `vite-plugin-singlefile` | Public website + Admin CMS interface. Builds to a single `dist/index.html` |
| Backend    | Node.js + Express 4, `@supabase/supabase-js`, `cloudinary`, `resend` | REST API, admin API, image uploads, lead handling, emails, SPA hosting |
| Database   | Supabase (PostgreSQL) | Stores all CMS content, business data, leads and admin sessions |
| Auth       | Supabase Auth (login) + JWT in an httpOnly cookie + `admin_sessions` registry | Admin access control |
| CMS        | Client-side admin panels (React) + generic/dedicated admin API routes | CRUD + publish state for every content type |
| Images     | Cloudinary (v2) | All image/video media. Supabase Storage is NOT used for media |
| Email      | Resend | Lead notification emails + customer confirmations |
| Deployment | Hostinger (Node.js app) | Hosts the Express app which serves `dist/index.html` + static assets |

### Verified company facts (used across the site and SEO files)
- Company: Arrowline Logistics (Arrowline Logistics India Pvt Ltd), est. 2014
- HQ: Office 204, Portview Commercial Complex, Near Adani House, Mundra Port
  Road, Mundra, Kutch, Gujarat 370421, India
- Emails: `mundra@arrowlinelogistics.in`, `info@arrowlinelogistics.in`
- Phones: `+91 99222 04446`, `+91 97662 62612`; WhatsApp `+91 99222 04446`

---

## 2. Complete Architecture

### Public website flow
```
Customer (browser)
    |  https://www.arrowlinelogistics.in  (HTTPS)
    v
Hostinger Node.js app  ---- serves ---- dist/index.html + static assets
    |  GET /api/...  (same origin; CORS allows the domain)
    v
Express API (server/index.js)
    |-- Public content endpoints  (/api/services, /api/about, /api/trusted-network, ...)
    |-- Lead submission          (POST /api/lead)
    |-- SPA catch-all            (serves index.html)
    v
Supabase (PostgreSQL via service-role client)  ---- CMS tables / leads
    |
Cloudinary  ---- images rendered on public pages (secure_url in DB)
Resend      ---- team notification email + customer confirmation
```

### Admin flow
```
Admin (browser)
    |  https://www.arrowlinelogistics.in/#/arrowline-admin
    v
Admin Authentication  (POST /api/admin/login -> httpOnly cookie `admin_token`)
    v
Express Admin API  (/api/admin/*, guarded by `requireAdmin` middleware)
    |-- Generic collection CRUD   (GET/POST/PATCH/DELETE /api/admin/:resource)
    |-- Dedicated services CMS, showcase, cargo, trusted-network, media
    |-- Media uploads  (POST /api/admin/media -> multer -> Cloudinary)
    v
Supabase  ---- content metadata rows  (image_url + image_public_id + dims)
Cloudinary ---- actual image files  (folder whitelist; destroy on replace/delete)
Public API ---- published rows only  (is_published = true)
Public Website ---- React renders DB data (overrides static fallbacks)
```

---

## 3. Frontend Structure

- **Framework:** React 19 + Vite 7 + Tailwind CSS v4 (`@tailwindcss/vite`).
- **Routing:** Custom **hash-based routing** in `src/App.tsx`. A `hashchange`
  listener maps `window.location.hash`. Any hash starting with
  `#/arrowline-admin` renders `<AdminRouter/>`; everything else renders the
  public site.
- **Public pages:** Home (`#/`, `#/home`), About (`#/about`), Industries
  (`#/industries`), Gallery/Case Studies (`#/gallery`), Contact (`#/contact`),
  and service pages under `#/services/...` rendered by `ServiceRouteView`.
- **Service pages:** `ServicePageTemplate` + `ServiceSchema` (JSON-LD
  LogisticsService, Service, BreadcrumbList, FAQPage). SEO title/description
  are set per service from CMS data.
- **API communication:** `axios` helpers - `src/services/contentService.ts`
  (public content) and `src/services/adminApi.js` (admin API,
  `withCredentials`). API base URL comes from `VITE_API_URL` (empty in
  production = same origin).
- **Admin pages:** `src/admin/AdminRouter.tsx` + `src/pages/Admin*.jsx`
  panels, layout in `src/components/admin/AdminLayout.jsx`.
- **SEO meta:** `src/components/SEOMeta.tsx` (title, description, keywords,
  Open Graph, Twitter cards, canonical, JSON-LD Organization + LocalBusiness).
- **Build output:** `npm run build` -> `dist/index.html` (all JS/CSS inlined
  by `vite-plugin-singlefile`, ~1.3 MB) + copies of `public/` files
  (`robots.txt`, `sitemap.xml`, `site.txt`, `images/`, favicon).

---

## 4. Backend Structure

- **Entry:** `server/index.js` (Express, ES modules, `dotenv/config`).
- **Start scripts:** `npm start` -> `node index.js`;
  `npm run dev` -> `node --watch index.js`.
- **Middleware:** `express.json({ limit: "50kb" })`, `cookie-parser`, `cors`
  (credentialed via `CORS_ORIGIN`), `trust proxy = 1` (Nginx on Hostinger).

### Public routes (`server/index.js`)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Serves `dist/index.html` when built, else JSON status |
| GET | `/health` | Health check (API up, Supabase/Resend/Admin-key configured) |
| GET | `/api/content` | Published `site_content` |
| GET | `/api/services` | Published services, ordered |
| GET | `/api/services/:slug` | Service + sub-services + showcase + cargo applications |
| GET | `/api/services/:serviceSlug/:subSlug` | Sub-service detail |
| GET | `/api/service-items` | Published sub-services |
| GET | `/api/industries` | Published industries |
| GET | `/api/clients` | Published clients |
| GET | `/api/trusted-network` | Published trusted partners |
| GET | `/api/site-settings` | Public site settings (`is_public=true`) |
| GET | `/api/about` | Consolidated About payload (siteContent + images + pillars + milestones + differentiators) |
| GET | `/api/case-studies`, `/api/gallery`, `/api/locations`, `/api/faqs`, `/api/testimonials`, `/api/blog-categories`, `/api/blog-posts`, `/api/social-videos`, `/api/statistics`, `/api/leadership`, `/api/core-values` | Published collections by `display_order` |
| POST | `/api/lead` | Lead submission (rate-limited) + Resend notifications |
| GET | static assets via `express.static(distDir)` | robots.txt, sitemap.xml, site.txt, images |
| GET | `*` | SPA catch-all -> `index.html` (non-`/api/` paths) |

### Admin routes (`server/routes/admin.js`, mounted at `/api/admin`)
All protected by `requireAdmin` (JWT cookie + `admin_sessions` check).

| Method + Path | Purpose |
|---------------|---------|
| POST `/api/admin/login`, `/logout`; GET `/api/admin/me` | Authentication / session |
| GET `/api/admin/stats` | Lead dashboard counts |
| GET/PATCH/DELETE `/api/admin/enquiries(...)` + notes | Lead pipeline (`leads`, `lead_notes`) |
| GET/POST/PATCH/DELETE `/api/admin/services`, `/api/admin/service-items` | Services & sub-services CMS (Cloudinary cleanup) |
| POST `/api/admin/media`; GET `/list`; GET `/image-usage`; DELETE; PUT `/replace` | Cloudinary media operations |
| GET/PUT `/api/admin/content/:key` | `site_content` key/value edits |
| Dedicated `/api/admin/trusted-network`, `/api/admin/showcase`, `/api/admin/cargo-applications` | Trusted logos, showcase images, cargo cards |
| Generic `/api/admin/:resource` + `/:id` | industries, clients, case-studies, gallery, locations, faqs, testimonials, blog-categories, blog-posts, social-videos, statistics, site-settings, leadership, core-values, about-images, about-pillars, about-milestones, about-differentiators |

### Error handling
- 404 JSON `{ ok: false, error: "Route not found" }`, 400 malformed JSON,
  413 oversized body, generic 500 otherwise.
- Cloudinary cleanup (`destroyCloudinaryAsset`) is best-effort and never
  fails a request.
- Failures are logged; customer-facing errors never leak internals.

---

## 5. Supabase Structure

Supabase (PostgreSQL) is the single source of truth for all CMS content.
Public GETs are read-only; writes happen through the service-role Express
server.

### CMS / business tables
| Table | Purpose |
|-------|---------|
| `site_content` | Global key/value text/image content grouped by `section` |
| `site_settings` | Public site settings (`is_public`) |
| `services` | 4 main services (hero/video/about/capabilities/SEO columns) |
| `service_items` | 22 sub-services (parented via `parent_slug` / `service_id`) |
| `service_faqs` | FAQ per service/sub-service |
| `service_process_steps` | Process steps per service/sub-service |
| `service_industries`, `service_item_industries` | Junction: services <-> industries |
| `service_visual_showcase` | Multi-image showcase per service/sub-service |
| `service_cargo_applications` | Cargo profile cards per service/sub-service |
| `industries` | Industry verticals |
| `clients` | Client logos/names |
| `trusted_network` | Trusted partner logos + Cloudinary metadata |
| `case_studies` | Case studies |
| `gallery_items` | Gallery images |
| `locations` | Offices/warehouses |
| `faqs` | General FAQs |
| `testimonials` | Client testimonials (`is_verified`) |
| `blog_categories` | Blog categories |
| `blog_posts` | Blog articles |
| `social_videos` | Video embeds |
| `statistics` | Counter stats |
| `leadership` | Leader profiles |
| `core_values` | Core values |
| `about_images`, `about_pillars`, `about_milestones`, `about_differentiators` | About-page structured CMS |

### Operational tables
| Table | Purpose |
|-------|---------|
| `leads` | Website lead submissions (`reference_number`, status, priority, ...) |
| `lead_notes` | Internal notes on leads (cascade-deleted with the lead) |
| `admin_sessions` | Revocable JWT session registry (`jti`, `expires_at`, `revoked_at`) |

### Migrations
All schema changes live in `supabase/migrations/` (`20260824_*` ...
`20260916_*`) and are applied with Supabase CLI / `pg` diagnostic scripts.

---

## 6. Cloudinary Flow

### Upload pipeline
```
Admin local image
    |  POST /api/admin/media  (multer, memory storage, <= 10 MB)
    v
Express validates magic bytes (JPEG/PNG/WebP/GIF/AVIF/HEIC/SVG) + folder whitelist
    |  folder routing: arrowline/general | arrowline/services/{slug}
    |                   arrowline/sub-services/{parent}/{slug} | arrowline/gallery
    v
Cloudinary upload_stream  ->  { secure_url, public_id, width, height, format, bytes }
    v
Supabase metadata row  (image_url, image_public_id, dimensions, format, bytes)
    v
Public API  ->  React <img>  (secure_url; optional getOptimizedImageUrl)
```

### Rules / security
- **Folder whitelist:** uploads only write to standard `arrowline/*` folders
  (plus `{slug}` sub-folders). `PUT /replace` requires an existing public_id
  starting with `arrowline/`.
- **Replacement:** CMS rows record a NEW upload's public_id, then destroy the
  old Cloudinary asset after the DB write succeeds.
- **Deletion:** deleting a CMS record collects every owned Cloudinary
  `public_id` (incl. child records), deletes the DB row (cascades), then
  destroys the assets sequentially.
- **Ordering & alt text:** image rows carry `display_order` + `alt_text`;
  public APIs order by `display_order`; frontend maps alt text to `<img alt>`.
- **Uploads rejected** (>10 MB, disallowed format, bad folder) return 400.

---

## 7. Lead Form Flow

```
Customer
    |  "Get a Free Quote" form -> client-side validation
    v
POST /api/lead  (rate-limit: 20 / 60 min per IP)
    v
Express validates fields (name, company, email, phone, service, message)
    v
Supabase: insert into `leads`  (reference_number e.g. ALQ-123456, status "new")
    v
Resend: 2 emails
    |-- Team notification -> NOTIFY_EMAILS (reply-to = customer)
    |-- Customer confirmation -> customer email (Ref + next steps)
```

- **Downtime fallback:** if the DB insert fails the request returns 4xx/5xx
  and the error is logged; the customer never sees internal error details.
  If email fails, the lead is still saved and `email_sent` stays false
  (logged). Rate limiting protects the endpoint.

---

## 8. Admin CMS

The admin panel is a React app at `#/arrowline-admin`, behind login
(`POST /api/admin/login` -> httpOnly `admin_token` cookie, 24 h, verified
against `admin_sessions` on every request).

| Module | Controls |
|--------|----------|
| Dashboard | Lead stats (total/new/today/follow-up/quotation/won/lost) |
| Enquiries | Lead pipeline - status, priority, assignment, notes, search/filter/pagination |
| Services | 4 main services + nested sub-services, SEO fields, text sections |
| Service Items | 22 sub-services |
| Trusted Network | Partner logos (SVG/PNG upload -> Cloudinary), reorder, publish |
| Website Content | `site_content` key/value global text editor |
| Media Library | Cloudinary asset list/browse, image-usage lookup |
| Case Studies, Industries, Clients, Leadership, Core Values | Their collections |
| Gallery | Gallery items |
| Locations, FAQs, Testimonials, Social Videos, Statistics, Site Settings, Blog | Respective collections |
| About Page | 4 image slots, page text (`site_content`), pillars, milestones, differentiators (`AdminAbout.jsx`) |

All generic collections support create/edit/delete, publish toggle, search,
status filter, and `display_order` reordering. Media streams through
Cloudinary for any image-bearing resource.

---

## 9. Public Website Routes

All public URLs use `https://www.arrowlinelogistics.in` + hash router.

### Core pages
| Route | Page |
|-------|------|
| `#/` | Home |
| `#/about` | About |
| `#/industries` | Industries |
| `#/gallery` | Gallery / Case Studies |
| `#/contact` | Contact |

### Main services (4)
- `#/services/road-transportation`
- `#/services/rail-transportation`
- `#/services/project-cargo-transportation`
- `#/services/warehousing-storage`

### Sub-services (22)
Road: `container-transportation`, `ftl-ltl-transportation`,
`odc-heavy-haulage`, `project-cargo-transportation`,
`trailer-multi-axle-transportation`, `machinery-industrial-cargo-transportation`

Rail: `rail-freight-transportation`, `container-rail-transportation`,
`full-train-load-ftl`, `multimodal-rail-transportation`,
`intermodal-rail-freight`, `bulk-industrial-cargo`

Project Cargo: `heavy-odc-cargo`, `breakbulk-cargo`, `industrial-machinery`,
`multi-axle-special-trailer`, `end-to-end-project-logistics`

Warehousing: `general-industrial-warehousing`, `distribution-fulfillment`,
`inventory-management`, `container-storage-handling`, `loading-unloading`

> Unknown service slugs render an inline "Service Not Found" state; unknown
> hashes fall back to Home.

---

## 10. Environment Variables

Name-only list. Values live in the deployed `server/.env` and the frontend
build, never in Git.

### Frontend (`VITE_*`, baked in at build time)
- `VITE_API_URL` - base URL for the API. Empty in production = same origin.
- `VITE_GA_ID` - Google Analytics measurement ID (optional).
- `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA v3 site key (optional).

The repo ships a committed `.env.production` that leaves these three empty
(no secrets) so every `vite build` produces a clean, same-origin bundle by
default even when the local dev `.env` sets `VITE_API_URL=http://localhost:5000`.
Local `vite dev` still reads `.env` and hits the localhost API.

### Backend (`server/.env`)
- `PORT` - server port (default 5000).
- `CORS_ORIGIN` - comma-separated allowed origins (`https://www.arrowlinelogistics.in`, `https://arrowlinelogistics.in`, localhost dev origins).
- `SUPABASE_URL` - Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server only).
- `RESEND_API_KEY` - Resend API key.
- `FROM_EMAIL` - sender address for outgoing email.
- `NOTIFY_EMAILS` - comma-separated team notification recipients.
- `ADMIN_API_KEY` - JWT signing secret (>= 32 chars) for the admin cookie.
- `ADMIN_EMAIL` - primary admin email (Supabase Auth user).
- `ADMIN_EMAILS` - comma-separated secondary admin emails.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials.
- `DATABASE_URL` / `SUPABASE_PROJECT_REF` / `SUPABASE_DB_PASSWORD` - optional, used only by offline diagnostic scripts.

> A legacy `JWT_SECRET` may exist in `.env` files; the admin API actually
> signs cookies with **`ADMIN_API_KEY`**.

---

## 11. Local Development

Prerequisites: Node.js 20+ (LTS recommended), npm.

```bash
# 1) Install dependencies (project root)
npm install
cd server && npm install && cd ..

# 2) Configure environment
cp .env.example .env                   # frontend: set VITE_API_URL=http://localhost:5000
cp server/.env.example server/.env     # backend: fill all required values

# 3) Build the frontend once so the backend can serve dist/ in production mode
npm run build

# 4) Run backend (port 5000)
cd server
npm run dev            # node --watch index.js

# 5) Run frontend dev server (port 5173)
cd .. && npm run dev   # in a second terminal

# 6) Health check
curl http://localhost:5000/health
```

---

## 12. Production Build

```bash
npm install
npm run build
```

- Produces `dist/index.html` (single-file app) and copies `public/` files
  into `dist/` (`robots.txt`, `sitemap.xml`, `site.txt`, `images/`, favicon).
- Verify `dist/robots.txt`, `dist/sitemap.xml`, `dist/site.txt` exist.
- The Express server auto-detects `dist/index.html` (`hasDist`) and serves
  it, including the static files, over `express.static(distDir)`.
- The build reads `.env.production` (empty `VITE_*` values), so the bundle
  contains no localhost API URL and talks to the same origin (`/api/*`).

---

## 13. Hostinger Deployment

Primary model: one Node.js application hosting both the API and the built
single-page frontend.

### 1. Node.js application setup
1. Create a Hostinger VPS (or Hostinger's Node.js hosting plan).
2. Install **Node.js 20.x LTS or newer** (the app uses ES modules, so Node
   18+ is required; 20 LTS is recommended).
3. Create a Node.js application in the Hostinger panel:
   - **Application root:** the folder containing `server/` and `dist/`
     (e.g. `/home/arrowline/app`).
   - **Startup file:** `index.js`.
   - **Startup command:** `node index.js` (same as `npm start`).
   - **Working directory for the app:** `<app>/server` so `.env`, `index.js`
     and `routes/` resolve correctly. If your host descriptor points the
     working dir elsewhere, adjust it so `dotenv/config` finds
     `server/.env`.
4. Set every environment variable from section 10 in the host panel.
5. Ensure `CORS_ORIGIN` includes
   `https://www.arrowlinelogistics.in,https://arrowlinelogistics.in`.

### 2. Deploy code
```bash
# from the repository root
rsync -av --exclude node_modules --exclude .git --exclude .env ./ user@HOST:/home/arrowline/app/
```
On the server:
```bash
cd /home/arrowline/app
npm install
cd server && npm install && cd ..
npm run build          # builds dist/ (or build locally and rsync dist/)
```

### 3. Domain and HTTPS
- Point `arrowlinelogistics.in` and `www.arrowlinelogistics.in` (A records)
  at the VPS public IP in DNS.
- Enable SSL (Let's Encrypt) via Hostinger for the domain.

### 4. API URL and CORS
- `VITE_API_URL` must be **empty** in production so the frontend calls the
  same origin (`/api/...`). This is already enforced by the committed
  `.env.production`. Rebuild after any change.
- `CORS_ORIGIN` must include the live domain; credentials are enabled.

### 5. Process management and logs
- Use Hostinger's process manager or `pm2`:
  ```bash
  pm2 start server/index.js --name arrowline-api
  pm2 save && pm2 startup
  pm2 restart arrowline-api   # after any backend change
  ```
- Logs: Hostinger panel logs or `pm2 logs arrowline-api`.

### 6. Health check
```bash
curl -k https://www.arrowlinelogistics.in/health
```

> **Vercel (optional):** the repo includes `vercel.json`
> (`buildCommand: npm run build`, `outputDirectory: dist`). Vercel would host
> the static frontend only; the Express API still needs a separate Node host.
> The Hostinger model above is the recommended full-stack deployment.

---

## 14. Google Search Console

1. **Add property** - in Search Console, add `https://www.arrowlinelogistics.in`
   (URL-prefix property) or the full-domain property.
2. **Verify ownership** - GSC provides a verification HTML file (e.g.
   `google1234abc.html`) or a DNS TXT record.
   - HTML method: place the file in `public/`, rebuild so it copies to
     `dist/`, then confirm it is reachable at
     `https://www.arrowlinelogistics.in/<filename>.html`. **No fake
     verification tokens are used.**
   - DNS method (recommended): add the TXT record at your DNS provider
     (fastest, survives rebuilds).
3. **Submit sitemap** - Sitemaps > submit `https://www.arrowlinelogistics.in/sitemap.xml`.
4. **Validate** - `robots.txt` fetchable, canonical URLs correct, favicon
   present in results.
5. **Inspect URLs** - use URL Inspection on the homepage and main services;
   request indexing.
6. **Monitor** - Index Coverage, Page Experience, Core Web Vitals.

> **Hash URLs:** the site uses `#/...` fragments, so Google fetches the root
> URL and renders the JS; the fragment pages are discoverable from the
> sitemap. If clean URLs are ever required, routing must be extended to
> pathname-based routes (out of scope for this package).

### SEO / GEO / AEO audit status (verified against the code)

| Page | Title + meta description | Canonical | H1 | OG + Twitter | Structured data |
|------|--------------------------|-----------|----|--------------|-----------------|
| Home | Yes (SEOMeta) | Yes (`window.location.href`) | Yes | Yes (SEOMeta) | Organization + LocalBusiness JSON-LD |
| About | Yes (SEOMeta) | Yes | Yes | Yes | Organization + LocalBusiness + leadership/core-values via CMS |
| Industries | Yes (SEOMeta) | Yes | Yes | Yes | Organization + LocalBusiness |
| Gallery | Yes (SEOMeta) | Yes | Yes | Yes | Organization + LocalBusiness |
| Contact | Yes (SEOMeta) | Yes | Yes | Yes | Organization + LocalBusiness |
| 4 Main services | Yes (`ServicePageTemplate` sets service `seoTitle`/`seoDesc`) | Yes (`ServiceSchema`) | Yes (hero headline) | Inherited | LogisticsService + Service + BreadcrumbList + FAQPage JSON-LD |
| 22 Sub-services | Yes (per-service SEO fields) | Yes | Yes | Inherited | Same JSON-LD set, sub-service variant |

- Unique titles/descriptions: every page has its own; services use
  per-service CMS SEO fields (keyword-stuffing avoided).
- H1/H2/H3: each page has a single logical H1 followed by structured H2/H3.
- Alt text: CMS image rows carry `alt_text`; components fall back to
  descriptive defaults (e.g. `getAltText`).
- GEO/AEO: Organization + LocalBusiness + LogisticsService + FAQPage schema,
  descriptive plain-language copy, and `site.txt` give search/AI/answer
  engines machine + human readable facts (name, HQ, phone, services, URLs).
- Base `<head>` of `dist/index.html` already ships `meta robots
  index,follow`, description, keywords, author, and Open Graph tags; SEOMeta
  refreshes them per route at runtime.

---

## 15. robots.txt / sitemap.xml / site.txt

| File | Production URL | Purpose |
|------|----------------|---------|
| `public/robots.txt` | `https://www.arrowlinelogistics.in/robots.txt` | Allows crawlers site-wide (`Allow: /`), blocks `/api/` and admin paths, points to the sitemap |
| `public/sitemap.xml` | `https://www.arrowlinelogistics.in/sitemap.xml` | 31 public URLs: home/about/industries/gallery/contact + 4 services + 22 sub-services. No admin/login/API URLs |
| `public/site.txt` | `https://www.arrowlinelogistics.in/site.txt` | Plain-text company profile for search/AI crawlers: description, services, coverage, HQ, contact, public URLs |

All three are plain static files in `public/`, copied verbatim into `dist/`
during `npm run build`, and served by `express.static(distDir)` before the
SPA catch-all. No secrets appear in them.

---

## 16. Security Checklist

- [ ] No production secrets in Git (`.env` files ignored).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` exists only in `server/.env`.
- [ ] `CLOUDINARY_API_SECRET` and `RESEND_API_KEY` exist only backend-side.
- [ ] Frontend build contains no service-role or API-secret values.
- [ ] Admin cookie `admin_token` is httpOnly, secure (production),
      sameSite=none, 24 h expiry, path=/.
- [ ] Every `/api/admin` route requires `requireAdmin` (JWT + `admin_sessions`).
- [ ] Admin email allowlist enforced (`ADMIN_EMAIL` / `ADMIN_EMAILS`).
- [ ] HTTPS enforced (Hostinger SSL) for all live traffic.
- [ ] CORS restrictively allowlisted (credentials enabled, no `*` in prod).
- [ ] Lead fields validated server-side; 50 kb JSON body cap; 400/413 handled.
- [ ] Upload restrictions: <= 10 MB, magic-byte sniffing, folder whitelist,
      `resource_type: image` always; SVG only for trusted-network logos.
- [ ] Rate limiting on `POST /api/lead` (20 / 60 min / IP).
- [ ] Cloudinary `destroy` on replace/delete of CMS images (best-effort).
- [ ] Error responses never leak stack traces, DB details, or secrets.
- [ ] `robots.txt` blocks `/api/` and admin paths; public routes unaffected.
- [ ] Sitemap contains no admin/login/dashboard/API URLs and no localhost.
- [ ] GSC verification uses DNS TXT or a real uploaded file (no fakes).

---

## 17. Backup & Recovery

- **Supabase:** enable automated daily backups (paid tier) or export
  regularly with `supabase db dump` (Supabase CLI); store offsite, outside
  the public deploy.
- **Cloudinary:** media is referenced by `public_id` in Supabase; Cloudinary
  keeps originals. Export an asset list periodically. If an image is
  missing, re-upload via the Admin Media Library.
- **GitHub source:** keep the repository as the canonical source backup.
- **Environment variables:** keep a secure vault record (password manager /
  Infisical) mapping every variable from section 10 - never a `.env`
  committed to Git.
- **Recovery test:** restore a Supabase dump into a point-in-time project
  and confirm public endpoints + admin login against it.

---

## 18. Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| Backend won't start | Missing `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in `server/.env` (app exits with error) |
| Port in use / EADDRINUSE | Another node instance holds the port; `pm2 delete` old app or kill the PID bound to 5000 and restart |
| CORS errors in browser | `CORS_ORIGIN` missing the live domain; add it and restart the backend |
| Supabase unavailable | Check Supabase status; verify service-role key; public endpoints return clean 500s without leaking internals |
| Cloudinary upload fails | Check `CLOUDINARY_*` keys; respect the 10 MB cap and allowed formats; folder must be in the whitelist |
| Resend failure | Check `RESEND_API_KEY`, verified domain for `FROM_EMAIL`, `NOTIFY_EMAILS`; failure is logged, lead still saved |
| Admin login fails | Email must be a Supabase Auth user AND on the `ADMIN_EMAIL(S)` allowlist; `ADMIN_API_KEY` must match across restarts |
| Images not loading | Confirm `image_url` is public; if `image_public_id` changed, the old asset was destroyed (re-upload) |
| Public API failing on one resource | Check table/column names and server logs; collection endpoints require `display_order` ordering columns |
| Sitemap not indexed | Verify `robots.txt` allows the path, XML is valid UTF-8, GSC property matches the domain |
| robots.txt not picked up | Hard refresh; confirm the file is in `dist/` after build; check CDN/proxy caching on Hostinger |

---

## 19. Final Production Checklist

**Frontend**
- [ ] `npm run build` succeeds; `dist/index.html` generated.
- [ ] `dist/robots.txt`, `dist/sitemap.xml`, `dist/site.txt` present.
- [ ] `VITE_API_URL` empty in the production build (same-origin).
- [ ] No `localhost` / `127.0.0.1` URLs inside the production bundle/static files.
- [ ] Title, meta description, canonical, Open Graph, favicon present.

**Backend**
- [ ] `node index.js` starts inside `server/`; `/health` returns OK.
- [ ] All public endpoints return data; all failures are logged.
- [ ] CORS includes the live domain; admin cookie flags correct.

**Supabase**
- [ ] All tables exist (section 5); RLS/security tested; backups enabled.
- [ ] Migrations applied; content seeded.

**Cloudinary**
- [ ] Upload/download/replace/delete tested via Admin; folders whitelisted.

**Resend**
- [ ] Team notification + customer confirmation send; domains verified.

**Admin / CMS**
- [ ] Login works; every module loads; publish toggles affect the public API.
- [ ] About page (images/text/pillars/milestones/differentiators) editable.
- [ ] Media Library lists Cloudinary assets; image-usage lookup works.

**Forms**
- [ ] Lead form inserts into `leads`, emails send, REF number returned.
- [ ] Rate limiting confirmed (429 after 20 POSTs/hr).

**Security**
- [ ] Checklist in section 16 all green.

**SEO / Google Search Console**
- [ ] `robots.txt`, `sitemap.xml`, `site.txt` live at their production URLs.
- [ ] Sitemap contains all 31 public URLs, no admin/API/localhost URLs.
- [ ] Property verified via DNS; sitemap submitted; URLs inspected/indexed.

**Hostinger / DNS / SSL / Monitoring**
- [ ] Node app running; startup command `node index.js` from `server/`.
- [ ] Domain A records point to the VPS; HTTPS forced.
- [ ] Health checks scheduled; logs rotated/available; backups scheduled.