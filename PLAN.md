# Idearigs Studios — Build Plan

Source of truth: `design-handoff/` (Claude Design handoff, high-fidelity HTML prototypes + README).

## Stack
| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript (strict) | Recommended in handoff; SSR/ISR for SEO on the marketing pages |
| Styling | Tailwind CSS v4 with design tokens in `@theme` | Tokens (ink/paper/green, fonts, radii) map 1:1 to the handoff |
| Icons | `lucide-react` | Prototype icons are Lucide |
| Fonts | `next/font/google` — Archivo, IBM Plex Sans, IBM Plex Mono | Self-hosted, no layout shift |
| Database | SQLite via libSQL + Drizzle ORM | Zero-infra locally; same driver runs on Turso in production; swap to Postgres by changing the Drizzle dialect |
| Validation | Zod (shared by server actions + forms) | One schema per entity |
| Auth | Email + password (bcrypt) → signed JWT session cookie (`jose`), httpOnly, SameSite=Lax | Team-only admin, no third-party dependency |
| Media | Upload route → storage adapter (local `public/uploads` in dev) | Adapter interface so S3/R2 can be dropped in |
| Email | Optional Resend (via `RESEND_API_KEY`) for enquiry notifications | Enquiry is always stored in DB regardless |
| Tests | Vitest for the metrics maths and schemas | The public ROAS/CPC figures must be right |

## Routes
Public: `/` · `/portfolio` · `/work/[slug]` · `/contact` · `sitemap.xml` · `robots.txt`
Admin (auth-guarded): `/admin/login` · `/admin/projects` · `/admin/gallery` · `/admin/showreel` · `/admin/clients` · `/admin/meta-ads` · `/admin/enquiries` · `/admin/settings`
API: `POST /api/admin/upload`

## Data model (Drizzle)
`clients`, `projects` (incl. case-study fields), `ad_records`, `media_assets`, `reel_clips`, `settings` (key/value: hero loop, section toggles), `enquiries`, `users`.
Relations: projects / ad records / assets / clips → `client_id` (the client pickers in the drawers).

## Key behaviour
- Home Performance section is computed server-side from **published** ad records: spend-weighted ROAS/CPC/CVR/CPP, monthly mean chart (min 6% bar), spend-weighted objective split.
- Admin mutations are server actions → `revalidatePath` on affected public pages (no localStorage).
- Showreel: live clips in `position` order; play/pick/error states as in prototype, with a friendly production fallback.
- Contact: Zod validation, honeypot, per-IP rate limit, pending state, stored as enquiry, optional email.
- Responsive breakpoint ≤760px (custom Tailwind `md` = 761px). Full-screen glass menu (public), left drawer + card lists (admin), 44px tap targets.
- Accessibility: focus-visible rings, dialog semantics + Esc to close on drawers/menus, `prefers-reduced-motion` respected.

## Additions beyond the prototypes (needed for production)
- Login screen, Enquiries inbox, Settings page (section toggles + hero loop), confirm-before-delete.
- Project drawer gains a "Case study page" section (headline, intro, problem, approach steps, key metrics, quote, home-card stats) so `/work/[slug]` is fully CMS-driven.

## Open content questions for the client
- Partner studio name: confirmed as FRAME 025 (`site.partnerStudio` in `src/content/site.ts`).
- Reg/VAT numbers, team names, client names, metrics are sample data — confirm before launch.
- All imagery/video are placeholders until uploaded via the admin.
