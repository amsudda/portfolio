/**
 * Session token primitives. No `server-only` import so the proxy can use it.
 */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "idr_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { sub: string; name: string };

let warned = false;

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set to at least 32 characters in production.");
    }
    if (!warned) {
      console.warn("[auth] SESSION_SECRET is missing or short — using an insecure development secret.");
      warned = true;
    }
    return new TextEncoder().encode("dev-only-insecure-secret-change-me-please-000");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub, name: typeof payload.name === "string" ? payload.name : "" };
  } catch {
    return null;
  }
}
