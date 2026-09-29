import "server-only";
import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Fixed-window, in-memory limiter. Good enough for a single instance; swap for
 * Redis/Upstash if the site is deployed across multiple instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10_000) sweep(now);
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  return { ok: bucket.count <= limit, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
}

function sweep(now: number) {
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
