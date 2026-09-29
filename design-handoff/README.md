# Handoff: Idearigs Studios — Marketing Site + Content Admin

## Overview
Idearigs Studios is the production and digital management arm of Idearigs (Private) Limited, a legally registered company in Colombo, Sri Lanka. This package covers:

- **A public marketing site (4 pages):** Home, Portfolio Gallery, Project Details (case study template) and Contact.
- **A content admin panel (5 pages):** Projects, Meta Ads Data, Studio Gallery, Showreel Clips and Clients.
- **Responsive/mobile behaviour** for all 9 pages, with a review canvas (`Mobile Views.dc.html`).

What the site needs to communicate: the business is corporate, established and trustworthy. The core team has worked together since 2019, and it has a **contracted** partnership with an in-house production studio (Frame Nine Studios, run by the creative director's brother). Performance claims are backed by visible data.

## About the Design Files
The `.dc.html` files in `designs/` are **design references built in HTML**. They are working prototypes that show the intended look, copy and behaviour. They are **not production code to ship**.

Your task is to **recreate them in the target stack**. If no codebase exists yet, a good fit is:
- **Next.js (App Router) + React + Tailwind CSS** for the public site and admin.
- **lucide-react** for icons. All inline SVG icons in the prototypes are Lucide glyphs.
- A headless CMS or your own API with a database for the admin, e.g. Supabase/Postgres, with object storage for media.

Each file opens directly in a browser; `support.js` is the small runtime they need. Styles are inline, so you can read exact values straight from the markup. Page logic (state, handlers) lives in the `<script data-dc-script>` class at the bottom of each file.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy and interactions are final. Recreate them pixel-accurately.

Placeholder content still to swap:
- All imagery and video are **striped placeholder slots**, each labelled with the intended shot and aspect ratio.
- Company reg/VAT numbers, team names, client names and metrics are **realistic sample data**. Confirm them with the client before launch.

---

## Design Tokens

### Colour
| Token | Value | Use |
|---|---|---|
| `ink` | `#0A0B0A` | Dark section backgrounds, headings on light |
| `ink-deep` | `#080908` | Admin app background |
| `paper` | `#FAFAF8` | Light section background |
| `white` | `#FFFFFF` | Cards on light, light section alt |
| `line-light` | `#E3E4E0` / `#E9EAE6` / `#EBECE8` | Borders/dividers on light |
| `stripe-light` | `#F1F1EE` / `#E7E8E3` | Placeholder stripes on light |
| `text-2-light` | `#4C514C` | Body copy on light |
| `text-3-light` | `#5B5F5B` | Secondary copy on light |
| `text-4-light` | `#8A8F8A` | Mono captions on light |
| `green-500` | `oklch(0.72 0.18 148)` ≈ `#2FBF5B` | Primary buttons, bars, logo dot |
| `green-400` | `oklch(0.78 0.16 148)` ≈ `#4FCF73` | Accent text/icons on dark |
| `green-hover` | `oklch(0.82 0.19 148)` | Primary button hover |
| `green-700` | `oklch(0.48 0.13 150)` ≈ `#23753F` | Accent text/links on light |
| `on-green` | `#07210F` / `#06210E` | Text on green buttons/bands |
| White alphas on dark | `rgba(255,255,255,.04–.72)` | Text: .72 nav, .6 body, .55/.45 captions; borders .1–.2 |

Only black, white and green are allowed. No purple/blue gradients, particles or "AI" visuals.

### Typography
Google Fonts:
- **Archivo** 400/500/600/700 for headings, buttons and the logo.
- **IBM Plex Sans** 400/500 for body copy.
- **IBM Plex Mono** 400/500 for eyebrows, labels and data.

| Role | Font | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|---|
| H1 hero | Archivo | `clamp(38px,5.6vw,74px)` | 700 | -0.03em | 1.02 |
| H2 section | Archivo | `clamp(28px,3.4vw,46px)` (partnership `…50px`) | 700 | -0.025em | 1.08–1.1 |
| H3 card | Archivo | 17–32px | 600–700 | -0.02em | 1.15 |
| Big stat | Archivo | `clamp(30px,3vw,40px)` / `clamp(34px,3.6vw,46px)` | 700 | -0.02 / -0.03em | — |
| Body L | Plex Sans | 16.5–19px | 400 | — | 1.65–1.7 |
| Body | Plex Sans | 14–15.5px | 400 | — | 1.5–1.6 |
| Eyebrow | Plex Mono | 11.5px, UPPERCASE | 400 | 0.16em | — |
| Label/caption | Plex Mono | 9.5–11px, UPPERCASE | 400 | 0.08–0.14em | — |
| Button | Archivo | 14–16px | 600 | — | — |

Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

### Logo / wordmark
The wordmark is set in lowercase: **"idearigs"**, followed by a small uppercase suffix. The suffix is "STUDIOS" on the public site and "ADMIN" in the admin.

The dot of the **i** is a **green circle**. Build it as follows:
- Use a dotless `ı` (U+0131).
- Place an absolutely positioned circle over it: `width/height: 0.17em`, `top: 0.05em`, centred, `border-radius: 50%`, colour `green-500`.
- Wordmark style: Archivo 700, 21–23px, tracking -0.015em.
- Suffix style: 0.6em, weight 500, tracking 0.18em, `rgba(255,255,255,.62)`, 0.4em left margin.

### Spacing & layout
- Content max-width is **1240px**, centred.
- Side padding is `clamp(20px,5vw,72px)`.
- Section vertical padding is `clamp(56px,8vw,128px)`, usually `clamp(64px,8vw,120px)`.
- Common gaps: 10, 12, 14, 16, 20, 24, 28 px, plus `clamp(28px,4vw,64px)` between columns.
- Grids use `repeat(auto-fit, minmax(N,1fr))` so they reflow without breakpoints. Typical N values: stats 190–200px, cards 220–270px, 2-col splits 300–320px.

### Radius
- Default is **0**: square, corporate, used on buttons, inputs, public cards and tables.
- Glass panels: **14px** (small cards), **16–18px** (panels), **20px** (showreel player).
- Pills: **999px**. Phone frames in the review canvas: 48px.

### Glassmorphism
Only use glass on dark sections, and **always over a textured backdrop**, or the blur has nothing to show.

**Section backdrop layer** (absolutely positioned, `pointer-events:none`):
```
radial-gradient(620px 420px at 10% 16%, oklch(0.72 0.18 148 / .26), transparent 68%),
radial-gradient(720px 520px at 88% 82%, rgba(255,255,255,.10), transparent 70%),
repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 14px, transparent 14px 28px)
```
In the admin, use the same layer at a lower strength: green .16 and stripe .02.

**Glass panel:**
```
background: rgba(255,255,255,.08);
backdrop-filter: blur(24px) saturate(160%);
border: 1px solid rgba(255,255,255,.20);
box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 20px 44px rgba(0,0,0,.34);
```
Hover state: background `rgba(255,255,255,.13–.18)`.

### Shadows
Glass panels use the shadow above. Phone frames in the review canvas use `0 30px 60px rgba(0,0,0,.22)`. There are no other shadows.

### Image placeholders
Placeholders use a 135° repeating stripe with 8–10px bands.
- On light: `#F1F1EE` / `#E7E8E3`.
- On dark: `#1C1D1C` / `#151615`.

Each placeholder carries a mono caption with the intended content and aspect ratio. Replace every one with real media.

---

## Screens — Public Site

All public pages share one **sticky header**:
- Background `rgba(10,11,10,.94)`, `blur(10px)`, 1px bottom border at white .1, min-height 68px.
- Contents: the wordmark, text links (14px, white .72, hover white) and a green **"Book a call"** button (padding 10×18) linking to Contact.
- On the Contact page, the "Contact" nav item is shown as a mono outlined chip.

All public pages also share one **footer**:
- Black background.
- A 4-column auto-fit grid: brand blurb, contact (email / phone / address with green icons), service links and social icon buttons (40×40, 1px border, hover green).
- A bottom legal line with a green shield-check icon.

### 1. Home — `Agency Landing Page.dc.html`
Sections run top to bottom:

1. **Hero** (black)
   - Eyebrow: "COLOMBO, SRI LANKA — REG. NO. PV 00298471", preceded by a 22px green rule.
   - H1: "Digital management and full-scale production, under one contract."
   - Beside the H1: a lead paragraph and two CTAs. The primary green button is "Book a strategy call" with an arrow. The secondary is an outlined "See performance data" (hover border green).
   - **Hero video band:**
     - Size: `width:100%`, `aspect-ratio:21/9`, `min-height:280px`, radius 18.
     - Plays `media/hero-loop.mp4` autoplay/muted/loop/playsinline, with a left-to-right dark gradient overlay.
     - Bottom-left: a glass pill with a green dot and "IDEARIGS STUDIOS — SHOWREEL 2026".
     - Bottom-right: a glass pill "Watch the reel" linking to `#reel`.
     - Until the video fires `loadeddata`, show a striped placeholder instead.
   - **Trust bar:** a 4-up grid with a white .14 top border and hairline column separators. Stats (green, Archivo 700) with mono labels: 6 yrs / 41 / LKR 87M / 4.8x. This bar can be toggled off.
2. **Partnership** `#partnership` (paper)
   - Eyebrow, H2 and two paragraphs covering the founding team since 2019 and the **Frame Nine Studios** contracted agreement signed January 2026.
   - 4 team cards: square portrait placeholder, name, role, and a mono footer tag "FOUNDING TEAM — 2019" or "CONTRACTED PARTNER — 2026".
   - An agreement band: black, **4px green left border**. Left side has a shield icon, the eyebrow "SIGNED COLLABORATION AGREEMENT" and the title "Idearigs Studios × Frame Nine Studios". Right side has 4 green-check bullets.
3. **Case studies / social** `#work` (white)
   - 4 cards: 4:3 image, client name, platform tags, description.
   - Each card has an 8-bar mini chart: the first 5 bars are grey `#E1E3DE` and the last 3 step up through green tints to `green-500`.
   - Each card ends with 3 stats. Card hover darkens the border to `#0A0B0A`.
4. **Performance / Facebook ads** `#ads` (black + glass backdrop)
   - 4 glass stat cards: Blended ROAS, Avg. CPC, Conversion rate, Cost per purchase. Each has a trend row with a green trending icon.
   - **These values are computed from admin data** (see State).
   - Two glass panels. One is a monthly ROAS bar chart: 8 months, 200px tall, the last 4 bars in progressively brighter greens, labelled "TARGET 3.5x". The other shows spend allocation as 4 horizontal 8px bars.
   - An account breakdown table (Account / Spend / ROAS / CPC / Conv. rate) that scrolls horizontally below 640px. It can be toggled off.
5. **Showreel** `#reel` (black + glass backdrop)
   - A 16:9 player with radius 20.
   - Poster state: a glass circular play button (72–92px), the clip title and "{duration} · 6K · GRADED IN-HOUSE".
   - 4 glass clip cards below. Clicking one loads and plays that clip.
6. **Studio works** `#studio` (paper)
   - A "Request the full reel" underline link (2px green).
   - Row 1: three 3:4 image slots, plus a black **Studio spec** card: Floor 1,800 sq ft / Cyc wall / Capture 6K / Turnaround 72 hours.
   - Row 2: two 16:9 slots.
7. **Closing CTA band** (solid green-500)
   - H2 "Tell us what the next quarter has to deliver."
   - A black button and an outlined "Download rate card". This band can be toggled off.
8. **Footer** `#contact`.

### 2. Portfolio Gallery — `Portfolio Gallery.dc.html`
One page combining the client base, campaigns and studio gallery.
- Header nav: Clients, Campaigns, Studio gallery, Book a call.
- Hero: eyebrow "PORTFOLIO", H1 "Client base, campaign work and studio output in one place."
- `#clients`: "Brands on retainer with us today." — a logo grid.
- `#campaigns`: "Six campaigns, with the number that mattered to the client." — each card links to Project Details.
- `#gallery`: "Photography and film from our own floor."
- A closing CTA, "Want numbers like these on your own account?", and a slim legal footer.

### 3. Project Details — `Project Details.dc.html`
Case study template, shown with Ceylon Leaf Tea Co. as the example.
- H1: "Twelve months of always-on content for a heritage tea exporter."
- Sections: **The problem**, **What we did**, and a **Delivered assets** media grid.
- Build it as a dynamic route (`/work/[slug]`) fed by the Projects admin.

### 4. Contact — `Contact.dc.html`
- Eyebrow "GET IN TOUCH", H1 "Tell us what the work needs to achieve."
- Direct contact list: email `hello@idearigs.lk`, phone/WhatsApp `+94 11 234 5678` (Mon–Fri 9.00am–6.00pm IST), and the address.
- **"Send a brief"** form on a light background:
  - Inputs: 1px border `#D8DAD5`, background `#FAFAF8`, padding 13×14, 15px text, mono uppercase labels, focus border green.
- On submit, the form is replaced by an **"Enquiry received."** panel with a reset button.
- Validate required fields, send the brief to email or a CRM, and store it as an enquiry.

---

## Screens — Admin Panel
Shared shell across all 5 admin pages:
- **Sidebar**: 248px wide, background `#0A0B0A`, right border white .1.
  - Top: the wordmark with "ADMIN" suffix.
  - Nav groups with mono group labels (9.5px, .16em, white .35): **CONTENT** (Projects, Studio gallery, Showreel clips, Clients), **PERFORMANCE** (Meta ads data), **ACCOUNT** (View live site).
  - Active item: background white .08 with a 2px green left border. Hover: background white .05.
  - Bottom: a user chip with avatar, name and mono role.
- **Main area**: background `#080908` with the admin glass backdrop layer, padding `clamp(20px,3vw,36px)`.
- **Page header**: mono breadcrumb, H1 `clamp(24px,2.6vw,34px)`, a description (max-width about 54ch) and a green primary action button (padding 13×20, plus icon) at the top right.
- **Stat row**: glass cards, radius 14, padding 18, mono label, Archivo 28px value.
- **Toolbar**: a search field (1px white .16 border, background white .04, search icon) and mono filter chips (11px, .1em). The selected chip has background white .16.
- **Table**: glass container with a mono header row (10px, white .45), rows padded 16×20 with 1px white .07 dividers, and an outlined **Edit** button. Tables scroll horizontally (min-width 820–900px).
- **Edit drawer**: a fixed overlay (black .6 plus 4px blur) with a right-hand panel `min(520–580px,100%)`, background `#0B0C0B`, left border white .14.
  - Header: mono label (green) plus title, with a 38px close button.
  - Fields: mono label above each input. Inputs have 1px white .18 border, background white .04, padding 12×14, focus border green.
  - Segmented status toggle: the "live/published" option turns solid green with `#07210F` text when selected.
  - Footer: **Save** (green), **Cancel** (outlined) and **Delete** (outlined, right-aligned, shown only when editing an existing item).
- **Empty state**: centred mono text, e.g. "NO PROJECTS MATCH THIS FILTER".

### 5. Projects — `Admin Projects.dc.html`
- Stats: Total / Published / Drafts / Media pending.
- Filters: All / Published / Drafts. Search matches title and client.
- Table columns: Project (thumbnail + title + "UPDATED {date}"), Client, Services, Headline metric (green), Status, Actions.
- Drawer fields: Title, Client, Sector (FMCG, Property, Hospitality, Retail, Services), Services (multi-toggle: Social media, Meta ads, Photography, Video), Summary, 2 headline metrics (label + value), Media slots (Hero 16:9, Gallery, Reel clip MP4) and Status (Draft/Published).

### 6. Meta Ads Data — `Admin Meta Ads.dc.html`
This page feeds the home page Performance section.
- Stats are computed from **Published** records only:
  - **Blended ROAS**: spend-weighted, 2 decimals, "x".
  - **Avg CPC**: spend-weighted, LKR.
  - **Avg conv. rate**: spend-weighted, %.
  - **Total spend**: LKR.
- Table columns: Account, Period, Spend, ROAS, CPC, CVR, Status, Actions.
- A chart panel previews the front-end monthly ROAS chart. It shows the average of published records per month, Jan–Aug, with bar height = value / peak.
- Drawer fields:
  - Account, Reporting period.
  - Spend (LKR), ROAS, CPC (LKR), Conv. rate (%), Cost / purchase, Purchases.
  - **Monthly ROAS Jan–Aug** (8 inputs).
  - **Spend split by objective** (Conversions, Lead gen, Retargeting, Awareness). A running "SPLIT TOTAL: n%" turns green at exactly 100.
  - Visibility: Internal only / Published. Only published records are averaged into the public figures.

### 7. Studio Gallery — `Admin Gallery.dc.html`
- A dashed drop zone: "JPG, PNG, MP4 · UP TO 200MB EACH".
- Filters: All / Photo / Video frame / Unpublished.
- Asset cards: 4:3 thumbnail with a ratio badge top-left and a status badge top-right (green when published), caption, client · type, a Publish/Unpublish toggle and an edit icon.
- Drawer fields: Caption, Client, Type, Ratio (3:4, 4:5, 1:1, 16:9, 21:9), File path and Status.

### 8. Showreel Clips — `Admin Showreel.dc.html`
- **Hero loop** panel: file path plus replace zone. Guidance: 21:9, muted, under 12s, under 6MB.
- A reel clip list in public display order. Each row shows a 132px 16:9 thumbnail with duration, position number, title, a Live/Hidden badge and client · file.
- Row actions: move up, move down, Go live/Hide and Edit.
- Drawer fields: Title, Client, Duration, Category (Tabletop, Brand film, Property, Hospitality, Social cut), File and Status.

### 9. Clients — `Admin Clients.dc.html`
- Stats: Total / On retainer / Project based / Logos missing.
- Table columns: Client (logo thumbnail + name), Sector, Since, Engagement (retainer shown green), Logo (Uploaded/Missing), Actions.
- Drawer fields: logo drop ("SVG OR PNG, TRANSPARENT"), Name, Sector (9 options), Client since, Logo path and Engagement (Project based / Retainer).
- This list feeds the Portfolio logo grid and the client pickers elsewhere.

---

## Responsive / Mobile
Review all 9 pages at 390×844 in `Mobile Views.dc.html` (frames M1–M9). The breakpoint is **≤ 760px** (`matchMedia`). In your build, use Tailwind `md:` or an equivalent.

**Public pages**
- The header nav hides. A 44×44 menu button (white .08 background, 1px white .16 border) appears instead.
- The button opens a **full-screen glass sheet**:
  - Background `rgba(8,9,8,.78)`, `blur(24px) saturate(160%)`.
  - Logo plus close button at the top.
  - Seven 60px-tall link rows in Archivo 600 24px, each with a mono index number (01–07). The current page is shown in green.
  - At the bottom: a full-width 54px green "Book a strategy call" button, plus email and phone in mono.
  - Tapping a link closes the sheet.
- The hero video band keeps `width:100%` and a **min-height of 280px**.
- Every other grid reflows through `auto-fit/minmax`.

**Admin pages**
- The sidebar hides. A sticky glass top bar (logo plus menu button) replaces it.
- The menu opens a **left drawer** (`min(300px,86%)`) containing the same nav. Tapping the scrim closes it.
- Projects, Meta Ads and Clients tables become **tappable glass cards** (radius 14) that open the edit drawer:
  - Projects card: thumbnail, title, client, services, metric and status.
  - Meta Ads card: account, period and status, plus a 4-up mini grid of ROAS / CPC / CVR / Spend.
  - Clients card: logo thumbnail, name, sector · since, engagement and logo status.
- Drawers become full-width.
- Minimum tap target is 44px throughout.

---

## Interactions & Behaviour
- **Navigation**:
  - In-page anchors with `scroll-behavior: smooth`: `#partnership`, `#reel`, `#ads`, `#work`, `#studio`, `#contact`.
  - Cross-page links go to Portfolio, Project Details and Contact.
  - The admin has a "View live site" link.
- **Hero video**: autoplay, muted, looping and `playsInline`. Show the placeholder until `loadeddata`.
- **Showreel player**:
  - Clicking play or a clip card sets `src`, calls `load()` and then `play()`. The poster overlay hides on the `playing` event, and native controls show once playing.
  - On `error`, keep the poster visible and show the green mono message "CLIP NOT UPLOADED YET — DROP {src}". In production, show a friendly fallback instead.
- **Hover states**:
  - Buttons: green lightens to `green-hover`, outlined buttons get a green border, glass backgrounds brighten.
  - Links: white .72 → white on dark, `green-700` → `green-400` on light.
  - Cards: border darkens.
- **Contact form**: prevent default submit, mark the form as sent and show the confirmation panel. Add validation (name, email, message required; valid email format) and a submitting/loading state.
- **Admin CRUD**:
  - Add opens an empty drawer. Edit opens the drawer pre-filled.
  - Save inserts a new record at the top of the list, or replaces the edited record.
  - Delete removes the record. Add a confirm dialog in production.
  - Search and filters update the list live.
  - Showreel reorder swaps neighbouring items.
- **Section toggles** on Home: `showTrustBar`, `showAdsBreakdown`, `showClosingCta`. These can become CMS flags.

## State Management / Data
The prototypes keep state in memory. **Meta Ads** alone persists to `localStorage["idearigs.metaAds"]`, and the Home page reads that key and listens for `storage` events. That is a prototype shortcut. **Replace it with a real backend.**

Suggested data model:
```
Project   { id, slug, title, client_id, sector, services[], summary,
            metrics:[{label,value}] (2), hero_media_id, gallery_media_ids[],
            reel_clip_id, status: draft|published, updated_at }
AdRecord  { id, client_id, period_start, period_end, spend_lkr, roas, cpc_lkr,
            cvr_pct, cost_per_purchase_lkr, purchases,
            monthly_roas:[{month, value}], split:{conversions,leadgen,retargeting,awareness},
            visibility: internal|published }
MediaAsset{ id, url, kind: photo|video_frame, ratio, caption, client_id, status }
ReelClip  { id, title, client_id, duration, category, file_url, position, status: live|hidden }
Setting   { hero_loop_url, section toggles }
Client    { id, name, sector, since_year, engagement: retainer|project, logo_url }
Enquiry   { id, name, company, email, phone, service, budget, message, created_at }
```

Public-side computations (do them server-side or at build time):
- Blended ROAS/CPC/CVR/cost-per-purchase = `Σ(metric × spend) / Σ spend` across published AdRecords.
- Monthly chart value = mean of published `monthly_roas` for each month. Bar height = `value / max` (minimum 6%).

Also needed:
- Auth for the admin (team only). Roles are optional.
- Media upload to object storage, generating thumbnails and 16:9 / 3:4 crops.

## Assets
- **Fonts**: Archivo, IBM Plex Sans and IBM Plex Mono (Google Fonts).
- **Icons**: Lucide (arrow-right, shield-check, check, camera, trending-up/down, mail, phone, map-pin, instagram, facebook, linkedin, youtube, play, search, plus, x, pencil, chevron-up/down/right, upload, grid, users, external-link, menu).
- **Imagery/video**: none supplied yet. Expected files include `media/hero-loop.mp4`, `media/reel-*.mp4`, `media/gallery/*`, `media/logos/*` and the team portraits (4:5).
- The only drawn graphics are the logo dot, the stat bars and the charts, all built in CSS.

## Files (in `designs/`)
| File | Screen |
|---|---|
| `Agency Landing Page.dc.html` | Home |
| `Portfolio Gallery.dc.html` | Portfolio: clients, campaigns, gallery |
| `Project Details.dc.html` | Case study template |
| `Contact.dc.html` | Contact + brief form |
| `Admin Projects.dc.html` | Admin: projects |
| `Admin Meta Ads.dc.html` | Admin: Meta ads data (feeds Home) |
| `Admin Gallery.dc.html` | Admin: studio gallery |
| `Admin Showreel.dc.html` | Admin: hero loop + reel clips |
| `Admin Clients.dc.html` | Admin: client base |
| `Mobile Views.dc.html` | Review canvas, all pages at 390px |
| `support.js` | Runtime needed to open the prototypes locally |

Open any file in a browser to review it. Keep all files in the same folder so the links between pages work.
