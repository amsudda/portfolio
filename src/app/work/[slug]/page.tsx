import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalFooter } from "@/components/site/footers";
import { CaseStudyJsonLd } from "@/components/site/json-ld";
import { SiteHeader } from "@/components/site/site-header";
import { Figure } from "@/components/ui/media";
import { button, eyebrowLight } from "@/components/ui/styles";
import { site } from "@/content/site";
import { getCaseStudy, getPublishedSlugs } from "@/lib/queries";

export const revalidate = 300;
// Case studies published after the build are rendered on first request.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPublishedSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getCaseStudy(slug);
  if (!data) return { title: "Case study not found" };
  const { project: p } = data;
  const title = p.client ? `${p.client.name} — ${p.title}` : p.title;
  const description = p.intro || p.summary;
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title, description, type: "article", images: p.heroUrl ? [p.heroUrl] : undefined },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const data = await getCaseStudy(slug);
  if (!data) notFound();
  const { project: p, number, next } = data;

  const facts = [
    { label: "CLIENT", value: p.client?.name },
    { label: "SECTOR", value: p.sectorDetail || p.sector },
    { label: "ENGAGEMENT", value: p.engagementPeriod },
    { label: "SCOPE", value: p.scope || p.services.join(", ") },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  const keyMetrics = p.keyMetrics.length ? p.keyMetrics : p.metrics;
  const problem = p.problem.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const approach = p.approach.filter((s) => s.title || s.body);

  return (
    <div className="overflow-x-clip bg-paper text-ink">
      <CaseStudyJsonLd title={p.headline || p.title} description={p.intro || p.summary} url={`${site.url}/work/${p.slug}`} />
      <SiteHeader
        current="work"
        links={[
          { href: "/#partnership", label: "Partnership" },
          { href: "/#ads", label: "Performance" },
          { href: "/portfolio", label: "Gallery" },
        ]}
      />
      <main>
        <section className="bg-ink px-gutter pt-[clamp(40px,5vw,72px)] text-white">
          <div className="container-site">
            <nav aria-label="Breadcrumb" className="font-mono text-[11.5px] tracking-[0.14em] text-white/50">
              <Link href="/portfolio#campaigns" className="text-white/50 hover:text-green-bright">
                WORK
              </Link>{" "}
              / CASE STUDY {String(number).padStart(2, "0")}
            </nav>
            <h1 className="mt-[22px] max-w-[20ch] text-[clamp(34px,4.8vw,62px)] leading-[1.04] font-bold tracking-[-0.03em]">
              {p.headline || p.title}
            </h1>
            {(p.intro || p.summary) && (
              <p className="mt-[22px] max-w-[52ch] text-[clamp(16px,1.2vw,18px)] leading-[1.65] text-white/68">
                {p.intro || p.summary}
              </p>
            )}
            {facts.length > 0 && (
              <dl className="mt-[clamp(36px,4vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px border border-white/14 bg-white/14">
                {facts.map((f) => (
                  <div key={f.label} className="bg-ink px-[22px] py-5">
                    <dt className="font-mono text-[10.5px] tracking-[0.12em] text-white/45">{f.label}</dt>
                    <dd className="mt-2.5 text-[15.5px]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="h-[clamp(36px,4vw,56px)]" />
          </div>
        </section>

        <section className="bg-[linear-gradient(#0A0B0A_50%,#FAFAF8_50%)] px-gutter">
          <div className="container-site">
            <Figure
              src={p.heroUrl}
              ratio="16:9"
              label="HERO IMAGE — 16:9 · KEY CAMPAIGN VISUAL"
              sizes="(min-width: 1240px) 1240px, 100vw"
              priority
            />
          </div>
        </section>

        <section className="px-gutter py-[clamp(48px,6vw,88px)]">
          <div className="container-site">
            {keyMetrics.length > 0 && (
              <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px border border-line bg-line">
                {keyMetrics.map((m) => (
                  <div key={m.label} className="flex flex-col-reverse bg-white p-6">
                    <dt className="mt-2 font-mono text-[10.5px] tracking-[0.1em] text-caption uppercase">{m.label}</dt>
                    <dd className="font-display text-[clamp(28px,3vw,38px)] font-bold tracking-[-0.025em] text-green-deeper">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {(problem.length > 0 || approach.length > 0) && (
              <div className="mt-[clamp(44px,5vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-[clamp(28px,4vw,56px)]">
                {problem.length > 0 && (
                  <div>
                    <h2 className="text-[clamp(22px,2.2vw,30px)] leading-[1.15] font-bold tracking-[-0.02em]">
                      The problem
                    </h2>
                    {problem.map((para, i) => (
                      <p key={i} className={`${i === 0 ? "mt-4" : "mt-3.5"} text-base leading-[1.7] text-body`}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
                {approach.length > 0 && (
                  <div>
                    <h2 className="text-[clamp(22px,2.2vw,30px)] leading-[1.15] font-bold tracking-[-0.02em]">
                      What we did
                    </h2>
                    <ol className="mt-[18px] grid gap-[18px]">
                      {approach.map((step, i) => (
                        <li key={i} className="flex gap-3.5">
                          <span className="pt-[3px] font-mono text-[11.5px] text-green-deep">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3 className="text-[16.5px] font-semibold">{step.title}</h3>
                            <p className="mt-1.5 text-[15px] leading-[1.6] text-muted">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {(p.gallery.length > 0 || p.quote) && (
          <section className="px-gutter pb-[clamp(48px,6vw,88px)]">
            <div className="container-site">
              {p.gallery.length > 0 && (
                <>
                  <h2 className={eyebrowLight}>DELIVERED ASSETS</h2>
                  <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
                    {p.gallery.map((g, i) => (
                      <Figure
                        key={i}
                        src={g.url}
                        ratio="4:5"
                        label={`${(g.label || "Asset").toUpperCase()} — 4:5`}
                        caption={g.caption}
                        sizes="(min-width: 1240px) 300px, (min-width: 761px) 45vw, 90vw"
                      />
                    ))}
                  </div>
                </>
              )}
              {p.quote && (
                <figure className="mt-6 border border-l-4 border-line border-l-green bg-white p-[clamp(24px,3vw,40px)]">
                  <blockquote className="max-w-[60ch] font-display text-[clamp(17px,1.7vw,22px)] leading-[1.55] font-medium tracking-[-0.01em]">
                    “{p.quote}”
                  </blockquote>
                  {p.quoteAttribution && (
                    <figcaption className="mt-5 font-mono text-[11px] tracking-[0.1em] text-caption uppercase">
                      {p.quoteAttribution}
                    </figcaption>
                  )}
                </figure>
              )}
            </div>
          </section>
        )}

        <section className="bg-ink px-gutter py-[clamp(40px,5vw,64px)] text-white">
          <div className="container-site flex flex-wrap items-center justify-between gap-5">
            {next ? (
              <Link href={`/work/${next.slug}`} className="group">
                <p className="font-mono text-[11px] tracking-[0.14em] text-white/45">NEXT CASE STUDY</p>
                <p className="mt-2.5 font-display text-[clamp(22px,2.4vw,32px)] font-bold tracking-[-0.02em] group-hover:text-green-bright">
                  {next.client?.name ?? next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            <div className="flex flex-wrap gap-3">
              <Link href="/portfolio#campaigns" className={button("outlineDark", "md")}>
                All work
              </Link>
              <Link href="/contact" className={button("primary", "md")}>
                Start a project
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LegalFooter bordered />
    </div>
  );
}
