import { ArrowRight, Camera } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AssetFigure } from "@/components/site/asset-figure";
import { CtaBand } from "@/components/site/cta-band";
import { LegalFooter } from "@/components/site/footers";
import { SiteHeader } from "@/components/site/site-header";
import { StudioSpecCard } from "@/components/site/studio-spec";
import { Figure, MediaImage } from "@/components/ui/media";
import { btn, eyebrowDark, eyebrowLight } from "@/components/ui/styles";
import { portfolioStats, studioSpec } from "@/content/site";
import { clientShort, getPortfolioData } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Client base, campaign work and studio output — retainers, campaigns and production for brands across FMCG, property, hospitality, retail and services.",
  alternates: { canonical: "/portfolio" },
};

const h2 = "text-[clamp(26px,3.2vw,42px)] leading-[1.1] font-bold tracking-[-0.025em]";

export default async function PortfolioPage() {
  const { clients, projects, assets } = await getPortfolioData();
  const portraits = assets.filter((a) => a.ratio === "3:4" || a.ratio === "4:5").slice(0, 8);
  const wides = assets.filter((a) => a.ratio === "16:9" || a.ratio === "21:9").slice(0, 4);
  const squares = assets.filter((a) => a.ratio === "1:1").slice(0, 5);

  return (
    <div className="overflow-x-clip bg-paper text-ink">
      <SiteHeader
        current="portfolio"
        links={[
          { href: "#clients", label: "Clients" },
          { href: "#campaigns", label: "Campaigns" },
          { href: "#gallery", label: "Studio gallery" },
        ]}
      />
      <main>
        <section className="bg-ink px-gutter py-[clamp(48px,6vw,88px)] text-white">
          <div className="container-site">
            <p className={eyebrowDark}>PORTFOLIO</p>
            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-end gap-[clamp(28px,4vw,64px)]">
              <h1 className="max-w-[20ch] text-[clamp(34px,4.6vw,58px)] leading-[1.05] font-bold tracking-[-0.03em]">
                Client base, campaign work and studio output in one place.
              </h1>
              <p className="max-w-[44ch] text-[clamp(15.5px,1.2vw,18px)] leading-[1.65] text-white/68">
                Retainers, project campaigns and production for brands across FMCG, property, hospitality, retail and
                services. Every figure below comes from the client&apos;s own ad account or sales data.
              </p>
            </div>
            <dl className="mt-[clamp(40px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] border-t border-white/14">
              {portfolioStats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col-reverse py-6 pb-[26px] ${i === 0 ? "pr-6" : "px-6"} ${
                    i < portfolioStats.length - 1 ? "border-r border-white/10" : ""
                  }`}
                >
                  <dt className="mt-2 font-mono text-[11px] tracking-[0.12em] text-white/55">{s.label}</dt>
                  <dd className="font-display text-[clamp(28px,3vw,38px)] font-bold tracking-[-0.025em] text-green-bright">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="clients" className="px-gutter py-[clamp(56px,7vw,104px)]">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={eyebrowLight}>CLIENT BASE</p>
                <h2 className={`${h2} mt-3.5 max-w-[24ch]`}>Brands on retainer with us today.</h2>
              </div>
              <p className="font-mono text-[11px] tracking-[0.1em] text-caption">
                {clients.length} CLIENTS · {clients.filter((c) => c.engagement === "retainer").length} ON RETAINER
              </p>
            </div>
            <ul className="mt-[clamp(28px,3vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-px border border-line bg-line">
              {clients.map((c) => (
                <li key={c.id} className="grid gap-3.5 bg-white p-[22px]">
                  <div className="stripes-light relative h-11">
                    {c.logoUrl && (
                      <div className="absolute inset-0 bg-white">
                        <MediaImage src={c.logoUrl} alt={`${c.name} logo`} sizes="200px" className="!object-contain object-left" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-display text-[15.5px] font-semibold">{c.name}</p>
                    <p className="mt-[5px] font-mono text-[10px] tracking-[0.08em] text-caption uppercase">
                      {c.sector}
                      {c.sinceYear ? ` · SINCE ${c.sinceYear}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="campaigns" className="border-y border-line-soft bg-white px-gutter py-[clamp(56px,7vw,104px)]">
          <div className="container-site">
            <p className={eyebrowLight}>SELECTED CAMPAIGNS</p>
            <h2 className={`${h2} mt-3.5 max-w-[26ch]`}>
              {projects.length === 6 ? "Six campaigns" : "Campaigns"}, with the number that mattered to the client.
            </h2>
            <ul className="mt-[clamp(28px,3vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
              {projects.map((p) => {
                const metric = p.metrics[0];
                return (
                  <li key={p.id}>
                    <Link
                      href={`/work/${p.slug}`}
                      className="block h-full border border-line bg-paper text-ink transition-colors hover:border-ink"
                    >
                      <Figure
                        src={p.heroUrl}
                        ratio="4:3"
                        label="CAMPAIGN KEY VISUAL — 4:3"
                        sizes="(min-width: 1240px) 400px, (min-width: 761px) 45vw, 90vw"
                        variant="card"
                      />
                      <div className="p-5">
                        <p className="font-mono text-[10px] tracking-[0.1em] text-caption uppercase">
                          {p.tags || p.services.join(" · ")}
                        </p>
                        <h3 className="mt-2.5 text-lg font-semibold">
                          {[clientShort(p.client), p.title].filter(Boolean).join(" — ")}
                        </h3>
                        {metric && (
                          <p className="mt-[18px] flex items-baseline justify-between gap-3 border-t border-line-faint pt-3.5">
                            <span className="font-display text-2xl font-bold tracking-[-0.02em] text-green-deeper">
                              {metric.value}
                            </span>
                            <span className="text-right font-mono text-[10px] tracking-[0.08em] text-caption uppercase">
                              {metric.label}
                            </span>
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="gallery" className="px-gutter py-[clamp(56px,7vw,104px)]">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow flex items-center gap-2.5 text-green-deep">
                  <Camera size={15} aria-hidden />
                  IDEARIGS STUDIOS GALLERY
                </p>
                <h2 className={`${h2} mt-3.5 max-w-[24ch]`}>Photography and film from our own floor.</h2>
              </div>
              <Link href="/contact" className={btn.underline}>
                Book the studio
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
              </Link>
            </div>

            {portraits.length > 0 && (
              <div className="mt-[clamp(28px,3vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
                {portraits.map((a) => (
                  <AssetFigure key={a.id} asset={a} sizes="(min-width: 1240px) 300px, (min-width: 761px) 45vw, 90vw" />
                ))}
              </div>
            )}
            {wides.length > 0 && (
              <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-3.5">
                {wides.map((a) => (
                  <AssetFigure key={a.id} asset={a} sizes="(min-width: 1240px) 610px, (min-width: 761px) 50vw, 90vw" />
                ))}
              </div>
            )}
            <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
              {squares.map((a) => (
                <AssetFigure key={a.id} asset={a} sizes="(min-width: 1240px) 400px, (min-width: 761px) 33vw, 90vw" />
              ))}
              <StudioSpecCard ratio="1:1" rows={studioSpec.filter((r) => r.label !== "Cyc wall")} />
            </div>
          </div>
        </section>

        <CtaBand title="Want numbers like these on your own account?" compact />
      </main>
      <LegalFooter />
    </div>
  );
}
