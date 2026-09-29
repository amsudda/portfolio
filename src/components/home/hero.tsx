import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/motion/count-up";
import { Spotlight } from "@/components/motion/spotlight";
import { btn, button } from "@/components/ui/styles";
import { company, site, trustStats } from "@/content/site";
import { cn } from "@/lib/cn";
import type { PublicClip } from "@/lib/queries";
import { HeroBackdrop } from "./hero-backdrop";
import { HeroReel } from "./hero-reel";

const HEADLINE = "Digital management and full-scale production, under one contract.";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero({
  heroLoopUrl,
  heroPosterUrl,
  showTrustBar,
  clips,
}: {
  heroLoopUrl: string | null;
  heroPosterUrl: string | null;
  showTrustBar: boolean;
  clips: PublicClip[];
}) {
  const words = HEADLINE.split(" ");
  const afterHeadline = 150 + words.length * 55;

  return (
    <section id="top" className="relative isolate flex min-h-[min(calc(100svh-68px),980px)] flex-col overflow-hidden text-white">
      <HeroBackdrop src={heroLoopUrl} poster={heroPosterUrl} />

      <div className="container-site px-gutter relative flex w-full flex-1 flex-col justify-center pt-[clamp(32px,5vw,72px)] pb-[clamp(28px,4vw,56px)]">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-8">
          <Spotlight className="anim-fade-up rounded-[24px] p-[clamp(24px,3vw,40px)]">
            <p className="eyebrow anim-fade-up flex items-center gap-3 text-green-bright" style={delay(80)}>
              <span aria-hidden className="block h-px w-[22px] bg-green" />
              {company.locality.toUpperCase()} · SINCE {site.foundedYear}
            </p>

            <h1
              aria-label={HEADLINE}
              className="mt-5 text-[clamp(34px,3.5vw,54px)] leading-[1.05] font-bold tracking-[-0.035em]"
            >
              {words.map((w, i) => (
                <span key={i} aria-hidden="true">
                  <span className="word-mask">
                    <span style={delay(150 + i * 55)}>{w}</span>
                  </span>{" "}
                </span>
              ))}
            </h1>

            <p
              className="anim-fade-up mt-5 max-w-[40ch] text-[clamp(15.5px,1.25vw,18px)] leading-[1.6] text-white/70"
              style={delay(afterHeadline)}
            >
              Social, paid media and in-house production for Sri Lankan brands — one accountable team.
            </p>

            <div className="anim-fade-up mt-7 flex flex-wrap gap-3" style={delay(afterHeadline + 120)}>
              <Link href="/contact" className={cn(btn.primary, "group")}>
                Book a strategy call
                <ArrowRight size={17} strokeWidth={2.2} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="#ads"
                className={cn(button("outlineDark"), "border-white/20 bg-white/6 backdrop-blur-md hover:border-white/50 hover:bg-white/12")}
              >
                See performance data
              </Link>
            </div>
          </Spotlight>

          <div className="anim-fade-up" style={delay(afterHeadline + 200)}>
            <HeroReel clips={clips} fallbackSrc={heroLoopUrl} />
          </div>
        </div>

        {showTrustBar && (
          <dl
            className="glass anim-fade-up mt-[clamp(20px,2.6vw,32px)] grid grid-cols-2 overflow-hidden rounded-[20px] md:grid-cols-4"
            style={delay(afterHeadline + 320)}
          >
            {trustStats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex flex-col-reverse px-[clamp(16px,2.2vw,28px)] py-[clamp(14px,1.8vw,22px)]",
                  i % 2 === 0 && "border-r border-white/10",
                  i === 1 && "md:border-r md:border-white/10",
                  i < 2 && "border-b border-white/10 md:border-b-0",
                )}
              >
                <dt className="mt-1.5 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-white/55">
                  <span aria-hidden className="size-1 rounded-full bg-green" />
                  {s.label}
                </dt>
                <dd className="font-display text-[clamp(24px,2.4vw,34px)] font-bold tracking-[-0.02em] text-white">
                  <CountUp value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
