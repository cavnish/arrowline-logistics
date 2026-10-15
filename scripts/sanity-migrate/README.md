# Supabase → Sanity content migration

One-way, idempotent migration of the **CMS/editorial** tables from Supabase into
Sanity documents. Transactional tables (`leads`, `lead_notes`, `admin_sessions`)
are **never** read or written.

See [`../../docs/SANITY-ARCHITECTURE.md`](../../docs/SANITY-ARCHITECTURE.md) §8 for the
mapping rationale.

## Setup

```bash
cp .env.example .env      # fill in Supabase + Sanity values
npm install
```

`SANITY_MIGRATION_TOKEN` must be an **Editor** token (uploads assets + writes docs).
Keep it server-side; it is never used by the website or Studio build.

## Run

```bash
# 1. Read-only export to ./dump (safe; inspect the data)
npm run export

# 2. Dry-run: transform and print what *would* be written (no images uploaded)
npm run dry-run

# 3. Apply: upload images + write documents to Sanity
npm run write
```

## How it works

| Step | File | Notes |
|---|---|---|
| Export | `lib/supabase.mjs` | `select *` on each CMS table → `dump/<table>.json` |
| Transform | `lib/transform.mjs` | Deterministic `_id`s (e.g. `service-road-transportation`) |
| Images | `lib/sanity.mjs` | Downloads Cloudinary URLs → Sanity assets, cached in `dump/.assets.json` |
| Write | `lib/sanity.mjs` | `createOrReplace` batches of 50 — re-runs update, never duplicate |

- **Idempotent:** re-running updates existing documents by `_id`.
- **Lossless:** unknown `site_content` / `site_settings` key-value rows are preserved
  on `siteSettings.siteContent` rather than discarded.
- **Resumable:** uploaded image assets are cached, so a re-run skips re-uploading.

## Safety

1. Run `npm run export` and review `dump/` before any write.
2. Point `SANITY_DATASET` at a **staging** dataset first; verify in the Studio.
3. Keep the Supabase CMS tables read-only until production is verified
   (see the architecture doc's rollout phases). They are the rollback.
