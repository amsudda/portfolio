import "server-only";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

/**
 * Local-disk storage adapter. Files live outside `public/` (which is frozen at
 * build time) and are served by `app/media/[...path]/route.ts`. To move to S3/R2,
 * replace `saveUpload`/`deleteUpload` and point URLs at the bucket/CDN.
 */

// turbopackIgnore: runtime-only paths; stops the build tracing the whole project.
export const UPLOAD_DIR = path.resolve(
  /*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", "uploads"),
);
export const MEDIA_PREFIX = "/media/";
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

export const MEDIA_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
} as const;

export type MediaExt = keyof typeof MEDIA_TYPES;

export const UPLOAD_ACCEPT = {
  image: ["jpg", "jpeg", "png", "webp", "avif"],
  logo: ["svg", "png", "webp"],
  video: ["mp4", "webm"],
  any: ["jpg", "jpeg", "png", "webp", "avif", "mp4", "webm"],
} as const satisfies Record<string, readonly MediaExt[]>;

export type UploadKind = keyof typeof UPLOAD_ACCEPT;

export function extOf(filename: string): MediaExt | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && ext in MEDIA_TYPES ? (ext as MediaExt) : null;
}

/** Checks the leading bytes so a renamed file can't masquerade as media. */
export function sniffMatches(ext: MediaExt, head: Uint8Array): boolean {
  const ascii = (from: number, to: number) => String.fromCharCode(...head.slice(from, to));
  switch (ext) {
    case "jpg":
    case "jpeg":
      return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
    case "png":
      return head[0] === 0x89 && ascii(1, 4) === "PNG";
    case "webp":
      return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "avif":
    case "mp4":
      return ascii(4, 8) === "ftyp";
    case "webm":
      return head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3;
    case "svg": {
      const text = new TextDecoder().decode(head).trimStart().toLowerCase();
      return text.startsWith("<svg") || text.startsWith("<?xml");
    }
  }
}

export class UploadError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

/** Streams the request body to disk, enforcing type and size. Returns the public URL. */
export async function saveUpload(body: ReadableStream<Uint8Array>, ext: MediaExt): Promise<string> {
  const now = new Date();
  const rel = path.posix.join(
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    `${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`,
  );
  const abs = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, rel);
  await mkdir(path.dirname(abs), { recursive: true });

  const reader = body.getReader();
  const out = createWriteStream(abs, { flags: "wx" });
  let written = 0;
  let sniffed = false;
  let head = new Uint8Array(0); // buffered until the magic bytes have been checked

  const write = async (chunk: Uint8Array) => {
    if (!out.write(chunk)) await new Promise<void>((r) => out.once("drain", () => r()));
  };
  const flushHead = async () => {
    if (!sniffMatches(ext, head)) throw new UploadError("File contents don't match its extension.", 415);
    sniffed = true;
    await write(head);
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      written += value.byteLength;
      if (written > MAX_UPLOAD_BYTES) throw new UploadError("File is larger than 200MB.", 413);
      if (sniffed) {
        await write(value);
        continue;
      }
      const merged = new Uint8Array(head.byteLength + value.byteLength);
      merged.set(head);
      merged.set(value, head.byteLength);
      head = merged;
      if (head.byteLength >= 16) await flushHead();
    }
    if (written === 0) throw new UploadError("The file is empty.");
    if (!sniffed) await flushHead();
    await new Promise<void>((resolve, reject) => {
      out.once("error", reject);
      out.end(() => resolve());
    });
    return MEDIA_PREFIX + rel;
  } catch (err) {
    reader.cancel().catch(() => {});
    out.destroy();
    await rm(abs, { force: true });
    throw err;
  }
}

/** Resolves a /media URL (or its segments) to a path inside UPLOAD_DIR, or null if it escapes. */
export function resolveMediaPath(segments: string[]): string | null {
  if (segments.some((s) => s === ".." || s.includes("\\") || s.includes("\0"))) return null;
  const abs = path.resolve(/*turbopackIgnore: true*/ UPLOAD_DIR, ...segments);
  return abs.startsWith(UPLOAD_DIR + path.sep) ? abs : null;
}

export async function deleteUpload(url: string | null | undefined): Promise<void> {
  if (!url?.startsWith(MEDIA_PREFIX)) return;
  const abs = resolveMediaPath(url.slice(MEDIA_PREFIX.length).split("/"));
  if (abs) await rm(abs, { force: true });
}
