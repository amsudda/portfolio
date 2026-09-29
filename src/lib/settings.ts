import "server-only";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";

export const siteSettingsSchema = z.object({
  heroLoopUrl: z.string().trim().max(500).nullable(),
  heroPosterUrl: z.string().trim().max(500).nullable(),
  showTrustBar: z.boolean(),
  showAdsBreakdown: z.boolean(),
  showClosingCta: z.boolean(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const defaultSettings: SiteSettings = {
  heroLoopUrl: null,
  heroPosterUrl: null,
  showTrustBar: true,
  showAdsBreakdown: true,
  showClosingCta: true,
};

const keys = Object.keys(defaultSettings) as (keyof SiteSettings)[];

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(schema.settings).where(inArray(schema.settings.key, keys));
  const merged: Record<string, unknown> = { ...defaultSettings };
  for (const row of rows) merged[row.key] = row.value;
  const parsed = siteSettingsSchema.safeParse(merged);
  return parsed.success ? parsed.data : defaultSettings;
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<void> {
  const entries = Object.entries(patch).filter(([k]) => keys.includes(k as keyof SiteSettings));
  for (const [key, value] of entries) {
    await db
      .insert(schema.settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: new Date() } });
  }
}
