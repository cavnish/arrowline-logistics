# Arrowline Logistics — Sanity Studio

Central CMS for **editorial/website content** (pages, services, testimonials, client
logos, FAQs, SEO, navigation, banners, articles, gallery, about, industries, locations,
case studies, videos, statistics).

> **This Studio is NOT the transactional database.** Customer enquiries, lead notes,
> admin sessions and any future shipment/account records stay in **Supabase Postgres**
> behind the private Express API (`../server`). Never put private operational records
> into Sanity.

See [`../docs/SANITY-ARCHITECTURE.md`](../docs/SANITY-ARCHITECTURE.md) for the full
architecture, data-store roles and migration plan.

## Content model

- **Singletons** (`schemas/singletons.ts`): `siteSettings`, `navigation`, `homePage`,
  `aboutPage`, `servicesPage`, `contactPage`.
- **Documents** (`schemas/documents.ts`): `service` (main + sub-services via `parent`),
  `industry`, `testimonial`, `clientLogo`, `faq`, `statistic`, `galleryImage`,
  `blogCategory`, `blogPost`, `caseStudy`, `socialVideo`, `location`, `banner`, `page`.
- **Reusable objects** (`schemas/objects.ts`): `mediaImage` (alt required), `link`,
  `cta`, `seo`, `navItem`, `processStep`, `showcaseItem`, `cargoApplication`, `pillar`,
  `milestone`, `differentiator`, `leader`, `coreValue`, `statItem`, `portableText`.

## Getting started

```bash
# 1. Create a Sanity project (once)
npx sanity@latest init --env

# 2. Configure the Studio (browser-safe values only)
cp .env.example .env
#   SANITY_STUDIO_PROJECT_ID=xxxxxxxx
#   SANITY_STUDIO_DATASET=production

# 3. Install and run
npm install
npm run dev        # http://localhost:3333/studio
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local Studio |
| `npm run build` | Build the Studio bundle |
| `npm run deploy` | Deploy Studio to `*.sanity.studio` |
| `npm run typecheck` | `tsc --noEmit` |

## Deploying

`npm run deploy` publishes the Studio to Sanity Hosting. Add the Studio URL to the
Sanity project's CORS origins (including the production website origin and
`http://localhost:5173` / `http://localhost:3000` for local development).

## Revalidation

Publishing fires a Sanity webhook → the public site's `/api/revalidate` route calls
`revalidateTag`/`revalidatePath` for the affected document types. See the architecture
doc for the endpoint contract.
