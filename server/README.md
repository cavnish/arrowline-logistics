# Arrowline Logistics — Backend API

Express service for the Arrowline Logistics admin panel, lead capture, media
uploads and deploy publishing. The public marketing site is rendered as a
static build and does **not** call these content APIs at visitor request time.

## Runtime

- Node.js 20+ (ES modules)
- Supabase Postgres (service-role access, server only)
- Resend (lead notification email)
- Cloudinary (admin image/video uploads)

## Local development

```bash
cd server
npm install
cp .env.example .env   # fill in real values
npm run dev            # node --watch index.js
```

Deploy on Render with `render.yaml` (root directory `server`, health check
`/health`). The Vite frontend deploys separately on Vercel and reaches this API
through `VITE_API_URL`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Configuration/uptime check |
| POST | `/api/lead` | Validated inquiry, stored in Supabase, emailed via Resend |
| POST | `/api/admin/login` | Supabase Auth sign-in, sets httpOnly `admin_token` cookie |
| POST | `/api/admin/logout` | Revokes the server-side session |
| GET | `/api/admin/me` | Current admin identity |
| GET/POST/PUT/DELETE | `/api/admin/*` | Content CRUD, media library, settings |
| GET | `/api/admin/publish/status` | Whether publishing is configured and last trigger |
| POST | `/api/admin/publish` | Admin-only Vercel Deploy Hook trigger |

Public `/api/content`, `/api/services`, `/api/faqs`, `/api/about`, etc. remain
available as read-only endpoints, but the static frontend no longer depends on
them.

## Environment

Copy `.env.example` to `.env`. Key groups:

- **Supabase:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Admin auth:** `ADMIN_API_KEY` (JWT signing secret, 32+ chars),
  `ADMIN_EMAIL`, optional `ADMIN_EMAILS`
- **Email:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
  `LEAD_NOTIFICATION_EMAIL` (legacy `FROM_EMAIL` / `NOTIFY_EMAILS` supported)
- **Media:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`
- **CORS:** `CORS_ORIGIN` (comma-separated origins, no trailing slash)
- **Publishing:** `VERCEL_DEPLOY_HOOK_URL` (server only; never exposed to the
  browser), optional `PUBLIC_SITE_URL` (defaults to
  `https://arrowlinelogistics.in`, used to read the deployed
  `content-version.json`)

Optional diagnostic-only variables (`SUPABASE_PROJECT_REF`,
`SUPABASE_DB_PASSWORD`, `DATABASE_URL`) are used by scripts under
`server/scripts/`, not by the running API.

Never put backend secrets in root `.env` or any `VITE_*` variable — those are
bundled into the public site.

## Publishing flow

1. An authenticated admin edits content at `/arrowline-admin`.
2. The admin clicks **Publish**; the browser calls `POST /api/admin/publish`.
3. This server calls the Vercel Deploy Hook. The hook URL never leaves the
   server.
4. The Vercel build runs with `CONTENT_EXPORT_STRICT=1`, re-exports published
   Supabase rows, and fails without replacing the previous deployment if the
   export is unavailable or invalid.

## Notes

- Admin login uses Supabase Auth accounts; `ADMIN_EMAIL` must be a confirmed
  user. Sessions are recorded in `public.admin_sessions` and can be revoked.
- Lead submission is fail-safe: the browser shows an error when the backend is
  unreachable and never pretends the inquiry was stored.
- `GET /health` returns 503 until all required environment variables are set.
