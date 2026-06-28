import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon } from "@/components/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aris Moreau — Videographer & Editor" },
      {
        name: "description",
        content:
          "A project-based portfolio. Brand films, commercials, documentaries, and event work shaped by a deliberate creative process.",
      },
      { property: "og:title", content: "Aris Moreau — Videographer & Editor" },
      {
        property: "og:description",
        content:
          "A project-based portfolio. Brand films, commercials, documentaries, and event work shaped by a deliberate creative process.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const CLIENTS = ["Northwind", "Halcyon Audio", "Atlas Foundation", "Meridian", "Field & Co.", "Verity"];

function HomePage() {
  const featured = projects.slice(0, 4);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative grain overflow-hidden pt-40 pb-24 md:pt-56 md:pb-32">
        {/* Ambient cinematic backdrop (showreel placeholder) */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 80% 20%, rgba(217,160,80,0.18) 0%, transparent 60%), radial-gradient(70% 70% at 10% 90%, rgba(60,90,140,0.18) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-fade-in">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Booking projects for Q3 — Q4 2026
          </div>

          <h1 className="mt-8 font-display text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-[-0.035em] animate-fade-up">
            Films that
            <br />
            <span className="italic text-primary">earn</span> attention.
          </h1>

          <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
              I'm Aris — a videographer and editor working in-house at a creative studio.
              Every piece here is a project, not a showreel cut: a brief, an approach,
              a process, and a result.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/work"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:gap-4"
              >
                View the work
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="link-underline text-sm uppercase tracking-[0.2em] text-foreground/80"
              >
                Start a project
              </Link>
            </div>
          </div>
        </div>

        {/* Marquee of client names — quiet trust signal */}
        <div className="mt-24 border-y border-border py-6">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 md:px-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Selected collaborators
            </span>
            {CLIENTS.map((c) => (
              <span key={c} className="font-display text-base text-foreground/60 md:text-lg">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-b border-border py-28 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-16 md:grid-cols-[1fr_1.6fr] md:gap-24">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                (01) Philosophy
              </p>
            </div>
            <div>
              <p className="font-display text-3xl leading-[1.15] tracking-tight text-balance md:text-5xl">
                A reel shows you what a film looks like.
                <span className="text-muted-foreground">
                  {" "}
                  A project shows you how the thinking holds up — the brief, the
                  decisions, the trade-offs, the result.
                </span>
              </p>
              <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Every piece on this site is presented as a case study. You'll see what
                the client needed, the creative direction we took, how it was made, and
                what it earned. The work is the proof; the process is the promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="(02) Selected Work"
              title={
                <>
                  Recent <span className="italic text-primary">projects</span>.
                </>
              }
            />
            <Link
              to="/work"
              className="link-underline text-sm uppercase tracking-[0.2em] text-foreground/80"
            >
              View all →
            </Link>
          </div>

          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-x-10 md:gap-y-24">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className={i % 3 === 0 ? "md:translate-y-12" : ""}
              >
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
