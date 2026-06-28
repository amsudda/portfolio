# Deploying to Coolify (with Postgres)

This app is a TanStack Start (SSR) site. Projects are stored in **PostgreSQL**;
the `/admin` panel writes to it and the public pages read from it. Images are
stored inline in the project records, so no separate file storage is needed.

## What runs where

- **App**: built with the Nitro `node-server` preset → `node .output/server/index.mjs` (listens on `PORT`, default 3000). The `Dockerfile` handles this.
- **Database**: a Coolify PostgreSQL resource. On first boot the app creates the `projects` table and seeds it from `src/data/projects.ts`.
- **Local dev**: if `DATABASE_URL` is **not** set, the app uses a JSON file at `.data/projects.json` instead of Postgres — so `npm run dev` works with no database.

## Steps

### 1. Push the repo
Push to GitHub/GitLab so Coolify can pull it.

### 2. Create the Postgres database
Coolify → **+ New** → **Database** → **PostgreSQL** → create it.
Copy its **connection string** (the internal one, e.g. `postgres://postgres:...@<service>:5432/postgres`). The app and DB should be in the same Coolify project/network.

### 3. Create the application
Coolify → **+ New** → **Application** → pick your Git repo.
- **Build Pack**: **Dockerfile** (this repo includes one).
- **Port**: `3000`.

### 4. Environment variables
On the application, set:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | the Postgres connection string from step 2 |
| `ADMIN_PASSWORD` | the password you'll use at `/admin` |
| `AUTH_SECRET` | a long random string — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

(`NODE_ENV=production` and `PORT=3000` are already set by the Dockerfile.)

### 5. Domain / subdomain
Set your portfolio **subdomain** as the application's FQDN. Coolify provisions HTTPS via Let's Encrypt automatically.

### 6. Deploy
Hit **Deploy**. When it's up:
- Visit the site — the seeded demo projects render from Postgres.
- Visit **`/admin`**, log in with `ADMIN_PASSWORD`, and add/edit/delete projects. Changes persist in Postgres and show on the public site immediately.

## Notes

- **Images**: uploaded thumbnails/photos are stored inline (data URLs) in the DB. The admin caps uploads at ~1.5MB. For many large images, move to object storage later (S3/MinIO) — only `src/lib/store.server.ts` would change.
- **Backups**: back up the Postgres database (Coolify supports scheduled backups). That's all your content.
- **Changing seed data**: editing `src/data/projects.ts` only affects a *fresh* (empty) database. Once the DB has rows, manage content through `/admin`.
- **Resetting**: to re-seed, empty the `projects` table (`DELETE FROM projects;`) and restart the app.
