import Link from "next/link";
import { growDelay, reveal } from "@/components/motion/reveal";
import { Figure } from "@/components/ui/media";
import { eyebrowLight } from "@/components/ui/styles";
import type { ProjectWithClient } from "@/lib/queries";

// The last three bars step up through green tints; the rest are neutral.
const TREND_TINTS = ["oklch(0.82 0.13 148)", "oklch(0.78 0.15 148)", "oklch(0.72 0.18 148)"];

function TrendBars({ values }: { values: number[] }) {
  const bars = values.slice(-8);
  const peak = Math.max(1, ...bars);
  const firstTint = bars.length - TREND_TINTS.length;
  return (
    <div aria-hidden className="flex h-[52px] items-end gap-[3px]">
      {bars.map((v, i) => (
        <div
          key={i}
          data-grow="y"
          className="flex-1"
          style={{
            ...growDelay(i, 60),
            height: `${Math.max(4, Math.round((v / peak) * 100))}%`,
            background: i >= firstTint ? TREND_TINTS[i - firstTint] : "var(--color-bar)",
          }}
        />
      ))}
    </div>
  );
}

export function CaseStudies({ projects }: { projects: ProjectWithClient[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="work" className="border-y border-line-soft bg-white px-gutter py-section">
      <div className="container-site">
        <div {...reveal()} className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className={eyebrowLight}>CASE STUDIES / SOCIAL MEDIA MANAGEMENT</p>
            <h2 className="h-section mt-4 max-w-[24ch]">Accounts we run, and what twelve months looked like.</h2>
          </div>
          <p className="font-mono text-[11.5px] tracking-[0.1em] text-caption">FIG. 01 — SEP 2025 → AUG 2026</p>
        </div>

        <div className="mt-[clamp(32px,4vw,52px)] grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-5">
          {projects.map((p, i) => (
            <article
              key={p.id}
              {...reveal(i, 110)}
              className="flex flex-col border border-line bg-paper hover:-translate-y-1 hover:border-ink hover:shadow-[0_18px_40px_rgba(10,11,10,0.08)]"
            >
              <Figure
                src={p.heroUrl}
                ratio="4:3"
                label="CAMPAIGN GRID — 4:3"
                sizes="(min-width: 1240px) 290px, (min-width: 761px) 45vw, 90vw"
                variant="card"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-2.5">
                  <h3 className="text-[17.5px] font-semibold">{p.client?.name ?? p.title}</h3>
                  {p.platforms && (
                    <span className="flex-none font-mono text-[10px] tracking-[0.1em] text-caption uppercase">
                      {p.platforms}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 mb-[18px] text-[14.5px] leading-[1.6] text-muted">{p.summary}</p>
                {p.trend.length > 0 && <TrendBars values={p.trend} />}
                {p.cardStats.length > 0 && (
                  <dl className="mt-[18px] grid grid-cols-3 gap-2.5 border-t border-line-faint pt-4">
                    {p.cardStats.slice(0, 3).map((s) => (
                      <div key={s.label} className="flex flex-col-reverse">
                        <dt className="mt-1 font-mono text-[9.5px] tracking-[0.08em] text-caption uppercase">{s.label}</dt>
                        <dd className="font-display text-xl font-bold tracking-[-0.02em]">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <Link
                  href={`/work/${p.slug}`}
                  className="mt-auto inline-flex w-fit items-center gap-2 border-b-2 border-green pt-[18px] pb-[3px] font-display text-[14.5px] font-semibold text-ink hover:text-green-deep"
                >
                  View case study <span aria-hidden>→</span>
                  <span className="sr-only">: {p.client?.name ?? p.title}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
