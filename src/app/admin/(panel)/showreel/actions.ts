"use server";

import { asc, eq, max } from "drizzle-orm";
import { z } from "zod";
import { clipCategories } from "@/content/site";
import { failure, revalidateSite, validationError, type ActionResult } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { getSettings, saveSettings } from "@/lib/settings";
import { deleteUpload } from "@/lib/storage";

const url = z.string().trim().max(500).nullable().transform((v) => v || null);

const clipSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Give the clip a title.").max(80),
  clientId: z.string().nullable().transform((v) => v || null),
  duration: z
    .string()
    .trim()
    .regex(/^(\d{1,2}:\d{2})?$/, "Use m:ss, e.g. 0:48."),
  category: z.enum(clipCategories),
  fileUrl: url,
  posterUrl: url,
  status: z.enum(["live", "hidden"]),
});

export type ClipInput = z.input<typeof clipSchema>;

export async function saveClip(input: ClipInput): Promise<ActionResult> {
  await requireUser();
  const parsed = clipSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  const { id, ...data } = parsed.data;
  if (data.status === "live" && !data.fileUrl) {
    return { ok: false, error: "Upload the MP4 before setting the clip live.", fieldErrors: { fileUrl: "Required to go live." } };
  }
  try {
    if (id) {
      const [before] = await db.select().from(schema.reelClips).where(eq(schema.reelClips.id, id));
      await db.update(schema.reelClips).set(data).where(eq(schema.reelClips.id, id));
      if (before?.fileUrl && before.fileUrl !== data.fileUrl) await deleteUpload(before.fileUrl);
      if (before?.posterUrl && before.posterUrl !== data.posterUrl) await deleteUpload(before.posterUrl);
    } else {
      // New clips go to the end of the reel.
      const [{ last }] = await db.select({ last: max(schema.reelClips.position) }).from(schema.reelClips);
      await db.insert(schema.reelClips).values({ ...data, position: (last ?? -1) + 1 });
    }
  } catch (err) {
    return failure(err);
  }
  revalidateSite();
  return { ok: true };
}

/** Swaps a clip with its neighbour, then renumbers so positions stay contiguous. */
export async function moveClip(id: string, direction: -1 | 1): Promise<ActionResult> {
  await requireUser();
  const clips = await db.select({ id: schema.reelClips.id }).from(schema.reelClips).orderBy(asc(schema.reelClips.position));
  const i = clips.findIndex((c) => c.id === id);
  const j = i + direction;
  if (i === -1 || j < 0 || j >= clips.length) return { ok: true };
  [clips[i], clips[j]] = [clips[j], clips[i]];
  await db.transaction(async (tx) => {
    for (const [position, c] of clips.entries()) {
      await tx.update(schema.reelClips).set({ position }).where(eq(schema.reelClips.id, c.id));
    }
  });
  revalidateSite();
  return { ok: true };
}

export async function toggleClip(id: string): Promise<ActionResult> {
  await requireUser();
  const [clip] = await db.select().from(schema.reelClips).where(eq(schema.reelClips.id, id));
  if (!clip) return { ok: false, error: "Clip not found." };
  if (clip.status === "hidden" && !clip.fileUrl) return { ok: false, error: `Upload the MP4 for “${clip.title}” before it can go live.` };
  await db
    .update(schema.reelClips)
    .set({ status: clip.status === "live" ? "hidden" : "live" })
    .where(eq(schema.reelClips.id, id));
  revalidateSite();
  return { ok: true };
}

export async function deleteClip(id: string): Promise<ActionResult> {
  await requireUser();
  try {
    const [row] = await db.delete(schema.reelClips).where(eq(schema.reelClips.id, id)).returning();
    await deleteUpload(row?.fileUrl);
    await deleteUpload(row?.posterUrl);
  } catch (err) {
    return failure(err, "Couldn't delete this clip.");
  }
  revalidateSite();
  return { ok: true };
}

export async function saveHeroLoop(input: { heroLoopUrl: string | null; heroPosterUrl: string | null }): Promise<ActionResult> {
  await requireUser();
  const parsed = z.object({ heroLoopUrl: url, heroPosterUrl: url }).safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  const before = await getSettings();
  await saveSettings(parsed.data);
  if (before.heroLoopUrl && before.heroLoopUrl !== parsed.data.heroLoopUrl) await deleteUpload(before.heroLoopUrl);
  if (before.heroPosterUrl && before.heroPosterUrl !== parsed.data.heroPosterUrl) await deleteUpload(before.heroPosterUrl);
  revalidateSite();
  return { ok: true };
}
