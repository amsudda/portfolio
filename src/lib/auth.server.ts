/**
 * Minimal server-side admin auth: a username + password (env ADMIN_USERNAME /
 * ADMIN_PASSWORD) are exchanged for a signed, httpOnly session cookie.
 * Server-only.
 */
import crypto from "node:crypto";

const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
const USERNAME = process.env.ADMIN_USERNAME || "admin";
const PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const COOKIE = "portfolio_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

function sign(value: string): string {
  const mac = crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
  return `${value}.${mac}`;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

function verify(signed: string): boolean {
  const dot = signed.lastIndexOf(".");
  if (dot === -1) return false;
  const value = signed.slice(0, dot);
  if (!safeEqual(sign(value), signed)) return false;
  const exp = Number(value.split(":")[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

export function checkCredentials(username: string, pw: string): boolean {
  // Evaluate both comparisons regardless of the first result so the response
  // time doesn't reveal whether the username alone was correct.
  const okUser = safeEqual(username, USERNAME);
  const okPass = safeEqual(pw, PASSWORD);
  return okUser && okPass;
}

function cookieString(value: string, maxAge: number): string {
  const parts = [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function makeSessionCookie(): string {
  const value = `admin:${Date.now() + MAX_AGE * 1000}`;
  return cookieString(sign(value), MAX_AGE);
}

export function clearSessionCookie(): string {
  return cookieString("", 0);
}

function parseCookie(header: string | null): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === COOKIE) return part.slice(eq + 1).trim();
  }
  return null;
}

export function isAuthed(request: Request): boolean {
  const token = parseCookie(request.headers.get("cookie"));
  return !!token && verify(token);
}
