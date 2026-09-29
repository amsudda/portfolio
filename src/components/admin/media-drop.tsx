"use client";

import { LoaderCircle, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type UploadKind = "image" | "logo" | "video" | "any";

const ACCEPT: Record<UploadKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  logo: "image/svg+xml,image/png,image/webp",
  video: "video/mp4,video/webm",
  any: "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm",
};

const MAX_BYTES = 200 * 1024 * 1024;

/** Streams one file to /api/admin/upload, reporting progress. Resolves to the public URL. */
export function uploadFile(file: File, kind: UploadKind, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_BYTES) return reject(new Error(`${file.name} is larger than 200MB.`));
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams({ filename: file.name, kind });
    xhr.open("POST", `/api/admin/upload?${params}`);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let body: { url?: string; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body.url) resolve(body.url);
      else reject(new Error(body.error ?? `Upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(file);
  });
}

const isVideo = (url: string) => /\.(mp4|webm)$/i.test(url);

/**
 * Click-or-drop slot for a single file. Shows the current file as a preview with
 * a remove control; replacing uploads a new file and swaps the URL.
 */
export function MediaDrop({
  value,
  onChange,
  kind,
  prompt,
  className,
  compact,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  kind: UploadKind;
  prompt: string;
  className?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  async function handle(file: File | undefined) {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      onChange(await uploadFile(file, kind, setProgress));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-1.5">
      <div
        className={cn(
          "stripes-drop relative flex items-center justify-center overflow-hidden border border-dashed text-center transition-colors",
          over ? "border-green" : "border-white/24",
          className,
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files[0]);
        }}
      >
        {value &&
          (isVideo(value) ? (
            <video src={value} muted loop playsInline autoPlay className="absolute inset-0 size-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={cn("absolute inset-0 size-full", kind === "logo" ? "object-contain p-3" : "object-cover")} />
          ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className={cn(
            "relative z-10 flex size-full min-h-11 flex-col items-center justify-center gap-1.5 p-2.5 font-mono tracking-[0.08em] text-white/45 hover:text-white/80",
            compact ? "text-[9.5px]" : "text-[10.5px]",
            value && "bg-black/0 text-transparent hover:bg-black/55 hover:text-white focus-visible:bg-black/55 focus-visible:text-white",
          )}
        >
          {progress !== null ? (
            <span className="flex items-center gap-2 text-white">
              <LoaderCircle size={14} className="animate-spin" aria-hidden />
              UPLOADING {progress}%
            </span>
          ) : (
            <>
              {!compact && <Upload size={16} aria-hidden />}
              <span className="whitespace-pre-line">{value ? "CLICK OR DROP TO REPLACE" : prompt}</span>
            </>
          )}
        </button>

        {value && progress === null && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove file"
            className="absolute top-1.5 right-1.5 z-20 flex size-7 items-center justify-center bg-black/70 text-white hover:bg-black"
          >
            <X size={14} aria-hidden />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT[kind]}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </div>
      {error && (
        <p role="alert" className="text-[12.5px] text-[#FDA29B]">
          {error}
        </p>
      )}
    </div>
  );
}
