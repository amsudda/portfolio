import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdateFn(() => new Date()),
};

export type Metric = { label: string; value: string };
export type ApproachStep = { title: string; body: string };
export type GalleryItem = { url: string | null; label: string; caption: string };
export type SpendSplit = { conversions: number; leadgen: number; retargeting: number; awareness: number };

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").notNull().default("Team"),
  passwordHash: text("password_hash").notNull(),
  ...timestamps,
});

export const clients = sqliteTable("clients", {
  id: id(),
  name: text("name").notNull(),
  shortName: text("short_name"),
  sector: text("sector").notNull(),
  sinceYear: integer("since_year"),
  engagement: text("engagement", { enum: ["retainer", "project"] }).notNull().default("project"),
  logoUrl: text("logo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const projects = sqliteTable(
  "projects",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
    sector: text("sector").notNull(),
    services: text("services", { mode: "json" }).$type<string[]>().notNull().default([]),
    summary: text("summary").notNull().default(""),
    metrics: text("metrics", { mode: "json" }).$type<Metric[]>().notNull().default([]),
    status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
    heroUrl: text("hero_url"),
    reelUrl: text("reel_url"),
    gallery: text("gallery", { mode: "json" }).$type<GalleryItem[]>().notNull().default([]),
    // Card copy (home + portfolio)
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    platforms: text("platforms").notNull().default(""),
    tags: text("tags").notNull().default(""),
    cardStats: text("card_stats", { mode: "json" }).$type<Metric[]>().notNull().default([]),
    trend: text("trend", { mode: "json" }).$type<number[]>().notNull().default([]),
    // Case study page (/work/[slug])
    headline: text("headline").notNull().default(""),
    intro: text("intro").notNull().default(""),
    sectorDetail: text("sector_detail").notNull().default(""),
    engagementPeriod: text("engagement_period").notNull().default(""),
    scope: text("scope").notNull().default(""),
    keyMetrics: text("key_metrics", { mode: "json" }).$type<Metric[]>().notNull().default([]),
    problem: text("problem").notNull().default(""),
    approach: text("approach", { mode: "json" }).$type<ApproachStep[]>().notNull().default([]),
    quote: text("quote").notNull().default(""),
    quoteAttribution: text("quote_attribution").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("projects_status_idx").on(t.status)],
);

export const adRecords = sqliteTable("ad_records", {
  id: id(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  period: text("period").notNull().default(""),
  spendLkr: real("spend_lkr").notNull().default(0),
  roas: real("roas").notNull().default(0),
  cpcLkr: real("cpc_lkr").notNull().default(0),
  cvrPct: real("cvr_pct").notNull().default(0),
  costPerPurchaseLkr: real("cost_per_purchase_lkr").notNull().default(0),
  purchases: integer("purchases").notNull().default(0),
  /** Jan–Aug, null where not reported. */
  monthlyRoas: text("monthly_roas", { mode: "json" }).$type<(number | null)[]>().notNull().default([]),
  split: text("split", { mode: "json" })
    .$type<SpendSplit>()
    .notNull()
    .default({ conversions: 0, leadgen: 0, retargeting: 0, awareness: 0 }),
  visibility: text("visibility", { enum: ["internal", "published"] }).notNull().default("internal"),
  ...timestamps,
});

export const mediaAssets = sqliteTable("media_assets", {
  id: id(),
  caption: text("caption").notNull().default(""),
  label: text("label").notNull().default(""),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  kind: text("kind", { enum: ["photo", "video_frame"] }).notNull().default("photo"),
  ratio: text("ratio", { enum: ["3:4", "4:5", "1:1", "16:9", "21:9"] }).notNull().default("3:4"),
  url: text("url"),
  status: text("status", { enum: ["published", "unpublished"] }).notNull().default("unpublished"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const reelClips = sqliteTable("reel_clips", {
  id: id(),
  title: text("title").notNull(),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  duration: text("duration").notNull().default(""),
  category: text("category").notNull().default("Social cut"),
  fileUrl: text("file_url"),
  posterUrl: text("poster_url"),
  position: integer("position").notNull().default(0),
  status: text("status", { enum: ["live", "hidden"] }).notNull().default("hidden"),
  ...timestamps,
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull(),
  updatedAt: timestamps.updatedAt,
});

export const enquiries = sqliteTable(
  "enquiries",
  {
    id: id(),
    name: text("name").notNull(),
    company: text("company").notNull().default(""),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    service: text("service").notNull().default(""),
    budget: text("budget").notNull().default(""),
    message: text("message").notNull(),
    status: text("status", { enum: ["new", "read", "archived"] }).notNull().default("new"),
    userAgent: text("user_agent").notNull().default(""),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("enquiries_created_idx").on(t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type AdRecord = typeof adRecords.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type ReelClip = typeof reelClips.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
