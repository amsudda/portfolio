"use server";

import { count, eq, min } from "drizzle-orm";
import { z } from "zod";
import { clientSectors } from "@/content/site";
import { failure, revalidateSite, validationError, type ActionResult } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { deleteUpload } from "@/lib/storage";

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Client name is required.").max(120),
  shortName: z.string().trim().max(60).transform((v) => v || null),
  sector: z.enum(clientSectors),
  sinceYear: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1990 && v <= 2100), "Use a four-digit year."),
  engagement: z.enum(["retainer", "project"]),
  logoUrl: z.string().trim().max(500).nullable().transform((v) => v || null),
});

export type ClientInput = z.input<typeof clientSchema>;

export async function saveClient(input: ClientInput): Promise<ActionResult> {
  await requireUser();
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  const { id, ...data } = parsed.data;
  try {
    if (id) {
      const [before] = await db.select({ logoUrl: schema.clients.logoUrl }).from(schema.clients).where(eq(schema.clients.id, id));
      await db.update(schema.clients).set(data).where(eq(schema.clients.id, id));
      if (before?.logoUrl && before.logoUrl !== data.logoUrl) await deleteUpload(before.logoUrl);
    } else {
      const [{ first }] = await db.select({ first: min(schema.clients.sortOrder) }).from(schema.clients);
      await db.insert(schema.clients).values({ ...data, sortOrder: (first ?? 0) - 1 });
    }
  } catch (err) {
    return failure(err);
  }
  revalidateSite();
  return { ok: true };
}

export async function deleteClient(id: string): Promise<ActionResult> {
  await requireUser();
  const [{ n }] = await db.select({ n: count() }).from(schema.adRecords).where(eq(schema.adRecords.clientId, id));
  if (n > 0) {
    return { ok: false, error: `This client has ${n} ad record${n === 1 ? "" : "s"}. Delete those in Meta ads data first.` };
  }
  try {
    const [row] = await db.delete(schema.clients).where(eq(schema.clients.id, id)).returning();
    await deleteUpload(row?.logoUrl);
  } catch (err) {
    return failure(err, "Couldn't delete this client.");
  }
  revalidateSite();
  return { ok: true };
}
