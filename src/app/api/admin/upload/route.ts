import { getCurrentUser } from "@/lib/auth/session";
import { UPLOAD_ACCEPT, UploadError, extOf, saveUpload, type UploadKind } from "@/lib/storage";

/**
 * Raw-body upload: `POST /api/admin/upload?filename=shot.jpg&kind=image`.
 * The body is streamed straight to disk so 200MB videos aren't buffered in memory.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  // Defence in depth on top of SameSite=Lax cookies.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: "Cross-origin upload rejected." }, { status: 403 });
  }

  const url = new URL(request.url);
  const kind = (url.searchParams.get("kind") ?? "any") as UploadKind;
  const filename = url.searchParams.get("filename") ?? "";
  const ext = extOf(filename);
  const allowed = UPLOAD_ACCEPT[kind] as readonly string[] | undefined;

  if (!allowed) return Response.json({ error: "Unknown upload kind." }, { status: 400 });
  if (!ext || !allowed.includes(ext)) {
    return Response.json({ error: `Unsupported file type. Use ${allowed.join(", ").toUpperCase()}.` }, { status: 415 });
  }
  if (!request.body) return Response.json({ error: "No file received." }, { status: 400 });

  try {
    const saved = await saveUpload(request.body, ext);
    return Response.json({ url: saved }, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) return Response.json({ error: err.message }, { status: err.status });
    console.error("[upload] failed", err);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
