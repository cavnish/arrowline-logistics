# Arrowline Logistics — Sanity-First Architecture & Migration Plan

**Status:** Proposed (pending approval of the frontend rendering decision in §9)
**Date:** 2026-10-15
**Supersedes:** the "keep current CMS" assumptions in `docs/AUDIT-REPORT-2026-10-15.md` (that report remains valid for the audit findings).

---

## 1. Goal

Make **Sanity the central CMS** for all editorial/website content, render public pages with **SSG + ISR (or framework equivalent)**, refresh via **Sanity webhooks**, keep **Cloudinary** (media) and **Resend** (email) where they work, run **private/transactional operations behind server-side APIs**, deploy via **GitHub → CI/CD**, and — critically — **separate CMS content from transactional business data**.

**Hard rule:** Sanity is *not* a replacement for every database.
- **Sanity** = editorial/website content (pages, services, testimonials, clients, FAQs, SEO, nav, banners, articles, gallery, about, industries, locations, case studies, videos, stats).
- **Supabase Postgres** = transactional/private records: `leads`, `lead_notes`, `admin_sessions`, and any future shipment/tracking/user-account data. **Never expose these in public Sanity queries.**

---

## 2. Data Store Roles (single source of truth per concern)

| Concern | Store | Why | Notes |
|---|---|---|---|
| Website/editorial content | **Sanity Content Lake** | Structured, versioned, preview, CDN, Studio | Replaces the Supabase CMS tables |
| Media for CMS content | **Sanity Image/File pipeline** (recommended) *or* **Cloudinary** | Optimized delivery, transforms | See §6 for the recommendation |
| Transactional leads/enquiries | **Supabase Postgres** (`leads`, `lead_notes`) | Relational, private, joins, reporting | Written only by the server API |
| Admin sessions / auth | **Supabase** (`admin_sessions` + Supabase Auth) | Already working, revocable | Keep |
| Operational/shipment/user records (future) | **Supabase Postgres** | ACID, relational, private | Do not put in Sanity |
| Transactional email | **Resend** | Existing integration works | Business + customer confirmation |
| Analytics/anti-spam | TBD (GA4 / reCAPTCHA) | Currently non-functional | Decide in §9 |

**Anti-duplication principle:** a piece of content lives in exactly one store. No content is mirrored between Sanity and Postgres. The old Supabase CMS tables are frozen (read-only) during migration, then retired.

---

## 3. Target Architecture

```
                    ┌───────────────────────────┐
   Editors ───────► │  Sanity Studio            │  (content editing)
                    │  /studio (hosted)         │
                    └─────────────┬─────────────┘
                                  │ publish → webhook
                                  ▼
   ┌──────────────────────────────────────────────────────────┐
   │  Public Web App (Next.js App Router)                      │
   │  • SSG: generateStaticParams at build                     │
   │  • ISR: revalidate + revalidateTag                        │
   │  • /api/revalidate webhook endpoint (signature-verified)  │
   │  • reads Sanity via @sanity/client (server components)    │
   └───────────────┬──────────────────────────┬───────────────┘
                   │ public forms             │ content
                   ▼                          ▼
   ┌──────────────────────────┐   ┌───────────────────────────┐
   │ Private API (Express)    │   │ Sanity Content Lake        │
   │ /api/lead  /api/admin/*  │   │ + Sanity image CDN         │
   │ Supabase (service role)  │   │                            │
   │ + Resend email           │   │                            │
   └──────────────────────────┘   └───────────────────────────┘
```

- **Content admin** = Sanity Studio (replaces the custom content pages of the current admin panel).
- **Operational admin** = keep the Express `/api/admin/enquiries` pipeline + a lean enquiries dashboard (leads are *not* in Sanity).
- The current custom router/SPA is replaced for *public* pages; the lead/enquiry backend is retained.

---

## 4. Sanity Content Model (documents & objects)

### Singletons (one document)
- `siteSettings` — company name, logo, contact (phone/email/WhatsApp/address), socials, default SEO, analytics IDs, global banner reference.
- `navigation` — header nav tree (services mega-menu), footer columns, legal links.
- `homePage` — hero (video/image/headline/CTAs), sections (services, why-choose-us, process, industries preview, testimonials, FAQs, about, CTA), stats, trusted-network heading.
- `aboutPage` — hero, images, intro, pillars, milestones, differentiators, leadership heading, core values, CTA.
- `servicesPage` — listing intro/SEO.
- `contactPage` — intro, form copy, map, office locations reference.

### Collections (many documents)
- `service` — main services **and** sub-services (optional `parent` reference + `order`); fields mirror `src/data/servicesData.ts` + Supabase `services`/`service_items` (title, slug, descriptions, hero media, capabilities, benefits, about, process steps, applications, industries refs, showcase, cargo applications, FAQs, SEO, CTAs, publish).
- `industry` — title, slug, description, icon, cargo types, image, order.
- `testimonial` — customer, company, position, quote, photo, rating, verified, order.
- `clientLogo` — name, logo, category, website, featured, order (covers `clients` + `trusted_network`).
- `faq` — question, answer, category, order (global), plus embedded FAQ objects on services.
- `statistic` — value, label, description, icon, order.
- `galleryImage` — title, description, category, image, alt, order.
- `blogCategory` / `blogPost` — title, slug, category ref, author, cover image, excerpt, portable text body, SEO, publishedAt, order.
- `caseStudy` — client, title, industry, location, description, challenge, solution, results, cover image, gallery, SEO.
- `socialVideo` — title, video URL/embed, thumbnail, platform, description, order.
- `location` — name, slug, state, city, address, description, image, map URL, SEO.
- `banner` — announcement bar / promo (text, link, active window, order).
- `page` — generic CMS page (privacy, terms, customs guidelines) with portable text + SEO (fills the currently-dead footer legal links).

### Reusable objects
`seo` (title, description, keywords, canonical, ogImage), `link`/`cta`, `mediaImage` (with required `alt`), `heroMedia` (image/video), `processStep`, `showcaseItem`, `cargoApplication`, `pillar`, `milestone`, `differentiator`, `leader`, `coreValue`, `navItem`.

> Portable Text is used for long-form bodies (blog, pages) so editors get real rich text.

---

## 5. Rendering Strategy (SSG + ISR)

**Recommended framework: Next.js (App Router)** — the canonical Sanity pairing and the only mainstream React option that natively satisfies the requested SSG **and** ISR.

- **SSG:** homepage, about, services list, contact use static generation; `service/[slug]` and `service/[parent]/[sub]` use `generateStaticParams` to pre-render every service at build.
- **ISR:** pages export `revalidate = 60` (time-based safety net) and, more importantly, are tagged with `revalidateTag('service')`, `revalidateTag('homePage')`, etc.
- **On-demand revalidation:** a Sanity webhook (`on publish/delete`) calls `POST /api/revalidate` with a secret/signature; the handler calls `revalidateTag`/`revalidatePath` for the affected document types. This is the "event-driven refresh" requirement.
- **Draft preview:** Sanity Presentation/Preview with `next-sanity` draft mode (optional, phase 2).
- **SEO preserved:** `generateMetadata` per route emits the same titles/descriptions/canonical/OG that `src/components/SEOMeta.tsx` produces today, plus JSON-LD (`Organization`, `LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`). `sitemap.ts` and `robots.ts` are generated from Sanity so URLs stay in sync with content.

**Vite alternative (only if Next.js is rejected):** keep Vite + `vite-react-ssg` for build-time static rendering, and implement "ISR-equivalent" by having the Sanity webhook trigger a **rebuild + redeploy** (Vercel Deploy Hook). This is materially weaker (per-publish full rebuild, no tag-based partial revalidation) and is why Next.js is recommended.

---

## 6. Media

- **Recommended:** use **Sanity's image pipeline** for all CMS images. It gives automatic responsive `srcset`, AVIF/WebP, hotspot/crop, and keeps the `alt` with the asset — simpler and avoids a second system.
- **Cloudinary retention:** the existing Cloudinary assets and the `image_public_id`/folder conventions are preserved during migration. Two options:
  1. **Migrate** Cloudinary assets into Sanity assets (recommended for clean single-system delivery), or
  2. **Keep Cloudinary** as the media source by storing Cloudinary URLs in Sanity fields (fastest migration, keeps existing transforms/URLs).
- Media uploads in the Studio can also be wired to Cloudinary via a custom asset source if the team prefers to keep Cloudinary as the uploader.
- Decision required (§9). Default plan: **migrate to Sanity assets**, keep Cloudinary originals as the migration source.

---

## 7. Transactional / Private Operations (retained)

Keep the existing Express API (`server/`) as the **private backend** — no rewrite required:
- `POST /api/lead` → Supabase `leads` + Resend notifications (working; preserve).
- `/api/admin/*` → enquiries/notes/sessions (working; harden per the audit: login rate-limit, split `ADMIN_API_KEY`, allowlists).
- The public content endpoints in `server/index.js` (`/api/content`, `/api/services`, `/api/about`, …) are **retired** once the web app reads Sanity directly — this removes duplication rather than maintaining two content paths.
- Future shipment tracking / accounts live here + Supabase, never in Sanity.

The lead form on the next-gen site POSTs to the existing Express API (or, optionally, a Next route handler that forwards). Keeping Express avoids re-implementing working email/DB logic.

---

## 8. Content Migration (preserve data, no placeholders)

Map each Supabase CMS table → Sanity document/field. Illustrative mapping:

| Supabase | Sanity |
|---|---|
| `site_content`, `site_settings` | `siteSettings` / page singletons (structured) |
| `services`, `service_items` | `service` docs (`parent` ref for sub-services) |
| `service_faqs`, `service_process_steps`, `service_visual_showcase`, `service_cargo_applications` | arrays on the parent `service` |
| `service_industries` / `service_item_industries` | `industries[]` refs on `service` |
| `industries` | `industry` |
| `clients`, `trusted_network` | `clientLogo` |
| `testimonials` | `testimonial` |
| `faqs` | `faq` |
| `statistics` | `statistic` |
| `gallery_items` | `galleryImage` |
| `blog_categories`, `blog_posts` | `blogCategory`, `blogPost` |
| `case_studies` | `caseStudy` |
| `social_videos` | `socialVideo` |
| `locations` | `location` |
| `about_images/pillars/milestones/differentiators`, `leadership`, `core_values` | `aboutPage` (+ `leader` if separate) |
| `leads`, `lead_notes`, `admin_sessions` | **stay in Supabase** |

**Process:**
1. Add a Sanity project + dataset (staging first).
2. Run a **dry-run** exporter (Supabase service role → Sanity Mutations API) that logs what it *would* create.
3. Run for real into a staging dataset; verify counts and spot-check rendered pages.
4. Freeze Supabase CMS tables read-only; cut the frontend over; keep Supabase as the rollback for content until verified.
5. Retire the CMS tables only after a successful production bake-in.

Scripts live in `scripts/sanity-migrate/` (to be added) and are idempotent (use deterministic `_id`s like `service-road-transportation`).

---

## 9. Decisions Required From You

1. **Frontend framework (gates everything):**
   - **(A) Migrate public site to Next.js App Router** — true SSG + ISR + tag revalidation. *Recommended.*
   - **(B) Keep Vite** + `vite-react-ssg` + webhook-triggered full rebuild. Less capable, less rewrite.
2. **Media:** (A) migrate Cloudinary assets into Sanity assets *[recommended]*, or (B) keep Cloudinary and store URLs in Sanity.
3. **Private API:** keep the existing Express service *[recommended]*, or fold it into Next route handlers.
4. **Sanity credentials:** project ID, dataset name(s), and an Editor/Deploy token (staging vs production).
5. **Admin panel:** retire the custom content CMS pages once Sanity Studio is live; keep only the enquiries dashboard.

---

## 10. Phased Rollout

| Phase | Deliverable | Breaks existing app? |
|---|---|---|
| 0 | Checkpoint branch + tag (done) | no |
| 1 | Restore green build (done) | no |
| 2 | Create Sanity project; add **`studio/`** with the content model (§4); host Studio | no (additive) |
| 3 | Migration scripts + staging import; verify content migration | no |
| 4 | Next.js public app: routes, SSG/ISR, `@sanity/client`, SEO parity, webhook `/api/revalidate` | new app alongside |
| 5 | Point lead form + admin enquiries at existing Express API; env plumbing | config only |
| 6 | Cutover: DNS, sitemap/robots from Sanity, preview/draft mode | switch |
| 7 | Retire Supabase CMS tables + old content admin; update docs/tests | after bake-in |

Each phase is a separate branch/PR, verified with build + a smoke test before merge.

---

## 11. Repository Layout (target)

```
/
├─ studio/                 # Sanity Studio (content model, config)  ← added now
├─ apps/web/               # Next.js public site (phase 4)          ← added later
├─ server/                 # Express private API + Supabase (retained)
├─ scripts/sanity-migrate/ # content migration (phase 3)
├─ supabase/migrations/    # frozen CMS tables + transactional schema
└─ docs/                   # this document + audit
```

*(If a monorepo workspace is undesirable, `studio/` can remain standalone npm package and the Next app can live at the repo root later. The root Vite app is kept until cutover.)*
