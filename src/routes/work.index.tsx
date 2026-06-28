import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { projects, type ProjectCategory } from "@/data/projects";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — Aris Moreau / Studio" },
      {
        name: "description",
        content:
          "Selected video projects: brand films, commercials, documentaries, events, and social. Each piece presented as a full case study.",
      },
      { property: "og:title", content: "Work — Aris Moreau / Studio" },
      {
        property: "og:description",
        content:
          "Selected video projects: brand films, commercials, documentaries, events, and social. Each piece presented as a full case study.",
      },
      { property: "og:url", content: "/work" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkIndex,
});

const ALL = "All Work" as const;

function WorkIndex() {
  const categories = useMemo(() => {
    const set = new Set<ProjectCategory>();
    projects.forEach((p) => set.add(p.category));
    return [ALL, ...Array.from(set)] as const;
  }, []);

  const [active, setActive] = useState<(typeof categories)[number]>(ALL);

  const filtered = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="pt-40 pb-16 md:pt-52 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-fade-in">
            Work / Index
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-[-0.035em] animate-fade-up">
            A working archive
            <br />
            of <span className="italic text-primary">recent projects</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Filter by category. Open any project to read the full case — brief,
            approach, process, and result.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] z-30 border-y border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-6 py-4 md:px-10">
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-x-10 md:gap-y-24">
            {filtered.map((p, i) => (
              <div key={p.id} className={i % 3 === 0 ? "md:translate-y-12" : ""}>
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">No projects in this category yet.</p>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
