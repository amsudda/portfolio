"use server";

import { eq, min } from "drizzle-orm";
import { z } from "zod";
import { assetRatios } from "@/content/site";
import { failure, revalidateSite, validationError, type ActionResult } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { MEDIA_PREFIX, deleteUpload } from "@/lib/storage";

const assetSchema = z.object({
  id: z.string().optional(),
  caption: z.string().trim().max(120),
  label: z.string().trim().max(40),
  clientId: z.string().nullable().transform((v) => v || null),
  kind: z.enum(["photo", "video_frame"]),
  ratio: z.enum(assetRatios),
  url: z.string().trim().max(500).nullable().transform((v) => v || null),
  status: z.enum(["published", "unpublished"]),
});

export type AssetInput = z.input<typeof assetSchema>;

async function topSortOrder() {
  const [{ first }] = await db.select({ first: min(schema.mediaAssets.sortOrder) }).from(schema.mediaAssets);
  return (first ?? 0) - 1;
}

export async function saveAsset(input: AssetInput): Promise<ActionResult> {
  await requireUser();
  const parsed = assetSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  const { id, ...data } = parsed.data;
  if (data.status === "published" && !data.caption) {
    return { ok: false, error: "Add a caption before publishing.", fieldErrors: { caption: "Required to publish." } };
  }
  try {
    if (id) {
      const [before] = await db.select({ url: schema.mediaAssets.url }).from(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));
      await db.update(schema.mediaAssets).set(data).where(eq(schema.mediaAssets.id, id));
      if (before?.url && before.url !== data.url) await deleteUpload(before.url);
    } else {
      await db.insert(schema.mediaAssets).values({ ...data, sortOrder: await topSortOrder() });
    }
  } catch (err) {
    return failure(err);
  }
  revalidateSite();
  return { ok: true };
}

/** Bulk "drop files to upload": each file becomes an unpublished asset to caption later. */
export async function createAssetsFromUploads(urls: string[]): Promise<ActionResult> {
  await requireUser();
  const valid = urls.filter((u) => typeof u === "string" && u.startsWith(MEDIA_PREFIX)).slice(0, 50);
  if (!valid.length) return { ok: false, error: "Nothing was uploaded." };
  try {
    let order = await topSortOrder();
    await db.insert(schema.mediaAssets).values(
      valid.map((url) => ({
        url,
        kind: /\.(mp4|webm)$/i.test(url) ? ("video_frame" as const) : ("photo" as const),
        status: "unpublished" as const,
        sortOrder: order--,
      })),
    );
  } catch (err) {
    return failure(err);
  }
  revalidateSite();
  return { ok: true };
}

export async function toggleAssetStatus(id: string): Promise<ActionResult> {
  await requireUser();
  const [asset] = await db.select().from(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));
  if (!asset) return { ok: false, error: "Asset not found." };
  if (asset.status !== "published" && !asset.caption) return { ok: false, error: "Add a caption before publishing." };
  await db
    .update(schema.mediaAssets)
    .set({ status: asset.status === "published" ? "unpublished" : "published" })
    .where(eq(schema.mediaAssets.id, id));
  revalidateSite();
  return { ok: true };
}

export async function deleteAsset(id: string): Promise<ActionResult> {
  await requireUser();
  try {
    const [row] = await db.delete(schema.mediaAssets).where(eq(schema.mediaAssets.id, id)).returning();
    await deleteUpload(row?.url);
  } catch (err) {
    return failure(err, "Couldn't delete this asset.");
  }
  revalidateSite();
  return { ok: true };
}
