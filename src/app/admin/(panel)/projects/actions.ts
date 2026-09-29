"use server";

import { and, eq, min, ne } from "drizzle-orm";
import { z } from "zod";
import { projectSectors, projectServices } from "@/content/site";
import { failure, revalidateSite, validationError, type ActionResult } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { parseLooseNumber, slugify } from "@/lib/format";
import { deleteUpload } from "@/lib/storage";

const text = (max: number) => z.string().trim().max(max);
const url = z.string().trim().max(500).nullable().transform((v) => v || null);
const metric = z.object({ label: text(60), value: text(30) });
/** Drops rows where both fields are empty. */
const metricList = (max: number) =>
  z
    .array(metric)
    .max(max)
    .transform((rows) => rows.filter((m) => m.label || m.value));

const projectSchema = z
  .object({
    id: z.string().optional(),
    slug: text(80),
    title: text(120).min(2, "Give the project a title."),
    clientId: z.string().nullable(),
    sector: z.enum(projectSectors),
    services: z.array(z.enum(projectServices)),
    summary: text(600),
    metrics: metricList(2),
    status: z.enum(["draft", "published"]),
    heroUrl: url,
    reelUrl: url,
    gallery: z
      .array(z.object({ url, label: text(40), caption: text(120) }))
      .max(12)
      .transform((rows) => rows.filter((g) => g.url || g.label || g.caption)),
    featured: z.boolean(),
    platforms: text(60),
    tags: text(80),
    cardStats: metricList(3),
    trend: z
      .array(z.string())
      .max(8)
      .transform((vals) => vals.map(parseLooseNumber).filter((n): n is number => n !== null && n >= 0)),
    headline: text(200),
    intro: text(800),
    sectorDetail: text(80),
    engagementPeriod: text(60),
    scope: text(120),
    keyMetrics: metricList(4),
    problem: text(4000),
    approach: z
      .array(z.object({ title: text(80), body: text(400) }))
      .max(8)
      .transform((rows) => rows.filter((s) => s.title || s.body)),
    quote: text(600),
    quoteAttribution: text(120),
  })
  .superRefine((p, ctx) => {
    if (p.status === "published" && !p.summary) {
      ctx.addIssue({ code: "custom", path: ["summary"], message: "Add a summary before publishing." });
    }
    if (p.status === "published" && p.metrics.length === 0) {
      ctx.addIssue({ code: "custom", path: ["metrics"], message: "Add at least one headline metric before publishing." });
    }
  });

export type ProjectInput = z.input<typeof projectSchema>;

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "project";
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const clash = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(excludeId ? and(eq(schema.projects.slug, candidate), ne(schema.projects.id, excludeId)) : eq(schema.projects.slug, candidate))
      .limit(1);
    if (!clash.length) return candidate;
  }
  return `${root}-${crypto.randomUUID().slice(0, 6)}`;
}

export async function saveProject(input: ProjectInput): Promise<ActionResult> {
  await requireUser();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  const { id, ...data } = parsed.data;

  try {
    let clientName = "";
    if (data.clientId) {
      const [c] = await db.select().from(schema.clients).where(eq(schema.clients.id, data.clientId));
      if (!c) return { ok: false, error: "That client no longer exists.", fieldErrors: { clientId: "Pick a client." } };
      clientName = c.shortName || c.name;
    }
    const slug = await uniqueSlug(data.slug || `${clientName} ${data.title}`, id);

    if (id) {
      const [before] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
      if (!before) return { ok: false, error: "This project was deleted by someone else." };
      await db.update(schema.projects).set({ ...data, slug }).where(eq(schema.projects.id, id));
      // Tidy up files that were replaced or removed.
      const kept = new Set([data.heroUrl, data.reelUrl, ...data.gallery.map((g) => g.url)]);
      for (const old of [before.heroUrl, before.reelUrl, ...before.gallery.map((g) => g.url)]) {
        if (old && !kept.has(old)) await deleteUpload(old);
      }
    } else {
      const [{ first }] = await db.select({ first: min(schema.projects.sortOrder) }).from(schema.projects);
      await db.insert(schema.projects).values({ ...data, slug, sortOrder: (first ?? 0) - 1 });
    }
  } catch (err) {
    return failure(err);
  }
  revalidateSite();
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireUser();
  try {
    const [row] = await db.delete(schema.projects).where(eq(schema.projects.id, id)).returning();
    if (row) for (const u of [row.heroUrl, row.reelUrl, ...row.gallery.map((g) => g.url)]) await deleteUpload(u);
  } catch (err) {
    return failure(err, "Couldn't delete this project.");
  }
  revalidateSite();
  return { ok: true };
}
