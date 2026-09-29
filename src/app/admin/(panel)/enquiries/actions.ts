"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { failure, type ActionResult } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";

const statusSchema = z.enum(["new", "read", "archived"]);

export async function setEnquiryStatus(id: string, status: z.infer<typeof statusSchema>): Promise<ActionResult> {
  await requireUser();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Unknown status." };
  try {
    await db.update(schema.enquiries).set({ status: parsed.data }).where(eq(schema.enquiries.id, id));
  } catch (err) {
    return failure(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteEnquiry(id: string): Promise<ActionResult> {
  await requireUser();
  try {
    await db.delete(schema.enquiries).where(eq(schema.enquiries.id, id));
  } catch (err) {
    return failure(err, "Couldn't delete this enquiry.");
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}
