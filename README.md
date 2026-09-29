# Idearigs Studios — marketing site + content admin

Built from the Claude Design handoff in `design-handoff/` (see `PLAN.md` for the build plan).

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Drizzle ORM + libSQL/SQLite · Zod · jose sessions · Vitest · Playwright.

## Quick start

```bash
npm install
cp .env.example .env.local      # then set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:setup                # migrate + seed the handoff's sample content (+ admin user)
npm run dev                     # http://localhost:3000  ·  admin at /admin
```

Create or reset an admin at any time: `npm run admin:create -- --email you@idearigs.lk --name "Name" --title "Role"`.

## Scripts

| Script | What it does |
|---|---|
| `dev` / `build` / `start` | Next.js |
| `typecheck` · `lint` | `tsc --noEmit` · ESLint |
| `test` | Vitest unit tests (performance maths, parsing) |
| `test:e2e` | Playwright against an isolated, freshly seeded `data/e2e.db` (uses local Chrome; on CI run `npx playwright install chromium`) |
| `db:generate` | Generate a migration after editing `src/lib/db/schema.ts` |
| `db:migrate` · `db:seed` · `db:setup` | Apply migrations · seed sample data (`-- --reset` to wipe content) · both |
| `db:studio` | Drizzle Studio |

## How it fits together

```
src/
  app/                    Public pages: / · /portfolio · /work/[slug] · /contact
    admin/login           Sign-in
    admin/(panel)/…       Projects · Gallery · Showreel · Clients · Meta ads · Enquiries · Settings
    media/[...path]       Serves uploads (Range requests for video, immutable caching)
    api/admin/upload      Streaming upload (auth, type sniffing, 200MB cap)
  components/             brand/ · site/ · home/ · admin/ · ui/
  content/site.ts         Static copy: company details, team, trust stats, taxonomies
  lib/                    db/ · auth/ · metrics.ts · queries.ts · settings.ts · storage.ts · email.ts
  proxy.ts                Optimistic admin gate (Next 16's replacement for middleware)
```

- **Rendering:** public pages are statically generated with ISR (5 min); every admin save calls `revalidatePath("/", "layout")` so changes appear immediately.
- **Performance section:** computed server-side from *published* ad records only — spend-weighted ROAS/CPC/CVR/cost-per-purchase, mean monthly ROAS (bar = value/peak, min 6%), spend-weighted objective split rounded to sum to 100. See `src/lib/metrics.ts` + tests.
- **Auth:** bcrypt passwords, HS256 JWT in an httpOnly SameSite=Lax cookie (7 days). `proxy.ts` redirects signed-out visitors; every page and server action re-checks the user against the DB. Login and the contact form are rate-limited per IP.
- **Data rules:** ad records can only be published with spend > 0 and a 100% split; projects need a summary and a headline metric to publish; clips need a file to go live; clients with ad records can't be deleted.
- **Security headers** in `next.config.ts`; uploaded SVGs are served with a sandboxing CSP.

## Deploying

Any Node host (`npm run build && npm start`) works. For production:

1. **Database** — use Turso: set `DATABASE_URL=libsql://…` and `DATABASE_AUTH_TOKEN`, then `npm run db:migrate`. (To move to Postgres, switch the Drizzle dialect in `schema.ts`/`db/index.ts`.)
2. **Media** — `UPLOAD_DIR` must be a persistent volume. On serverless hosts, swap `saveUpload`/`deleteUpload` in `src/lib/storage.ts` for S3/R2.
3. **Secrets** — `SESSION_SECRET` (≥32 chars) is required in production. Set `NEXT_PUBLIC_SITE_URL` for canonical URLs/sitemap.
4. **Email** — optional: `RESEND_API_KEY` + `ENQUIRY_NOTIFY_TO` emails each new enquiry (it's always stored in the admin inbox).
5. **Multiple instances** — replace the in-memory rate limiter in `src/lib/rate-limit.ts` with Redis/Upstash.

## Before launch — confirm with the client

- Partner studio name is **FRAME 025** (confirmed); it lives in `site.partnerStudio` in `src/content/site.ts`.
- Reg/VAT numbers, address, phone, team, trust-bar figures, client names and all metrics are **sample data**.
- Replace every striped placeholder with real media via the admin (hero loop, reel clips, gallery, project heroes, client logos). Team portraits and social URLs live in `src/content/site.ts`.
