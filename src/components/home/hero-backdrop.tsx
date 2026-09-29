"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Full-bleed hero background. Layers, bottom to top:
 * 1. an animated green aurora (always there, so the hero is never flat);
 * 2. the uploaded poster image, then the muted hero loop once it can play;
 * 3. a readability gradient, a faint grid and film grain.
 * The glass panels in the hero blur whatever sits underneath.
 */
export function HeroBackdrop({ src, poster }: { src: string | null; poster: string | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React doesn't server-render `muted`, which blocks native autoplay; set it here.
    video.muted = true;
    video.defaultMuted = true;
    if (video.readyState >= 2) setPlaying(true); // loadeddata may fire before hydration
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (reduce.matches ? video.pause() : video.play().catch(() => {}));
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, [src]);

  const hasMedia = Boolean(src || poster);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <span
          className="aurora-blob top-[-18%] right-[-6%] size-[min(62vw,760px)] bg-white/[0.13]"
          style={{ "--t": "24s", "--x1": "-10%", "--y1": "12%", "--x2": "6%", "--y2": "-6%" } as React.CSSProperties}
        />
        <span
          className="aurora-blob bottom-[-30%] left-[-12%] size-[min(60vw,720px)] bg-[oklch(0.48_0.13_150/0.28)]"
          style={{ "--t": "28s", "--x1": "12%", "--y1": "-10%", "--x2": "-4%", "--y2": "8%" } as React.CSSProperties}
        />
        <span
          className="aurora-blob top-[30%] right-[18%] size-[min(34vw,420px)] bg-white/[0.09]"
          style={{ "--t": "19s", "--x1": "-18%", "--y1": "14%", "--x2": "10%", "--y2": "-12%" } as React.CSSProperties}
        />
        <span
          className="aurora-blob top-[8%] left-[28%] size-[min(26vw,320px)] bg-[#9aa39c]/[0.12]"
          style={{ "--t": "31s", "--x1": "20%", "--y1": "18%", "--x2": "-14%", "--y2": "4%" } as React.CSSProperties}
        />
      </div>

      {hasMedia && (
        <div className="ken-burns absolute inset-0">
          {poster && (
            <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover blur-[2px]" />
          )}
          {src && (
            <video
              ref={ref}
              src={src}
              poster={poster ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setPlaying(true)}
              className={cn(
                "absolute inset-0 size-full object-cover blur-[2px] transition-opacity duration-1000",
                playing ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </div>
      )}

      {/* Readability: darker behind the text column and toward the stats strip. */}
      <div
        className={cn(
          "absolute inset-0",
          hasMedia
            ? "bg-[linear-gradient(100deg,rgba(10,11,10,0.86)_0%,rgba(10,11,10,0.55)_45%,rgba(10,11,10,0.35)_100%)]"
            : "bg-[linear-gradient(100deg,rgba(10,11,10,0.55)_0%,rgba(10,11,10,0.15)_60%)]",
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
      <div className="grain absolute inset-0 opacity-[0.07]" />
    </div>
  );
}
