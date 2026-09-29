import Image from "next/image";
import { cn } from "@/lib/cn";

const RATIO_CLASS = {
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "4:5": "aspect-[4/5]",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "21:9": "aspect-[21/9]",
} as const;

export type Ratio = keyof typeof RATIO_CLASS;

export function ratioClass(ratio: string): string {
  return RATIO_CLASS[ratio as Ratio] ?? "aspect-[4/3]";
}

/** Fills its (relatively positioned) parent. SVGs skip the optimiser. */
export function MediaImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      className={cn("object-cover", className)}
    />
  );
}

/**
 * Light striped slot with a mono caption. Shows the real image once one is uploaded.
 */
export function Figure({
  src,
  ratio,
  label,
  caption,
  sizes,
  variant = "figure",
  className,
  priority,
}: {
  src?: string | null;
  ratio: string;
  label: string;
  caption?: string;
  sizes: string;
  variant?: "figure" | "card";
  className?: string;
  priority?: boolean;
}) {
  const hasMedia = Boolean(src);
  return (
    <figure
      className={cn(
        "relative m-0 flex flex-col justify-end overflow-hidden",
        variant === "figure" ? "stripes-figure border border-line p-4" : "stripes-light p-3.5",
        ratioClass(ratio),
        className,
      )}
    >
      {hasMedia && (
        <>
          <MediaImage src={src!} alt={caption || label} sizes={sizes} priority={priority} />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        </>
      )}
      <figcaption
        className={cn(
          "relative font-mono text-[10.5px] leading-[1.6] tracking-[0.08em]",
          hasMedia ? "text-white/75" : variant === "figure" ? "text-caption-dark" : "text-caption",
        )}
      >
        {hasMedia ? null : label}
        {caption && (
          <>
            {!hasMedia && <br />}
            <span className={hasMedia ? "text-white" : "text-ink"}>{caption}</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
