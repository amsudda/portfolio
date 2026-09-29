import "server-only";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, schema } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from "./token";

export async function createSession(user: { id: string; name: string }) {
  const token = await signSession({ sub: user.id, name: user.name });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** The signed-in user, verified against the database. Memoised per request. */
export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const [user] = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, title: schema.users.title })
    .from(schema.users)
    .where(eq(schema.users.id, session.sub))
    .limit(1);
  return user ?? null;
});

/**
 * Guard for admin pages and every admin server action. Server actions are public
 * endpoints, so this must run inside each one — the proxy alone is not enough.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
