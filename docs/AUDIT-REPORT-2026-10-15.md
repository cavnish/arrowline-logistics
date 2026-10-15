# Arrowline Logistics — Codebase Audit & Implementation Plan

**Date:** 2026-10-15
**Scope:** Full repository (`arrowline-logistics-frontend-development`)
**Mode:** Read-only audit. No application code was modified. This document is the only new file.
**Repo remote:** `https://github.com/cavnish/arrowline-logistics.git` (branch `main`)

---

## 0. Executive Summary

The project is a **React 19 + Vite 7 + TypeScript + Tailwind 4** marketing/CMS website with an **Express 4 API** and a **Supabase Postgres** database, **Cloudinary** media, and **Resend** email. The architecture is sound and already feature-rich (full admin CMS, services tree, leads pipeline, about/testimonials/trusted-network CMS, SEO manager, structured data).

There is **no compelling reason to change stacks.** The priority is to stabilise, secure, and finish the in-progress work — not rewrite.

**The single most important finding:** the working tree **does not build**. `src/components/FAQSection.tsx` line 1 was accidentally corrupted (a stray `v ` before `import`). `vite build` and `tsc --noEmit` both fail. This is uncommitted work, so `main` in Git still builds — but the current on-disk state is broken.

The working tree also contains a large, **uncommitted and unfinished** feature: a Google Maps Transit Time Estimator (11 new files + edits across 11 tracked files). Along the way, `FAQSection.tsx` was also **regressed** (its CMS `/api/faqs` fetch was removed and replaced with static data).

Recommended path: **checkpoint the current work → fix the build blocker → commit the estimator feature deliberately → then execute the phased hardening plan** in §6.

---

## 1. Current Architecture (as built)

### 1.1 Frontend

| Aspect | Value |
|---|---|
| Framework | React `19.2.6` + `react-dom` `19.2.6` |
| Build | Vite `7.3.2`, `@vitejs/plugin-react` `5.1.1` |
| Language | TypeScript `5.9.3` (JSX files in `src/pages/Admin*.jsx` are plain JS) |
| Styling | Tailwind CSS `4.1.17` via `@tailwindcss/vite` |
| Routing | **No router library on the public site** — custom `pathname`/hash router in `src/App.tsx`. `react-router-dom` `7.18.2` is used only inside the lazy `AdminRouter`. |
| Animation | `framer-motion` `13.1.0`, `lenis` `1.3.26` smooth scroll |
| Icons/UI | `lucide-react`, `clsx`, `tailwind-merge`, `jspdf` (lead PDF) |
| HTTP | `axios` (public content fetches + admin API); `fetch` in `leadService.ts` |
| Package manager | **npm** (root `package-lock.json` present; no pnpm/yarn lockfiles) |
| Entry | `index.html` → `src/main.tsx` → `src/App.tsx` |
| Alias | `@` → `src` (`vite.config.ts`) |

Public routes: `/`, `/about`, `/industries`, `/gallery`, `/contact`, `/transit-time-estimator`, `/services/:slug`, `/services/:serviceSlug/:subSlug`, plus legacy `#/...` hashes; admin at `/arrowline-admin`. Unknown routes render a soft-404 (`NotFoundMeta`, `noindex`).

### 1.2 Backend

- **Express 4** server in `server/` (its own npm package), entry `server/index.js` (758 lines).
- Mounts `server/routes/admin.js` (2020+ lines, 42 endpoints) at `/api/admin`.
- Auth middleware `server/middleware/adminAuth.js`: httpOnly JWT cookie (`admin_token`) + revocable server-side session registry in `admin_sessions`.
- Services: `server/services/emailService.js` (Resend), `server/services/cloudinaryService.js` (uploads with magic-byte validation + folder allowlist).
- Middleware in use: `express.json({ limit: "50kb" })`, `cookie-parser`, `cors` (origin allowlist, credentials), `express-rate-limit` (leads only), `multer` (media).
- Security: `trust proxy` = 1; malformed-JSON and payload-too-large error handling; service-role Supabase client only (never exposed to browser).
- Also serves the built SPA from `dist/` when present (single-app/Hostinger model) with SPA fallback and immutable cache headers for `/assets`.

### 1.3 Database (Supabase Postgres)

- **19 migration files** in `supabase/migrations/`, applied in filename order.
- ~30 tables. Domains: **leads/lead_notes**, **admin_sessions**, **site_content/site_settings**, **services/service_items** + `service_faqs`, `service_process_steps`, `service_industries`, `service_item_industries`, `service_visual_showcase`, `service_cargo_applications`; **industries**, **clients**, **trusted_network**, **about_images/pillars/milestones/differentiators**, **leadership**, **core_values**, **testimonials**, **faqs**, **statistics**, **blog_categories/blog_posts**, **gallery_items**, **case_studies**, **social_videos**, **locations**.
- Consistent RLS pattern: public read of published rows; deny-all direct writes (service-role bypass); `leads`/`lead_notes`/`admin_sessions` have **RLS on and zero policies** (fully locked, service-role only).
- No enums, no triggers, no DB functions. `updated_at` is set by the Express layer. `uuid` PKs with `gen_random_uuid()`.
- Foreign keys: `service_items → services` (CASCADE), `lead_notes → leads` (CASCADE), `blog_posts → blog_categories` (SET NULL), showcase/cargo → services/service_items (CASCADE). "Exactly-one-owner" CHECKs on service showcase/cargo/faqs/process steps.
- Storage: bucket `website-media` exists in migrations; **write policies were intentionally dropped** in `20260912_services_schema_fix.sql` in favour of Cloudinary.

### 1.4 Integrations

| Service | Role | Where |
|---|---|---|
| **Supabase** | Postgres + Auth (admin sign-in) | backend only (service role) |
| **Cloudinary** | All media (folders `arrowline/*`) | `cloudinaryService.js`, admin uploads |
| **Resend** | Lead emails (business notification + customer confirmation) | `emailService.js` |
| **Google Maps** | Transit estimator directions/places (in-progress, uncommitted) | `VITE_GOOGLE_MAPS_API_KEY` |
| **Google Analytics** | **Documented but NOT implemented** — `VITE_GA_ID` is only `console.info`-logged; no gtag script anywhere |
| **reCAPTCHA** | **Documented but NOT implemented** — no code/env; anti-spam is a honeypot only |

### 1.5 Deployment

Three config surfaces, describing **two competing topologies**:

1. **Vercel** (`vercel.json`): static SPA build, rewrite `/(.*)` → `/index.html`.
2. **Render** (`render.yaml`): Node web service, `rootDir: server`, health check `/health`.
3. **Hostinger (single app)** documented in `HOSTINGER_DEPLOYMENT.md` / `docs/ARROWLINE-PRODUCTION-GUIDE.md`: Express serves both `dist/` and the API behind Nginx + PM2.

The frontend reaches the API via `src/lib/api.ts`: `VITE_API_URL` if set, else dev `http://localhost:5000`, else same-origin `/api`.

---

## 2. Git & Working-Tree State (⚠️ action required first)

`git status` shows **11 modified tracked files** and **11 untracked new files** (+ `playground-1.mongodb.js`, a dead MongoDB Compass stub at repo root), all uncommitted.

Modified: `.env.example`, `package.json`, `package-lock.json`, `public/sitemap.xml`, `src/App.tsx`, `src/components/ContactForm.tsx`, `src/components/FAQSection.tsx`, `src/components/Footer.tsx`, `src/index.css`, `src/pages/Home.tsx`, `tsconfig.json`.

New/untracked (the Transit Estimator feature): `src/components/estimator/{TransitTimeEstimator,LocationAutocomplete,RouteMap}.tsx`, `src/data/indianCities.ts`, `src/pages/TransitEstimatorPage.tsx`, `src/services/maps/{directions,loadGoogleMaps,types}.ts`, `src/services/routeEstimator.ts`, `src/utils/quoteBus.ts`, `package.json` adds `@types/google.maps`.

Branches present include several prior safety branches (`backup-before-*`, `cms-backup`, `before-restore`) and two tool-generated names (`abyssinian-scallop`, `skitter-brontomerus`).

**No secret files are tracked.** `.env`, `.env.production`, and `server/.env` are git-ignored (verified with `git check-ignore` / `git ls-files`). Only `.env.example` templates are committed. Note: live credentials currently sit in plaintext in `server/.env` on disk (service-role key, Resend key, Cloudinary secret, DB password, `ADMIN_API_KEY`).

---

## 3. Critical & High-Severity Findings

### 🔴 C1 — Build is broken (working tree)
`src/components/FAQSection.tsx:1` reads `v import { useState } from "react";`. Confirmed failing:
```
[vite:esbuild] Transform failed: FAQSection.tsx:1:2 ERROR: Expected ";" but found "import"
src/components/FAQSection.tsx(1,1): error TS1434: Unexpected keyword or identifier.
```
`FAQSection` is imported by `Home.tsx`, so the production build cannot be produced from the current tree. **Fix is a one-character deletion.**

### 🔴 C2 — Data-loss regression inside the same uncommitted change
`git diff` shows the FAQ component's CMS integration was **removed**: it no longer fetches `/api/faqs` and no longer falls back to `FAQ_ITEMS`; it now always renders static `FAQ_ITEMS`. This discards the designed CMS behaviour and should be reverted (the CMS fetch was working functionality that must be preserved).

### 🔴 C3 — Admin login has no rate limiting
`POST /api/admin/login` (`server/routes/admin.js:233`) is not behind any limiter; only `/api/lead` is rate-limited (`server/index.js:74`). Credential-stuffing/brute-force exposure.

### 🔴 C4 — `ADMIN_API_KEY` doubles as the admin password
`server/_restore_admin_password.mjs` sets the Supabase Auth password to the value of `ADMIN_API_KEY`, which is also the JWT signing secret (`adminAuth.js:6`). Rotating or leaking one compromises both. Splitting the JWT secret from any account password is required.

### 🟠 H1 — CORS/origin misconfiguration
`server/.env` lists a Vercel origin **with a trailing slash**, which never matches a browser `Origin` header. Also `sameSite:"none"` in production (`admin.js:314`) with cookie-auth mutations — review CSRF posture.

### 🟠 H2 — Mass assignment on services endpoints
`POST/PATCH /services` and `/service-items` (`admin.js:1014/1038/1163/1184`) pass the raw body straight to Supabase, unlike the allow-listed generic collections (`pickColumns`). Add column allowlists.

### 🟠 H3 — Media Library can't list videos
`cloudinaryService.list()` searches `resource_type:image` only (`cloudinaryService.js:168`), so videos uploaded via `POST /media` never appear. `DELETE /media` also only reads `public_id` while the frontend fallback sends `path`.

### 🟠 H4 — Deployment env mismatch (silent lead/submit failures)
Docs describe a Hostinger same-origin build; `vercel.json` + `render.yaml` are the actual committed config. `.env.production` (which sets `VITE_API_URL` to the Render URL) is **untracked**, so a clean Vercel build falls back to same-origin `/api` → rewritten to `index.html` → lead/content/admin calls fail. Set `VITE_API_URL` in Vercel project settings (or commit a non-secret production env mechanism).

### 🟠 H5 — Migrations are not cleanly re-runnable in order
`20260911_services_system.sql` both re-creates a policy name already created in `20260827_admin_services.sql` (duplicate `CREATE POLICY` → error) and inserts columns (`hero_video`, `capabilities`, …) before `20260912_services_schema_fix.sql` adds them. Showcase/cargo tables are created twice (`20260915` then `20260916`). New environments cannot be provisioned by a clean `supabase db push` without manual repair.

### 🟠 H6 — Dead/incorrect documentation & scripts
- `server/package.json` description still says **MongoDB**; `playground-1.mongodb.js` is a dead stub.
- `IMPLEMENTATION_COMPLETE.md` / `DEVELOPER_GUIDE.md` describe an older service architecture and missing files.
- Production guide claims `vite-plugin-singlefile` (not a dependency) and a committed `.env.production` (untracked).
- ~33 one-off scripts in `server/scripts/` (4 migration appliers, 2 CMS seeders, 4 image auditors, 2 admin-password fixers, many `_verify_*`/`_e2e_*`).
- `pg` is a runtime dependency but used only by offline scripts; `VITE_GA_ID`/`VITE_RECAPTCHA_SITE_KEY` are non-functional.

---

## 4. Medium / Low Findings

### Frontend
- **FAQSection**: see C1/C2.
- **Slug collision**: `project-cargo-transportation` exists both as a main service and as a road sub-service (`src/data/servicesData.ts`), making `services/project-cargo-transportation` ambiguous.
- **Misnamed default export** `CoreAdvantages` in `WhyChooseUsSection.tsx` (imported as `WhyChooseUsSection`).
- **Dead footer links**: `Sitemap`, `Privacy Policy`, `Customs Guidelines` are non-clickable `<span>`s styled as links (`Footer.tsx`); no legal routes exist. Footer service-hub links route home.
- **`alert()` in production UI** (`MasonryGallery.tsx`) for fake video playback and "Link copied".
- **Lenis ignores `prefers-reduced-motion`** — smooth scroll still runs for users who request reduced motion (framer-motion is handled).
- **Accessibility**: testimonials carousel prev/next lack `aria-label`s; breadcrumb "Home" is a `<span>` not a link; quote modal has no focus trap/`role="dialog"`.
- **SEO is client-side only** (SPA); no SSR/prerender, so non-JS crawlers may miss per-route meta. `robots` is `index, follow` by default for non-404 views. One JSON-LD `<script id="seo-structured-data">` may be overwritten between org-level and service-level schemas.
- Marketing copy references verticals with no route ("Shipping & Coastal Services", "Customs Clearance", "Express Air Cargo"); only 4 services exist.
- Numerous `console.*` calls across content components (noise, minor info exposure).
- **Transit Estimator (uncommitted) is only reachable via legacy hash** `#/transit-time-estimator`; it is now embedded on Home via `<TransitTimeEstimator variant="section" />` but the standalone page has no clean path/header nav entry.

### Backend
- `PATCH /enquiries/:id` accepts a `notes` field that has no column on `leads` → latent 500.
- Admin "Save" button sends `{}` → backend correctly returns 400 "No valid fields"; save is effectively broken/redundant (`AdminEnquiryDetail.jsx`).
- PostgREST `.or()` search strings interpolate raw user text (admin-only; can break queries).
- SVG logos are accepted for trusted-network (stored-XSS consideration if rendered inline).
- Some PATCH/generic handlers skip UUID validation; error status codes are inconsistent (400 vs 500) across similar failures.
- `GET /media/list` swallows Cloudinary errors as `{success:true,data:[]}`.
- Duplicated Cloudinary "collect old public_ids → destroy after delete" blocks across ~6 handlers.
- Public read endpoints use the service-role client and rely on manual `is_published` filters.

### Database
- Missing `(is_published, display_order)` indexes on `industries`, `clients`, `leadership`, `core_values`.
- Redundant indexes `services_slug_idx` / `service_items_slug_idx` (covered by unique constraints).
- `admin_sessions.user_id` has no FK/orphan protection.
- Junction-table RLS policies lack an explicit `to anon, authenticated` clause (minor inconsistency).

---

## 5. Preserve / Migrate Inventory (do NOT delete or replace with placeholders)

- All **live Supabase rows** for every migrated table (leads, CMS content, services tree, testimonials, about, trusted network, etc.). Any new schema must **migrate data**, not reseed placeholders.
- All **Cloudinary assets** under `arrowline/*` (referenced by `image_public_id`, `image_url`, and hardcoded URLs in `servicesData.ts`/`SEOMeta.tsx`).
- The committed service catalogue and SEO fields in `src/data/servicesData.ts` (1913 lines) — the source of truth for seeding services.
- Existing `admin_sessions` (or plan a clean re-login), Resend sender/domain config, and the `leads` pipeline.
- The current **admin CMS** (working) and its 42 endpoints — keep them working while hardening.
- Git history and the existing safety branches.
- The new Transit Estimator work (uncommitted) — stabilise and commit it, don't discard, unless the owner decides otherwise.

---

## 6. Implementation Plan (phased, checkpoint-first)

> Guiding rules: keep React/Vite/Express/Supabase/npm. Migrate data, never replace with placeholders. One concern per commit. Verify with `npm run build` + `tsc --noEmit` + a smoke test after each phase.

### Phase 0 — Safety checkpoint (do first, no behaviour change)
1. Create branch `audit/pre-migration-checkpoint` from `main`.
2. Snapshot the current working tree as a **WIP commit** (or `git stash push -u`) so no uncommitted work can be lost, including the untracked estimator files.
3. Remove/ignore the dead `playground-1.mongodb.js` and fix the `scratch/` vs `.scratch/` gitignore mismatch (decide: track or ignore).
4. Tag the checkpoint (e.g. `git tag checkpoint-pre-audit-20261015`).

### Phase 1 — Restore a green build (highest priority)
5. Fix `FAQSection.tsx:1` (remove the stray `v`).
6. Restore the CMS `/api/faqs` fetch + static fallback in `FAQSection.tsx` (revert C2 regression) — preserving `Reveal`/`SectionBackground` only if the design is intended; otherwise keep the simplified markup but keep the data fetch.
7. Run `npm run build` and `npx tsc --noEmit`; fix any remaining type errors introduced by the estimator work.
8. Commit as `fix: restore FAQ CMS fetch and unbreak build`.

### Phase 2 — Land the Transit Estimator feature deliberately
9. Review `src/components/estimator/*`, `src/services/maps/*`, `routeEstimator.ts`, `indianCities.ts`, `quoteBus.ts` for correctness, key handling (`VITE_GOOGLE_MAPS_API_KEY` must degrade gracefully when unset — verify the fallback), and reduced-motion.
10. Add `VITE_GOOGLE_MAPS_API_KEY` to `.env.example` (already staged) and document Google Cloud restrictions (Maps JS + Places + Directions; HTTP referrers).
11. Add a clean route + header/footer nav entry for the estimator (not only the legacy hash), and a sitemap entry.
12. Commit as `feat: transit time estimator` (split into logical commits if large).

### Phase 3 — Security hardening
13. Rate-limit `POST /api/admin/login` (separate stricter limiter, e.g. 10/15 min/IP + email).
14. Separate `ADMIN_JWT_SECRET` from the admin account password; rotate both; stop using `ADMIN_API_KEY` as a password; update `_restore_admin_password.mjs` accordingly.
15. Fix the trailing-slash CORS origin; review `sameSite`/CSRF (add an origin/CSRF check on cookie-authenticated mutations).
16. Add column allowlists to `/services` and `/service-items` POST/PATCH; add UUID validation to the PATCH/generic handlers; sanitise `.or()` search input.
17. Commit as focused security commits.

### Phase 4 — Reliability & correctness fixes
18. Media Library: list both images and videos (query `resource_type:image OR video`); accept `path` fallback in DELETE; don't swallow Cloudinary errors.
19. Reconcile `PATCH /enquiries` (`notes` field / Save button), unify error codes/response shapes.
20. Consolidate the duplicated Cloudinary cleanup helper.
21. Commit.

### Phase 5 — Database hygiene / migration repair
22. Make migrations idempotent/re-runnable: guard duplicate policy names (`drop policy if exists`) and duplicate table creations; confirm a clean push works on a **staging** Supabase project **before** touching production.
23. Add missing `(is_published, display_order)` indexes; drop redundant indexes; decide on `admin_sessions.user_id` FK.
24. **Data migration safety**: export a Supabase backup/`pg_dump` before any schema change; apply additively; backfill and verify row counts; never drop tables with live data.
25. Commit SQL under `supabase/migrations/` with a new timestamped file (do not edit applied history).

### Phase 6 — Frontend quality & SEO
26. Fix slug collision (`project-cargo-transportation`), misnamed export, dead footer links (add real `/privacy` route or make them non-links), replace `alert()` with UI, make Lenis respect reduced motion.
27. Accessibility pass: carousel `aria-label`s, breadcrumb links, modal focus trap/`role="dialog"`.
28. SEO: decide on prerender/SSG (e.g. prerender at build) or accept SPA limits; fix JSON-LD overwrite risk; add per-route `og:image` alt/dimensions.
29. Implement or remove `VITE_GA_ID` and reCAPTCHA references (currently non-functional).
30. Commit.

### Phase 7 — Deployment, docs & cleanup
31. Decide the canonical topology (recommend: keep Vercel + Render split, OR commit to Hostinger single-app). Align `vercel.json`/`render.yaml`/`.env.production`/docs accordingly; ensure `VITE_API_URL` is set at build time.
32. Rewrite `docs/ARROWLINE-PRODUCTION-GUIDE.md`, `DEVELOPER_GUIDE.md`, `IMPLEMENTATION_COMPLETE.md` to match reality; fix `server/package.json` description; move `pg` to devDependencies.
33. Archive one-off `server/scripts/_*` and duplicate seeders; keep a small documented tooling set.
34. Final full build + smoke test (lead submit, admin login, media upload, CMS edit) and update sitemap/robots if routes changed.

---

## 7. Immediate Next Actions (recommended order)

1. **Checkpoint** the working tree (Phase 0) — protect the estimator work and history.
2. **Fix `FAQSection.tsx`** and restore its CMS fetch (Phase 1) — get back to a green build.
3. **Decide** the deployment topology and whether to keep the transit estimator as a committed feature.
4. Proceed phase by phase, verifying after each.

---

## 8. Open Decisions for the Owner

1. **Deployment model:** Vercel + Render (split) or Hostinger single-app? This determines `VITE_API_URL` and cookie/CSRF settings.
2. **Transit Estimator:** keep as a first-class page with nav + sitemap entry, or keep only as a Home section?
3. **Legal pages:** do you want real `/privacy`, `/terms`, and customs pages (currently dead footer links)?
4. **Analytics/anti-spam:** implement GA4 and reCAPTCHA, or remove the dead references?
5. **Feature scope:** archive the ~33 one-off scripts now or keep them for reference?
6. **Password policy:** approve separating the JWT secret from the admin password (requires re-login).

---

*End of audit. No application files were changed; this report was the only file created.*
