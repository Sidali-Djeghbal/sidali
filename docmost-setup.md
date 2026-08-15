# Self-host Docmost for free — Render + Supabase + Upstash + Cloudflare R2

Docmost is AGPL-3.0 open source. This guide runs the official
`docmost/docmost` image on a **Render free web service** (no credit card),
with **Postgres on Supabase free**, **Redis on Upstash free**, and **file
storage on Cloudflare R2** (10 GB free, S3-compatible). Everything costs $0.

> Caveats of the free stack: Render free instances spin down after ~15 min
> of inactivity and wake on the next request (first load takes a few seconds).
> The realtime editor (WebSockets) reconnects automatically after wake-ups.

## Architecture

```
browser -> docmost.sidali-djeghbal.dev (Cloudflare DNS CNAME)
             -> Render free web service (docmost/docmost image)
                   |-> Supabase free Postgres (DATABASE_URL)
                   |-> Upstash free Redis     (REDIS_URL)
                   `-> Cloudflare R2 bucket   (AWS_S3_*)
```

## Step 1 — Cloudflare R2 (file storage)

1. Enable R2 once in the Cloudflare dashboard: **R2 Object Storage -> Enable R2**.
   (This is a one-time click; it is currently not enabled on the account.)
2. Create a bucket named **`docmost`** (R2 -> Create bucket).
3. Create an API token: R2 -> **Manage R2 API Tokens -> Create API token**,
   permission **Object Read & Write** (access to all buckets is fine).
4. Note down the two values: **Access Key ID** and **Secret Access Key**.

The endpoint is derived from the account id:
`https://0e8ab63bb93128b57f4f47ad32f95988.r2.cloudflarestorage.com`
(already hard-coded in `render.yaml`).

## Step 2 — Supabase free Postgres

1. Create an account at https://supabase.com (free, no card).
2. Create a **new project** (pick any region). Wait for it to provision.
3. Project Settings -> Database -> **Connection string** (URI). Copy the
   `postgresql://...` string — it is your `DATABASE_URL`.

> Docmost runs its own migrations on boot; no manual schema setup needed.

## Step 3 — Upstash free Redis

1. Create an account at https://upstash.com (free, no card).
2. Create a new **Redis database** (global region is fine).
3. Copy the `redis://...` connection string (the `REDIS_URL`).

## Step 4 — Deploy on Render

1. Create an account at https://render.com (free, no card).
2. Push this repo to GitHub (the `render.yaml` is already here).
3. In Render: **New -> Blueprint Instance**, select this repo.
   Render reads `render.yaml` and creates the `docmost` web service.
4. Before the first deploy, in the service's **Environment** tab set the
   secret values (marked `sync: false` in the blueprint):
   - `DATABASE_URL` — Supabase connection string
   - `REDIS_URL` — Upstash connection string
   - `AWS_S3_ACCESS_KEY_ID` — R2 access key id
   - `AWS_S3_SECRET_ACCESS_KEY` — R2 secret access key
   - `APP_SECRET` — Render auto-generates this (minimum 32 chars); replace
     with `openssl rand -hex 32` output if you prefer a fixed value.
5. Hit **Deploy**. The first boot runs migrations and can take a minute.

## Step 5 — Custom domain (docmost.sidali-djeghbal.dev)

1. In Render, open the docmost service -> **Settings -> Custom Domain**,
   add `docmost.sidali-djeghbal.dev`. Render gives you a target hostname
   (e.g. `docmost.onrender.com`) and auto-provisions a TLS cert (free).
2. In **Cloudflare DNS**, add a `CNAME` record:
   - Name: `docmost`
   - Target: `<service>.onrender.com`
   - Proxy status: **DNS only** (grey cloud) — Render must see the real IP
     for its TLS cert issuance.
3. Wait for the cert (minutes). `https://docmost.sidali-djeghbal.dev` now
   serves Docmost. Make sure `APP_URL` matches this domain.

## Step 6 — First login

1. Open the site. The first user to register becomes the workspace admin.
2. In **Workspace settings** you can disable public registration afterwards
   (invite users by email once you configure SMTP — see below).

## Optional extras

- **Email invites**: set `MAIL_DRIVER=smtp` plus `SMTP_HOST/PORT/USERNAME/
  PASSWORD/FROM` in Render env vars when you want to invite users by email.
- **Public attachments**: make the R2 `docmost` bucket public (R2 -> bucket
  -> Settings -> Public access -> enable), then set `AWS_S3_URL` to the
  generated public URL so uploaded files load via the CDN edge.
- **Keep awake**: any external uptime check (Cronitor/UptimeRobot free tier)
  hitting `/api/health` every few minutes prevents spin-down. Not required.

## Troubleshooting

- **Deploy keeps failing on a blank DB error**: double-check `DATABASE_URL`
  (Supabase pooler string) has no typos and your IP isn't blocked.
- **Uploads fail (403)**: verify `AWS_S3_*` values and that the R2 token has
  Object Read & Write.
- **Service unhealthy on free plan**: check logs under service -> Logs; the
  health endpoint is `/api/health`.
- **Realtime edits not appearing**: WebSockets need `APP_URL` to equal the
  real domain; confirm the CNAME is DNS-only, not proxied.
