"use client";

import { Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { PublicClip } from "@/lib/queries";

/**
 * "Best work" player in the hero. Shows a muted preview loop of the first live
 * reel clip (reel order is set in Admin › Showreel); clicking opens a full-screen
 * player with sound, controls and the other clips.
 */
export function HeroReel({ clips, fallbackSrc }: { clips: PublicClip[]; fallbackSrc: string | null }) {
  const [open, setOpen] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Feature the first clip that has a file; fall back to the first clip / hero loop.
  const featuredIndex = Math.max(0, clips.findIndex((c) => c.src));
  const featured = clips[featuredIndex];
  const previewSrc = featured?.src ?? fallbackSrc;

  // Autoplay, muted. React doesn't server-render the `muted` attribute, so the
  // browser's own autoplay is blocked; set it on the element and start it here.
  // Also pause while scrolled out of view.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [previewSrc, paused]);

  return (
    <div className="glass relative rounded-[22px] p-2.5">
      <button
        type="button"
        onClick={() => setOpen(featuredIndex)}
        aria-label={featured ? `Play our best work: ${featured.title}` : "Play the showreel"}
        className="group stripes-video relative block aspect-video w-full overflow-hidden rounded-[16px] text-left"
      >
        {featured?.poster && (
          <Image src={featured.poster} alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
        )}
        {previewSrc && (
          <video
            ref={videoRef}
            key={previewSrc}
            src={previewSrc}
            poster={featured?.poster ?? undefined}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden
            data-testid="hero-reel-preview"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,11,10,0.35)_0%,rgba(10,11,10,0)_35%,rgba(10,11,10,0.8)_100%)]" />

        <span className="absolute top-3.5 left-3.5 flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-green" />
          BEST WORK · SHOWREEL 2026
        </span>

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="relative flex size-[clamp(64px,6vw,84px)] items-center justify-center rounded-full border border-white/30 bg-white/12 text-white backdrop-blur-xl transition-transform duration-300 group-hover:scale-110">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-white/25 [animation-duration:2.4s]" />
            <Play size={24} fill="currentColor" stroke="none" className="ml-1" aria-hidden />
          </span>
        </span>

        {featured && (
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <span className="font-display text-[clamp(15px,1.3vw,18px)] font-semibold text-white">{featured.title}</span>
            <span className="flex-none font-mono text-[10.5px] tracking-[0.1em] text-white/70 uppercase">
              {featured.duration} · {featured.category}
            </span>
          </span>
        )}
      </button>

      {previewSrc && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume preview" : "Pause preview"}
          aria-pressed={paused}
          className="absolute top-6 right-6 z-10 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
        >
          {paused ? <Play size={14} fill="currentColor" stroke="none" className="ml-0.5" aria-hidden /> : <Pause size={14} fill="currentColor" stroke="none" aria-hidden />}
        </button>
      )}

      {clips.length > 1 && (
        <ul className="mt-2.5 hidden grid-cols-3 gap-2.5 sm:grid" aria-label="More from the reel">
          {clips
            .map((c, i) => ({ c, i }))
            .filter(({ i }) => i !== featuredIndex)
            .slice(0, 3)
            .map(({ c, i }) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="w-full rounded-[12px] border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-colors hover:border-white/25 hover:bg-white/10"
              >
                <span className="block truncate text-[13px] font-medium text-white">{c.title}</span>
                <span className="mt-0.5 block font-mono text-[10px] tracking-[0.08em] text-white/50">{c.duration}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open !== null && <ReelLightbox clips={clips} fallbackSrc={fallbackSrc} start={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function ReelLightbox({
  clips,
  fallbackSrc,
  start,
  onClose,
}: {
  clips: PublicClip[];
  fallbackSrc: string | null;
  start: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(start);
  const [failed, setFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const clip = clips[idx];
  const src = clip ? clip.src : fallbackSrc;

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Showreel player"
      className="anim-fade-up fixed inset-0 z-90 flex flex-col items-center justify-center bg-[rgba(6,7,6,0.88)] px-4 py-16 backdrop-blur-xl [--d:0ms]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close player"
        className="absolute top-4 right-4 flex size-11 items-center justify-center border border-white/20 bg-white/8 text-white transition-colors hover:bg-white/16"
      >
        <X size={20} aria-hidden />
      </button>

      <div className="w-full max-w-[1100px]">
        <div className="relative aspect-video overflow-hidden rounded-[18px] border border-white/15 bg-black">
          {src && !failed ? (
            <video
              key={src}
              src={src}
              poster={clip?.poster ?? undefined}
              controls
              autoPlay
              playsInline
              onError={() => setFailed(true)}
              className="size-full object-contain"
            />
          ) : (
            <div className="stripes-video flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="font-display text-xl font-semibold text-white">{clip?.title ?? "Showreel 2026"}</p>
              <p className="font-mono text-[11px] tracking-[0.1em] text-white/60">
                THIS CUT ISN&apos;T AVAILABLE RIGHT NOW{clips.length > 1 ? " — TRY ANOTHER CLIP" : ""}
              </p>
            </div>
          )}
        </div>

        {clips.length > 1 && (
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {clips.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={i === idx}
                  onClick={() => {
                    setIdx(i);
                    setFailed(false);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[13px] transition-colors",
                    i === idx ? "border-white bg-white text-ink" : "border-white/20 text-white/80 hover:border-white/50 hover:text-white",
                  )}
                >
                  {c.title} <span className="ml-1 font-mono text-[11px] opacity-60">{c.duration}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}
