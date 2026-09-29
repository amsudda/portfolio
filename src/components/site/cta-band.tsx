import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { reveal } from "@/components/motion/reveal";
import { btn } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

export function CtaBand({
  title,
  showRateCard = false,
  compact = false,
}: {
  title: string;
  showRateCard?: boolean;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "bg-green px-gutter text-on-green-deep",
        compact ? "py-[clamp(44px,5vw,76px)]" : "py-[clamp(48px,6vw,84px)]",
      )}
    >
      <div className="container-site grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-7">
        <h2
          {...reveal()}
          className={cn(
            "max-w-[24ch] leading-[1.1] font-bold tracking-[-0.025em]",
            compact ? "text-[clamp(24px,2.8vw,38px)]" : "text-[clamp(26px,3vw,40px)]",
          )}
        >
          {title}
        </h2>
        <div {...reveal(1)} className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/contact" className={btn.ink}>
            Book a strategy call
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden />
          </Link>
          {showRateCard && (
            <Link href="/contact" className={btn.outlineOnGreen}>
              Download rate card
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
