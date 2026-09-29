import "server-only";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { Client, Project } from "@/lib/db/schema";
import { computePerformance } from "@/lib/metrics";

export type ProjectWithClient = Project & { client: Client | null };

/** "Ceylon Leaf" style label, falling back to the full client name. */
export function clientShort(client: Pick<Client, "name" | "shortName"> | null | undefined): string {
  return client?.shortName?.trim() || client?.name || "";
}

async function publishedProjects(): Promise<ProjectWithClient[]> {
  const rows = await db
    .select()
    .from(schema.projects)
    .leftJoin(schema.clients, eq(schema.projects.clientId, schema.clients.id))
    .where(eq(schema.projects.status, "published"))
    .orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt));
  return rows.map((r) => ({ ...r.projects, client: r.clients }));
}

async function publishedPerformance() {
  const rows = await db
    .select()
    .from(schema.adRecords)
    .innerJoin(schema.clients, eq(schema.adRecords.clientId, schema.clients.id))
    .where(eq(schema.adRecords.visibility, "published"))
    .orderBy(desc(schema.adRecords.spendLkr));

  const records = rows.map((r) => r.ad_records);
  return {
    performance: computePerformance(records),
    rows: rows.map((r) => ({
      id: r.ad_records.id,
      account: r.clients.name,
      spend: r.ad_records.spendLkr,
      roas: r.ad_records.roas,
      cpc: r.ad_records.cpcLkr,
      cvr: r.ad_records.cvrPct,
    })),
  };
}

async function liveClips() {
  const rows = await db
    .select()
    .from(schema.reelClips)
    .leftJoin(schema.clients, eq(schema.reelClips.clientId, schema.clients.id))
    .where(eq(schema.reelClips.status, "live"))
    .orderBy(asc(schema.reelClips.position));
  return rows.map((r) => ({
    id: r.reel_clips.id,
    title: [clientShort(r.clients), r.reel_clips.title].filter(Boolean).join(" — "),
    duration: r.reel_clips.duration,
    category: r.reel_clips.category,
    src: r.reel_clips.fileUrl,
    poster: r.reel_clips.posterUrl,
  }));
}

async function publishedAssets() {
  const rows = await db
    .select()
    .from(schema.mediaAssets)
    .leftJoin(schema.clients, eq(schema.mediaAssets.clientId, schema.clients.id))
    .where(eq(schema.mediaAssets.status, "published"))
    .orderBy(asc(schema.mediaAssets.sortOrder), desc(schema.mediaAssets.createdAt));
  return rows.map((r) => ({
    ...r.media_assets,
    clientLabel: clientShort(r.clients),
  }));
}

export type PublicAsset = Awaited<ReturnType<typeof publishedAssets>>[number];
export type PublicClip = Awaited<ReturnType<typeof liveClips>>[number];

export async function getHomeData() {
  const [projects, perf, clips, assets, clientNames] = await Promise.all([
    publishedProjects(),
    publishedPerformance(),
    liveClips(),
    publishedAssets(),
    db.select({ name: schema.clients.name }).from(schema.clients).orderBy(asc(schema.clients.sortOrder), asc(schema.clients.name)),
  ]);
  return {
    clientNames: clientNames.map((c) => c.name),
    featured: projects.filter((p) => p.featured).slice(0, 4),
    ...perf,
    clips,
    assets,
  };
}

export async function getPortfolioData() {
  const [clients, projects, assets] = await Promise.all([
    db.select().from(schema.clients).orderBy(asc(schema.clients.sortOrder), asc(schema.clients.name)),
    publishedProjects(),
    publishedAssets(),
  ]);
  return { clients, projects, assets };
}

export async function getPublishedSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: schema.projects.slug })
    .from(schema.projects)
    .where(eq(schema.projects.status, "published"));
  return rows.map((r) => r.slug);
}

export async function getCaseStudy(slug: string) {
  const projects = await publishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  return { project: projects[index], number: index + 1, next };
}

export async function getFirstCaseStudySlug(): Promise<string | null> {
  const [row] = await db
    .select({ slug: schema.projects.slug })
    .from(schema.projects)
    .where(and(eq(schema.projects.status, "published"), ne(schema.projects.slug, "")))
    .orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
    .limit(1);
  return row?.slug ?? null;
}
