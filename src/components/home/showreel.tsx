"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { reveal } from "@/components/motion/reveal";
import { eyebrowDark } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { PublicClip } from "@/lib/queries";

const UNAVAILABLE = "THIS CUT ISN'T AVAILABLE RIGHT NOW — TRY ANOTHER CLIP";

export function Showreel({ clips }: { clips: PublicClip[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const clip = clips[idx];

  function start(i: number) {
    const next = clips[i];
    setIdx(i);
    setPlaying(false);
    setError("");
    const v = videoRef.current;
    if (!v || !next) return;
    if (!next.src) {
      v.removeAttribute("src");
      v.load();
      setError(UNAVAILABLE);
      return;
    }
    v.src = next.src;
    v.load();
    v.play().catch(() => {
      // Autoplay refusals surface via the error event or leave the poster up.
    });
  }

  return (
    <section id="reel" className="relative overflow-hidden bg-ink px-gutter py-[clamp(56px,7vw,104px)] text-white">
      <div aria-hidden className="backdrop-texture-reel pointer-events-none absolute inset-0" />
      <div className="container-site relative">
        <div {...reveal()} className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className={eyebrowDark}>SHOWREEL / MOTION</p>
            <h2 className="h-section mt-4 max-w-[22ch]">Motion is where the studio earns its keep.</h2>
          </div>
          <p className="max-w-[36ch] text-[15px] leading-[1.6] text-white/60">
            {clips.length > 0
              ? `${clips.length === 4 ? "Four" : clips.length} recent cut${clips.length === 1 ? "" : "s"}, shot and graded in-house. Pick a clip to play it.`
              : "New cuts are being graded in-house. Check back shortly."}
          </p>
        </div>

        <div
          {...reveal(1)}
          className="relative mt-[clamp(28px,3vw,44px)] aspect-video overflow-hidden rounded-[20px] border border-white/16 bg-[repeating-linear-gradient(135deg,#141514_0_10px,#101110_10px_20px)]">
          <video
            ref={videoRef}
            controls={playing}
            playsInline
            preload="none"
            onPlaying={() => {
              setPlaying(true);
              setError("");
            }}
            onError={() => {
              if (videoRef.current?.getAttribute("src")) {
                setPlaying(false);
                setError(UNAVAILABLE);
              }
            }}
            className="absolute inset-0 size-full object-cover"
          />

          {!playing && (
            <div className="stripes-video absolute inset-0 flex flex-col items-center justify-center gap-5">
              {clip?.poster && (
                <>
                  <Image src={clip.poster} alt="" fill sizes="(min-width: 1240px) 1240px, 100vw" className="object-cover" />
                  <span aria-hidden className="absolute inset-0 bg-black/45" />
                </>
              )}
              <button
                type="button"
                onClick={() => start(idx)}
                disabled={!clip}
                aria-label={clip ? `Play ${clip.title}` : "Showreel coming soon"}
                className="glass relative flex size-[clamp(72px,7vw,92px)] items-center justify-center rounded-full text-white transition-colors hover:bg-white/18 disabled:opacity-60"
              >
                <Play size={26} fill="currentColor" stroke="none" className="ml-1" aria-hidden />
              </button>
              <div className="relative px-5 text-center">
                <p className="font-display text-[clamp(16px,1.8vw,22px)] font-semibold">
                  {clip?.title ?? "Showreel 2026"}
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-white/60">
                  {clip ? `${clip.duration} · 6K · GRADED IN-HOUSE` : "COMING SOON"}
                </p>
                {error && (
                  <p role="status" className="mt-3.5 font-mono text-[10.5px] tracking-[0.08em] text-green-bright">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {clips.length > 0 && (
          <ul className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
            {clips.map((c, i) => (
              <li key={c.id} {...reveal(i)}>
                <button
                  type="button"
                  onClick={() => start(i)}
                  aria-pressed={i === idx}
                  className={cn(
                    "glass grid w-full gap-3 rounded-[14px] p-3 text-left text-white transition-[background-color,translate,border-color] duration-300 hover:-translate-y-1 hover:bg-white/13",
                    i === idx && "border-green/70",
                  )}
                >
                  <div className="stripes-dark relative aspect-video overflow-hidden rounded-[9px]">
                    {c.poster && <Image src={c.poster} alt="" fill sizes="300px" className="object-cover" />}
                  </div>
                  <div>
                    <p className="font-display text-[14.5px] font-semibold">{c.title}</p>
                    <p className="mt-[5px] font-mono text-[10.5px] text-white/55 uppercase">
                      {c.duration} · {c.category}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
