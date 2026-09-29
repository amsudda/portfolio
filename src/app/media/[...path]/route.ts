import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { MEDIA_TYPES, extOf, resolveMediaPath } from "@/lib/storage";

export async function GET(request: Request, ctx: RouteContext<"/media/[...path]">) {
  const { path: segments } = await ctx.params;
  const abs = resolveMediaPath(segments);
  const ext = extOf(segments.at(-1) ?? "");
  if (!abs || !ext) return new Response("Not found", { status: 404 });

  let size: number;
  try {
    const info = await stat(abs);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    size = info.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers({
    "Content-Type": MEDIA_TYPES[ext],
    "Accept-Ranges": "bytes",
    // Filenames are random UUIDs, so a file at a URL never changes.
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
  if (ext === "svg") {
    // Uploaded SVG could carry script; never let it execute on our origin.
    headers.set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox");
  }

  const range = request.headers.get("range");
  const match = range?.match(/^bytes=(\d*)-(\d*)$/);
  if (match && (match[1] || match[2])) {
    let start = match[1] ? Number(match[1]) : size - Number(match[2]);
    let end = match[1] && match[2] ? Number(match[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(end - start + 1));
    const stream = Readable.toWeb(createReadStream(abs, { start, end })) as ReadableStream;
    return new Response(stream, { status: 206, headers });
  }

  headers.set("Content-Length", String(size));
  const stream = Readable.toWeb(createReadStream(abs)) as ReadableStream;
  return new Response(stream, { status: 200, headers });
}
