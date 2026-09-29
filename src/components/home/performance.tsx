import { TrendingDown, TrendingUp } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { growDelay, reveal } from "@/components/motion/reveal";
import { eyebrowDark } from "@/components/ui/styles";
import { performanceDeltas, site, splitLabels } from "@/content/site";
import { fmt, formatFixed, formatInt } from "@/lib/format";
import { SPLIT_KEYS, type Performance as PerformanceData } from "@/lib/metrics";

type Row = { id: string; account: string; spend: number; roas: number; cpc: number; cvr: number };

// First four months stay neutral; the last four brighten through the greens.
const BAR_COLORS = [
  "rgba(255,255,255,0.18)",
  "rgba(255,255,255,0.18)",
  "rgba(255,255,255,0.18)",
  "rgba(255,255,255,0.18)",
  "oklch(0.6 0.16 148)",
  "oklch(0.66 0.17 148)",
  "oklch(0.72 0.18 148)",
  "oklch(0.78 0.18 148)",
];

export function Performance({
  performance: p,
  rows,
  showBreakdown,
}: {
  performance: PerformanceData;
  rows: Row[];
  showBreakdown: boolean;
}) {
  const dash = "—";
  const stats = [
    { label: "BLENDED ROAS", value: p.hasData ? fmt.roas(p.roas) : dash, delta: performanceDeltas.roas },
    { label: "AVG. CPC", value: p.hasData ? fmt.lkr(p.cpc) : dash, delta: performanceDeltas.cpc },
    { label: "CONVERSION RATE", value: p.hasData ? fmt.pct(p.cvr) : dash, delta: performanceDeltas.cvr },
    { label: "COST PER PURCHASE", value: p.hasData ? fmt.lkr(p.costPerPurchase, 0) : dash, delta: performanceDeltas.cpp },
  ];

  return (
    <section id="ads" className="relative overflow-hidden bg-ink px-gutter py-section text-white">
      <div aria-hidden className="backdrop-texture pointer-events-none absolute inset-0" />
      <div className="container-site relative">
        <div {...reveal()} className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className={eyebrowDark}>PERFORMANCE / FACEBOOK ADS</p>
            <h2 className="h-section mt-4 max-w-[24ch]">Media buying we report on, not around.</h2>
          </div>
          <p className="max-w-[38ch] text-[15px] leading-[1.6] text-white/60">
            Aggregate account performance across 19 active advertisers, twelve months to August 2026. Figures are pulled
            from Meta Ads Manager and reconciled against client sales data.
          </p>
        </div>

        <dl className="mt-[clamp(32px,4vw,52px)] grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px border border-white/14 bg-white/14">
          {stats.map((s, i) => {
            const Icon = s.delta.direction === "up" ? TrendingUp : TrendingDown;
            return (
              <div
                key={s.label}
                {...reveal(i)}
                className="flex flex-col bg-white/7 transition-colors hover:bg-white/11 px-6 pt-[26px] pb-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[24px] backdrop-saturate-[1.6]"
              >
                <dt className="font-mono text-[10.5px] tracking-[0.12em] text-white/50">{s.label}</dt>
                <dd className="mt-3 font-display text-[clamp(34px,3.6vw,46px)] font-bold tracking-[-0.03em]">
                  <CountUp value={s.value} />
                </dd>
                <dd className="mt-2.5 flex items-center gap-1.5 font-mono text-[11.5px] text-green-bright">
                  <Icon size={14} strokeWidth={2.4} aria-hidden />
                  {s.delta.text}
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-[clamp(28px,3vw,40px)] grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[clamp(24px,3vw,40px)]">
          <figure {...reveal()} className="glass m-0 rounded-[18px] p-[clamp(22px,3vw,32px)]">
            <figcaption className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">Monthly blended ROAS</h3>
              <span className="font-mono text-[10.5px] tracking-[0.1em] text-white/45">TARGET 3.5x</span>
            </figcaption>
            <div
              role="img"
              aria-label={`Monthly blended ROAS: ${p.monthly
                .map((m) => `${m.label} ${m.value === null ? "no data" : formatFixed(m.value, 1)}`)
                .join(", ")}`}
              className="mt-7 flex h-[200px] items-end gap-[clamp(6px,1.2vw,14px)] border-b border-white/14"
            >
              {p.monthly.map((m, i) => (
                <div key={m.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <span
                    className={`text-center font-mono text-[10px] ${i === p.monthly.length - 1 ? "text-white" : "text-white/55"}`}
                  >
                    {m.value === null ? "—" : formatFixed(m.value, 1)}
                  </span>
                  <div data-grow="y" style={{ ...growDelay(i, 80), height: `${m.heightPct}%`, background: BAR_COLORS[i] }} />
                </div>
              ))}
            </div>
            <div aria-hidden className="mt-2.5 flex gap-[clamp(6px,1.2vw,14px)]">
              {p.monthly.map((m) => (
                <span key={m.label} className="flex-1 text-center font-mono text-[10px] text-white/45">
                  {m.label}
                </span>
              ))}
            </div>
          </figure>

          <div {...reveal(1)} className="glass rounded-[18px] p-[clamp(22px,3vw,32px)]">
            <h3 className="text-lg font-semibold">Spend allocation by objective</h3>
            <ul className="mt-[26px] grid gap-5">
              {SPLIT_KEYS.map((k, i) => (
                <li key={k}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{splitLabels[k]}</span>
                    <span className="font-mono text-green-bright">{p.split[k]}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={splitLabels[k]}
                    aria-valuenow={p.split[k]}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-2 bg-white/12"
                  >
                    <div data-grow="x" className="h-full bg-green" style={{ ...growDelay(i, 120), width: `${p.split[k]}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-[26px] border-t border-white/14 pt-[18px] text-sm leading-[1.6] text-white/60">
              Budgets are rebalanced fortnightly. Creative refreshes are produced by {site.partnerStudio}, so fatigue is
              handled with new assets rather than higher bids.
            </p>
          </div>
        </div>

        {showBreakdown && rows.length > 0 && (
          <div {...reveal()} className="glass mt-[clamp(28px,3vw,40px)] overflow-x-auto rounded-[18px]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Published ad account breakdown</caption>
              <thead>
                <tr className="border-b border-white/14 font-mono text-[10.5px] tracking-[0.12em] text-white/50">
                  {["ACCOUNT", "SPEND (LKR)", "ROAS", "CPC", "CONV. RATE"].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`py-4 font-normal ${i === 0 ? "w-[33%] pl-[clamp(18px,2.5vw,28px)]" : "pl-4"} ${
                        i === 4 ? "pr-[clamp(18px,2.5vw,28px)]" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[14.5px]">
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/8 transition-colors last:border-b-0 hover:bg-white/5">
                    <th scope="row" className="py-[18px] pl-[clamp(18px,2.5vw,28px)] font-normal">
                      {r.account}
                    </th>
                    <td className="pl-4 font-mono">{formatInt(r.spend)}</td>
                    <td className="pl-4 font-mono text-green-bright">{formatFixed(r.roas, 1)}x</td>
                    <td className="pl-4 font-mono">{formatFixed(r.cpc, 2)}</td>
                    <td className="pr-[clamp(18px,2.5vw,28px)] pl-4 font-mono">{formatFixed(r.cvr, 1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
