/**
 * Seeds the sample content from the design handoff so every page renders.
 *   npm run db:seed            — only seeds an empty database
 *   npm run db:seed -- --reset — wipes content tables first (keeps users)
 * All names, figures and company details are SAMPLE DATA — replace before launch.
 */
import bcrypt from "bcryptjs";
import { client, db, schema } from "./db.mts";

const reset = process.argv.includes("--reset");

const existing = await db.select({ id: schema.clients.id }).from(schema.clients).limit(1);
if (existing.length && !reset) {
  console.log("Database already has content — skipping. Use `npm run db:seed -- --reset` to start over.");
  client.close();
  process.exit(0);
}

if (reset) {
  for (const t of [schema.enquiries, schema.reelClips, schema.mediaAssets, schema.adRecords, schema.projects, schema.clients, schema.settings]) {
    await db.delete(t);
  }
  console.log("• Cleared content tables");
}

// ---------------------------------------------------------------- clients
const clientRows = [
  { name: "Ceylon Leaf Tea Co.", shortName: "Ceylon Leaf", sector: "FMCG", sinceYear: 2025, engagement: "retainer" },
  { name: "Marino Beach Residences", shortName: "Marino Beach", sector: "Property", sinceYear: 2024, engagement: "retainer" },
  { name: "Sahana Ayurveda Spa", shortName: "Sahana", sector: "Hospitality", sinceYear: 2023, engagement: "retainer" },
  { name: "Nuwara Outdoor Gear", shortName: "Nuwara", sector: "Retail", sinceYear: 2022, engagement: "retainer" },
  { name: "Galle Fort Table", shortName: "Galle Fort Table", sector: "F&B", sinceYear: 2024, engagement: "project" },
  { name: "Lanka Auto Care", shortName: null, sector: "Services", sinceYear: 2023, engagement: "retainer" },
  { name: "Kandy Silk House", shortName: null, sector: "Retail", sinceYear: 2025, engagement: "project" },
  { name: "Serene Dental Colombo", shortName: null, sector: "Healthcare", sinceYear: 2024, engagement: "retainer" },
  { name: "Hikka Surf Collective", shortName: "Hikka Surf", sector: "Tourism", sinceYear: 2025, engagement: "project" },
  { name: "Metro Homeware", shortName: "Metro Homeware", sector: "E-commerce", sinceYear: 2022, engagement: "retainer" },
  { name: "Negombo Fresh Catch", shortName: null, sector: "FMCG", sinceYear: 2026, engagement: "project" },
  { name: "Aster Learning Institute", shortName: null, sector: "Education", sinceYear: 2023, engagement: "retainer" },
] as const;

const clients = await db
  .insert(schema.clients)
  .values(clientRows.map((c, i) => ({ ...c, sortOrder: i })))
  .returning();
const cid = (name: string) => clients.find((c) => c.name === name)!.id;
console.log(`• ${clients.length} clients`);

// ---------------------------------------------------------------- projects
await db.insert(schema.projects).values([
  {
    slug: "ceylon-leaf-retail-launch",
    title: "Retail Launch",
    clientId: cid("Ceylon Leaf Tea Co."),
    sector: "FMCG",
    services: ["Social media", "Meta ads", "Photography"],
    summary:
      "Weekly content calendar, UGC sourcing and community management for a heritage tea exporter entering the local retail market.",
    metrics: [
      { label: "ROAS over 12 months", value: "6.1x" },
      { label: "Engagement", value: "+312%" },
    ],
    status: "published",
    featured: true,
    platforms: "IG · FB · TikTok",
    tags: "Social · Meta ads · Studio",
    cardStats: [
      { label: "Engagement", value: "+312%" },
      { label: "Followers", value: "48.2K" },
      { label: "Posts / qtr", value: "96" },
    ],
    trend: [22, 30, 27, 41, 48, 58, 72, 100],
    headline: "Twelve months of always-on content for a heritage tea exporter.",
    intro:
      "Ceylon Leaf Tea Co. had thirty years of export credibility and almost no presence in the local retail market. We took over content, media buying and production for a full twelve-month cycle.",
    sectorDetail: "FMCG · Export & retail",
    engagementPeriod: "Sep 2025 — Aug 2026",
    scope: "Social, Meta ads, studio",
    keyMetrics: [
      { label: "Engagement rate", value: "+312%" },
      { label: "ROAS, paid social", value: "6.1x" },
      { label: "Followers added", value: "48.2K" },
      { label: "Average CPC", value: "LKR 9.80" },
    ],
    problem:
      "Retail buyers in Colombo knew the name but not the product range. Organic posting was inconsistent, the page had no content system, and paid campaigns were boosting posts rather than selling packs. Product photography was five years old and inconsistent between SKUs.\n\nThe brief was straightforward: build a repeatable content engine and make the ad account pay for itself within two quarters.",
    approach: [
      { title: "Content system", body: "Four recurring formats — brew guides, estate stories, retail stockist features and UGC reposts — planned a month ahead." },
      { title: "Full SKU reshoot", body: "FRAME 025 shot the entire loose-leaf range over two studio days, plus a pour sequence for motion assets." },
      { title: "Account restructure", body: "Catalogue sales campaigns with broad targeting, a retargeting tier at 18% of budget, and creative rotated fortnightly." },
      { title: "Reporting cadence", body: "Fortnightly performance review against sell-through data supplied by the client's distributor." },
    ],
    gallery: [
      { url: null, label: "Product still", caption: "Loose leaf range, white cyc" },
      { url: null, label: "Lifestyle", caption: "Brew ritual, morning light" },
      { url: null, label: "Social frame", caption: "Stockist feature template" },
      { url: null, label: "Motion still", caption: "Pour sequence, 6K" },
    ],
    quote:
      "We had worked with two agencies before. This is the first time the reporting matched what our distributor was seeing on the ground.",
    quoteAttribution: "Marketing Director — Ceylon Leaf Tea Co.",
    sortOrder: 0,
  },
  {
    slug: "marino-beach-pre-launch",
    title: "Pre-launch",
    clientId: cid("Marino Beach Residences"),
    sector: "Property",
    services: ["Meta ads", "Video"],
    summary:
      "Pre-launch pipeline for a Colombo 03 development: walkthrough reels, agent-led Q&A and inbox qualification in Sinhala and English.",
    metrics: [
      { label: "Qualified leads", value: "1,940" },
      { label: "Reach", value: "+188%" },
    ],
    status: "published",
    featured: true,
    platforms: "FB · IG",
    tags: "Lead gen · Video",
    cardStats: [
      { label: "Leads", value: "1,940" },
      { label: "Reach", value: "+188%" },
      { label: "Save rate", value: "7.4%" },
    ],
    trend: [18, 26, 38, 34, 52, 64, 78, 100],
    headline: "A qualified buyer pipeline before the first unit was finished.",
    intro:
      "Walkthrough reels and inbox qualification in Sinhala and English for a Colombo 03 development, run as a lead-generation programme from launch to handover.",
    sectorDetail: "Property · Residential",
    engagementPeriod: "Sep 2025 — Aug 2026",
    scope: "Meta ads, video",
    keyMetrics: [
      { label: "Qualified leads", value: "1,940" },
      { label: "Reach", value: "+188%" },
      { label: "Save rate", value: "7.4%" },
      { label: "ROAS", value: "3.8x" },
    ],
    sortOrder: 1,
  },
  {
    slug: "sahana-season-bookings",
    title: "Season Bookings",
    clientId: cid("Sahana Ayurveda Spa"),
    sector: "Hospitality",
    services: ["Social media", "Video"],
    summary:
      "Treatment-led short video, therapist features and a booking funnel tied to seasonal tourist demand in Galle and Unawatuna.",
    metrics: [
      { label: "Treatments booked", value: "612" },
      { label: "Video views", value: "2.1M" },
    ],
    status: "published",
    featured: true,
    platforms: "IG · Google",
    tags: "Social · Booking funnel",
    cardStats: [
      { label: "Engagement", value: "+264%" },
      { label: "Bookings", value: "612" },
      { label: "Video views", value: "2.1M" },
    ],
    trend: [30, 24, 36, 47, 44, 62, 69, 100],
    headline: "Filling treatment rooms through the tourist season.",
    intro: "Treatment-led short video and a booking funnel tied to seasonal tourist demand in the south.",
    sectorDetail: "Hospitality · Wellness",
    engagementPeriod: "Sep 2025 — Aug 2026",
    scope: "Social, video",
    sortOrder: 2,
  },
  {
    slug: "nuwara-hiking-season",
    title: "Hiking Season",
    clientId: cid("Nuwara Outdoor Gear"),
    sector: "Retail",
    services: ["Social media", "Photography"],
    summary: "Always-on retail calendar built around hiking season, with catalogue shoots produced monthly by the studio team.",
    metrics: [
      { label: "Store visits", value: "+147%" },
      { label: "Followers", value: "33.7K" },
    ],
    status: "published",
    featured: true,
    platforms: "FB · IG · YT",
    tags: "Retail calendar · Catalogue",
    cardStats: [
      { label: "Store visits", value: "+147%" },
      { label: "Followers", value: "33.7K" },
      { label: "Shoots / yr", value: "18" },
    ],
    trend: [25, 33, 29, 45, 56, 61, 81, 100],
    headline: "A retail calendar built around the hiking season.",
    intro: "Always-on retail content with monthly catalogue shoots produced by the studio team.",
    sectorDetail: "Retail · Outdoor",
    engagementPeriod: "Sep 2025 — Aug 2026",
    scope: "Social, photography",
    sortOrder: 3,
  },
  {
    slug: "galle-fort-table-opening",
    title: "Opening",
    clientId: cid("Galle Fort Table"),
    sector: "Hospitality",
    services: ["Video", "Photography"],
    summary: "Brand film and menu photography for the opening week of a fort-side restaurant.",
    metrics: [
      { label: "Video views", value: "2.1M" },
      { label: "Covers booked", value: "480" },
    ],
    status: "published",
    tags: "Brand film · Social",
    headline: "An opening week the fort talked about.",
    intro: "Brand film and menu photography for the opening week of a fort-side restaurant.",
    sectorDetail: "Hospitality · F&B",
    scope: "Video, photography",
    sortOrder: 4,
  },
  {
    slug: "metro-homeware-q2-sale",
    title: "Q2 Sale",
    clientId: cid("Metro Homeware"),
    sector: "Retail",
    services: ["Meta ads", "Photography"],
    summary: "Catalogue advertising and packshot production for an e-commerce homeware retailer's quarterly sale.",
    metrics: [
      { label: "Cost per purchase", value: "LKR 486" },
      { label: "ROAS", value: "4.2x" },
    ],
    status: "published",
    tags: "E-commerce · Catalogue ads",
    headline: "A quarterly sale that paid for itself in week one.",
    intro: "Catalogue advertising and packshot production for an e-commerce homeware retailer.",
    sectorDetail: "E-commerce · Homeware",
    scope: "Meta ads, photography",
    sortOrder: 5,
  },
]);
console.log("• 6 projects");

// ---------------------------------------------------------------- ad records
const ad = (
  name: string,
  period: string,
  spendLkr: number,
  roas: number,
  cpcLkr: number,
  cvrPct: number,
  costPerPurchaseLkr: number,
  purchases: number,
  monthlyRoas: number[],
  split: [number, number, number, number],
  visibility: "internal" | "published",
) => ({
  clientId: cid(name),
  period,
  spendLkr,
  roas,
  cpcLkr,
  cvrPct,
  costPerPurchaseLkr,
  purchases,
  monthlyRoas,
  split: { conversions: split[0], leadgen: split[1], retargeting: split[2], awareness: split[3] },
  visibility,
});

await db.insert(schema.adRecords).values([
  ad("Ceylon Leaf Tea Co.", "Sep 2025 — Aug 2026", 4_180_000, 6.1, 9.8, 7.2, 402, 10_400, [4.1, 4.4, 5.0, 4.8, 5.6, 6.2, 6.8, 7.4], [52, 18, 22, 8], "published"),
  ad("Marino Beach Residences", "Sep 2025 — Aug 2026", 11_640_000, 3.8, 16.2, 4.4, 1240, 3180, [2.6, 3.0, 3.3, 3.1, 3.6, 4.1, 4.4, 4.9], [24, 48, 18, 10], "published"),
  ad("Sahana Ayurveda Spa", "Sep 2025 — Aug 2026", 2_970_000, 5.4, 10.6, 6.8, 486, 6110, [3.4, 3.8, 4.2, 4.0, 4.9, 5.4, 6.1, 6.6], [44, 26, 20, 10], "published"),
  ad("Nuwara Outdoor Gear", "Sep 2025 — Aug 2026", 6_310_000, 4.9, 11.1, 5.9, 598, 8240, [3.2, 3.5, 4.0, 3.8, 4.4, 5.0, 5.5, 6.0], [48, 22, 18, 12], "published"),
  ad("Metro Homeware", "Jan 2026 — Aug 2026", 3_450_000, 4.2, 12.9, 5.1, 512, 4020, [3.0, 3.2, 3.6, 3.4, 4.0, 4.4, 4.8, 5.2], [56, 14, 20, 10], "internal"),
]);
console.log("• 5 ad records");

// ---------------------------------------------------------------- gallery
const asset = (
  name: string,
  caption: string,
  label: string,
  kind: "photo" | "video_frame",
  ratio: "3:4" | "4:5" | "1:1" | "16:9",
  status: "published" | "unpublished",
  sortOrder: number,
) => ({ clientId: cid(name), caption, label, kind, ratio, status, sortOrder, url: null });

await db.insert(schema.mediaAssets).values([
  asset("Ceylon Leaf Tea Co.", "loose leaf range", "Product still", "photo", "3:4", "published", 0),
  asset("Sahana Ayurveda Spa", "therapist features", "Portrait session", "photo", "3:4", "published", 1),
  asset("Marino Beach Residences", "show unit", "Interior set", "photo", "3:4", "published", 2),
  asset("Galle Fort Table", "menu shoot", "Food still", "photo", "3:4", "published", 3),
  asset("Nuwara Outdoor Gear", "hiking season spot", "Brand film still", "video_frame", "16:9", "published", 4),
  asset("Ceylon Leaf Tea Co.", "pour sequence", "Tabletop motion", "video_frame", "16:9", "published", 5),
  asset("Metro Homeware", "catalogue", "E-comm packshot", "photo", "1:1", "published", 6),
  asset("Hikka Surf Collective", "sunrise session", "On location", "photo", "1:1", "published", 7),
  asset("Ceylon Leaf Tea Co.", "brew ritual, morning light", "Lifestyle", "photo", "4:5", "unpublished", 8),
]);
console.log("• 9 gallery assets");

// ---------------------------------------------------------------- reel
await db.insert(schema.reelClips).values([
  { title: "pour sequence", clientId: cid("Ceylon Leaf Tea Co."), duration: "0:48", category: "Tabletop", position: 0, status: "live" },
  { title: "hiking season spot", clientId: cid("Nuwara Outdoor Gear"), duration: "1:12", category: "Brand film", position: 1, status: "live" },
  { title: "walkthrough", clientId: cid("Marino Beach Residences"), duration: "0:36", category: "Property", position: 2, status: "live" },
  { title: "treatment film", clientId: cid("Sahana Ayurveda Spa"), duration: "0:54", category: "Hospitality", position: 3, status: "live" },
]);
console.log("• 4 reel clips");

// ---------------------------------------------------------------- admin user
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (email && password) {
  if (password.length < 12) {
    console.warn("! ADMIN_PASSWORD is shorter than 12 characters — admin user not created.");
  } else {
    await db
      .insert(schema.users)
      .values({
        email,
        name: process.env.ADMIN_NAME ?? "Ishara W.",
        title: process.env.ADMIN_TITLE ?? "Creative Director",
        passwordHash: await bcrypt.hash(password, 12),
      })
      .onConflictDoNothing();
    console.log(`• Admin user ${email}`);
  }
} else {
  console.log("• No ADMIN_EMAIL/ADMIN_PASSWORD set — run `npm run admin:create -- --email you@idearigs.lk`");
}

console.log("✓ Seed complete");
client.close();
