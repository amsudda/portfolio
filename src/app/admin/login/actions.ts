"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(200),
});

/** Only allow same-site relative redirects after login. */
function safeNext(next: unknown): string {
  return typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin/projects";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const ip = await clientIp();
  const limit = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    return { error: `Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfterSec / 60)} minutes.`, email };
  }

  const parsed = loginSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email and password.", email };

  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, parsed.data.email)).limit(1);
  const ok = await verifyPassword(parsed.data.password, user?.passwordHash);
  if (!user || !ok) return { error: "That email and password don't match an account.", email };

  await createSession(user);
  redirect(safeNext(formData.get("next")));
}
