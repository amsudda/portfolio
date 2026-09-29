import "server-only";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function validationError(error: z.ZodError): ActionResult<never> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, error: Object.values(fieldErrors)[0] ?? "Please check the form.", fieldErrors };
}

export function failure(err: unknown, fallback = "Couldn't save. Please try again."): ActionResult<never> {
  console.error("[admin]", err);
  const msg = err instanceof Error ? err.message : "";
  if (/UNIQUE constraint failed: projects\.slug/.test(msg)) {
    return { ok: false, error: "Another project already uses that URL slug.", fieldErrors: { slug: "Already in use." } };
  }
  return { ok: false, error: fallback };
}

/** Public pages are ISR; refresh all of them after any content change. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
