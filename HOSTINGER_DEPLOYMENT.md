# Hostinger Deployment Guide

Deploy the **Arrowline Logistics** site to Hostinger. The Express server in
`server/` serves both the REST API **and** the built frontend (`dist/`), so a
single Node app is all you run on the host.

---

## What you get

| Piece        | Where it runs                              | Notes                                        |
| ------------ | ------------------------------------------ | -------------------------------------------- |
| Frontend     | Built once into `dist/` and served by Express | Single-file `index.html` (JS/CSS inlined)   |
| Public API   | Express (`server/index.js`)                | `/api/*`, `/health`                          |
| Admin API    | Express (`server/routes/admin.js`)         | `/api/admin/*`, JWT in httpOnly cookie       |
| Database     | Supabase Postgres (`project ref vsbircholpdlhyznlrgi`) | Back-end only (no anon key)        |
| Email        | Resend                                     | Team + customer notifications                 |
| Images       | Cloudinary                                 | Admin uploads stored remotely                |

## 1. Prerequisites

- Node.js 18+ (npm included) on the Hostinger server.
- A Supabase project with the migrations applied (see step 3).
- Resend account + API key, Cloudinary account (for admin image uploads).

## 2. Build the frontend (run locally, commit `dist/`)

```bash
npm install
npm run build        # produces dist/index.html + dist/images/*
```

Commit or upload `dist/` (it is served by Express). `VITE_API_URL` must be
**empty** in production so the browser calls same-origin `/api/...`:

```bash
# .env.example — production values
VITE_API_URL=
```

## 3. Prepare `server/.env`

Copy `server/.env.example` to `server/.env` and fill in:

```ini
PORT=5000

SUPABASE_URL=https://vsbircholpdlhyznlrgi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...

RESEND_API_KEY=re_...
NOTIFY_EMAILS=web.grow.india07@gmail.com
FROM_EMAIL=Arrowline Logistics <info@arrowlinelogistics.in>

JWT signing secret (ADMIN_API_KEY) = ...
ADMIN_EMAIL=web.grow.india07@gmail.com

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

CORS_ORIGIN=https://www.arrowlinelogistics.in,https://arrowlinelogistics.in
```

- Generate `ADMIN_API_KEY` (>32 chars) with e.g.
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
  This key signs the admin JWT cookie. It is **not** a login password.
- **Admin password lives in Supabase Auth, not in `server/.env`.** Create the
  admin in Supabase Dashboard → Authentication → Users (email
  `web.grow.india07@gmail.com`, set a password). The login endpoint verifies it
  via `supabase.auth.signInWithPassword`.
- **FROM_EMAIL:** the Resend default `onboarding@resend.dev` works for dev but
  recipients see the shared `@resend.dev` domain. Before going live, add your
  real domain in Resend (Settings → Sending domains) and set
  `FROM_EMAIL=Arrowline Logistics <info@arrowlinelogistics.in>`.
- Never commit `server/.env` to git.

## 4. Apply database migrations

Apply every `.sql` file under `supabase/migrations/` to the live project, in
filename order. Recent ones create the tables used by the public API and admin
CMS:

- `20260912_admin_sessions.sql` — revocable admin session registry.
- `20260913_clients.sql` — `clients` table (public `/api/clients`).
- `20260914_trusted_network.sql` — `trusted_network` table (public
  `/api/trusted-network`).

```bash
# From a dev machine with supabase CLI + DB access
supabase link --project-ref vsbircholpdlhyznlrgi
supabase db push
```

If you prefer, run each migration's SQL in Supabase Dashboard → SQL Editor.

## 5. Run the server (PM2)

On the host (assumes repo at `/var/www/arrowline`):

```bash
cd /var/www/arrowline/server
npm install --omit=dev
npm install pm2 -g        # or: npx pm2 ...

pm2 start index.js --name arrowline
pm2 save
pm2 startup               # follow the printed instructions
```

Verify:

```bash
curl http://127.0.0.1:5000/health        # {"ok":true,...}
curl http://127.0.0.1:5000/api/services  # published services
```

## 6. Reverse proxy with Nginx + HTTPS

Let Encrypt the domain, then proxy to the Node app:

```nginx
server {
  listen 80;
  server_name arrowlinelogistics.in www.arrowlinelogistics.in;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name arrowlinelogistics.in www.arrowlinelogistics.in;

  ssl_certificate     /etc/letsencrypt/live/arrowlinelogistics.in/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/arrowlinelogistics.in/privkey.pem;

  client_max_body_size 16m;               # admin image uploads (15 MB files)

  # Express must see the real client IP for rate-limiting + IP audit.
  set_real_ip_from 172.0.0.0/8;           # Hostinger proxy ranges
  real_ip_header X-Forwarded-For;

  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

`node index.js` already sets `app.set("trust proxy", 1)`, so rate limiting and
`x-forwarded-for` IP capture work behind the proxy.

## 7. Post-deploy checklist

- [ ] `/health` returns `ok`.
- [ ] `/` returns the built `index.html` and `/about` (SPA fallback) returns 200.
- [ ] `/images/...` assets load; page is ~1.9 MB HTML (556 KB gzipped),
      images compressed (india-map.svg ~1 MB, project images ~150 KB each).
- [ ] Contact form stores a lead and shows the reference number; team + customer
      emails arrive from your verified domain.
- [ ] Admin login at `https://www.arrowlinelogistics.in/#/arrowline-admin` works;
      unauthenticated `/api/admin/*` returns 401.
- [ ] Admin can upload images (Cloudinary) and manage the **Clients** and
      **Trusted Network** collections.
- [ ] `curl -I https://www.arrowlinelogistics.in/` shows `Content-Encoding: gzip`.

## Troubleshooting

| Symptom                      | Likely cause                                       | Fix                                          |
| ---------------------------- | -------------------------------------------------- | -------------------------------------------- |
| `/api/*` errors at runtime   | Supabase migrations not applied                    | Run step 4 (`supabase db push`)               |
| `/api/clients` 500           | `public.clients` table missing in live DB          | Apply `20260913_clients.sql`                  |
| `/api/trusted-network` 500   | `public.trusted_network` missing in live DB        | Apply `20260914_trusted_network.sql`          |
| Emails not delivered         | `FROM_EMAIL` unverified domain / Resend key        | Verify Resend domain; check Resend dashboard  |
| CORS errors on admin         | Storefront on a domain not in `CORS_ORIGIN`        | Add the exact origin, restart server          |
| Login "Invalid email or password" | Admin email not present in Supabase Auth (wrong project), wrong password, or `ADMIN_EMAIL` mismatch | Add/confirm the user in the Dashboard for the live project; verify `ADMIN_EMAIL` and `ADMIN_API_KEY` |
| 413 on image upload          | `client_max_body_size` too small                   | Raise Nginx `client_max_body_size` (step 6)   |