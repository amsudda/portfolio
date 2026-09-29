"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { failure, revalidateSite, validationError, type ActionResult } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { parseLooseNumber } from "@/lib/format";
import { SPLIT_KEYS, splitTotal } from "@/lib/metrics";

const num = (label: string, { max = 1e12, integer = false } = {}) =>
  z.string().transform((v, ctx) => {
    const n = parseLooseNumber(v);
    if (n === null) return 0;
    if (n < 0 || n > max || (integer && !Number.isInteger(n))) {
      ctx.addIssue({ code: "custom", message: `${label} must be a ${integer ? "whole " : ""}number between 0 and ${max.toLocaleString("en-US")}.` });
      return z.NEVER;
    }
    return n;
  });

const adSchema = z
  .object({
    id: z.string().optional(),
    clientId: z.string().min(1, "Pick the client account."),
    period: z.string().trim().max(60),
    spendLkr: num("Spend"),
    roas: num("ROAS", { max: 100 }),
    cpcLkr: num("CPC", { max: 100000 }),
    cvrPct: num("Conversion rate", { max: 100 }),
    costPerPurchaseLkr: num("Cost per purchase"),
    purchases: num("Purchases", { integer: true }),
    monthlyRoas: z
      .array(z.string())
      .length(8)
      .transform((vals) => vals.map((v) => parseLooseNumber(v))),
    split: z.object(Object.fromEntries(SPLIT_KEYS.map((k) => [k, num("Split", { max: 100 })])) as Record<(typeof SPLIT_KEYS)[number], ReturnType<typeof num>>),
    visibility: z.enum(["internal", "published"]),
  })
  .superRefine((r, ctx) => {
    if (r.visibility !== "published") return;
    if (r.spendLkr <= 0) ctx.addIssue({ code: "custom", path: ["spendLkr"], message: "Published records need a spend figure — it weights every public average." });
    const total = splitTotal(r.split);
    if (Math.round(total) !== 100) ctx.addIssue({ code: "custom", path: ["split"], message: `Spend split must total 100% to publish (currently ${total}%).` });
  });

export type AdInput = z.input<typeof adSchema>;

export async function saveAdRecord(input: AdInput): Promise<ActionResult> {
  await requireUser();
  const parsed = adSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  const { id, ...data } = parsed.data;
  try {
    const [client] = await db.select({ id: schema.clients.id }).from(schema.clients).where(eq(schema.clients.id, data.clientId));
    if (!client) return { ok: false, error: "That client no longer exists.", fieldErrors: { clientId: "Pick the client account." } };
    if (id) await db.update(schema.adRecords).set(data).where(eq(schema.adRecords.id, id));
    else await db.insert(schema.adRecords).values(data);
  } catch (err) {
    return failure(err);
  }
  revalidateSite();
  return { ok: true };
}

export async function deleteAdRecord(id: string): Promise<ActionResult> {
  await requireUser();
  try {
    await db.delete(schema.adRecords).where(eq(schema.adRecords.id, id));
  } catch (err) {
    return failure(err, "Couldn't delete this record.");
  }
  revalidateSite();
  return { ok: true };
}
