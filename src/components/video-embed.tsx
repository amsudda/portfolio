import { useState } from "react";
import { PlayIcon } from "./icons";

interface VideoEmbedProps {
  url?: string;
  aspect?: "16/9" | "9/16" | "1/1";
  poster?: { from: string; to: string; label?: string };
  caption?: string;
  className?: string;
}

/**
 * VideoEmbed
 * - Accepts a YouTube / Vimeo / generic URL.
 * - Renders a poster placeholder; only mounts the iframe on click (lazy).
 * - When no URL is provided, renders an empty placeholder with a "Coming soon" marker.
 */
export function VideoEmbed({
  url,
  aspect = "16/9",
  poster,
  caption,
  className = "",
}: VideoEmbedProps) {
  const [active, setActive] = useState(false);
  const embedUrl = url ? toEmbedUrl(url) : null;

  const aspectClass =
    aspect === "9/16" ? "aspect-[9/16]" : aspect === "1/1" ? "aspect-square" : "aspect-video";

  return (
    <figure className={className}>
      <div
        className={`group relative ${aspectClass} w-full overflow-hidden rounded-lg bg-surface`}
        style={
          poster
            ? {
                backgroundImage: `linear-gradient(135deg, ${poster.from}, ${poster.to})`,
              }
            : undefined
        }
      >
        {active && embedUrl ? (
          <iframe
            src={embedUrl}
            title={caption ?? "Video"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => embedUrl && setActive(true)}
            disabled={!embedUrl}
            aria-label={embedUrl ? "Play video" : "Video placeholder"}
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center transition-all duration-500 hover:scale-[1.01]"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span
              className={`relative grid place-items-center rounded-full border border-white/40 bg-black/30 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary/20 ${
                aspect === "9/16" ? "h-14 w-14" : "h-20 w-20"
              }`}
            >
              <PlayIcon className="h-6 w-6 translate-x-[1px] text-white" />
            </span>
            {!embedUrl && (
              <span className="relative mt-4 text-[10px] uppercase tracking-[0.3em] text-white/70">
                Video placeholder
              </span>
            )}
            {poster?.label && (
              <span className="absolute bottom-4 left-4 font-display text-sm tracking-wide text-white/80">
                {poster.label}
              </span>
            )}
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}?autoplay=1&rel=0`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  } catch {
    return url;
  }
}
