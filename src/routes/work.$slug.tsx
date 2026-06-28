import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getAdjacentProjects, getProjectBySlug, type MediaBlock, type Project } from "@/data/projects";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VideoEmbed } from "@/components/video-embed";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.project;
    const title = p ? `${p.title} — ${p.client}` : "Project";
    const description = p?.hook ?? "Case study";
    return {
      meta: [
        { title: `${title} / Aris Moreau` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/work/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/work/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-5xl">Project not found</h1>
          <Link to="/work" className="link-underline mt-6 inline-block text-sm uppercase tracking-[0.2em] text-primary">
            ← Back to work
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <button onClick={reset} className="mt-6 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em]">
            Try again
          </button>
        </div>
      </div>
      <SiteFooter />
    </div>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const { prev, next } = getAdjacentProjects(project.slug);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <article>
        <header className="pt-40 pb-12 md:pt-52 md:pb-16">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Link
              to="/work"
              className="link-underline mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              All Work
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">{project.category}</span>
              <span>{project.client}</span>
              <span aria-hidden>·</span>
              <span>{project.year}</span>
            </div>

            <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.92] tracking-[-0.035em] animate-fade-up text-balance">
              {project.title}
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
              {project.hook}
            </p>
          </div>
        </header>

        {/* Hero video */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <VideoEmbed url={project.heroVideoUrl} poster={project.thumbnail} aspect="16/9" />
        </div>

        {/* Meta strip */}
        <div className="border-y border-border mt-20 md:mt-28">
          <div className="mx-auto grid max-w-[1400px] gap-y-8 px-6 py-10 md:grid-cols-4 md:gap-x-10 md:px-10">
            <MetaCell label="Client" value={project.client} />
            <MetaCell label="Role" value={project.role} />
            <MetaCell label="Year" value={String(project.year)} />
            <MetaCell label="Deliverables" value={project.deliverables.join(" / ")} />
          </div>
        </div>

        {/* Brief */}
        <Section label="(01) The Brief" heading="What the client needed.">
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
            {project.brief}
          </p>
        </Section>

        {/* Approach */}
        <Section label="(02) Our Approach" heading="Creative direction.">
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
            {project.approach}
          </p>
        </Section>

        {/* Process */}
        <Section label="(03) Process" heading="Inside the work.">
          <div className="grid gap-12">
            {project.process.map((block, i) => (
              <ProcessBlock key={i} block={block} posterFallback={project.thumbnail} />
            ))}
          </div>
        </Section>

        {/* Result */}
        <Section label="(04) Result" heading="What it earned.">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
              {project.result}
            </p>
            {project.metric && (
              <div className="rounded-lg border border-border bg-surface p-8">
                <p className="font-display text-6xl tracking-tight text-primary md:text-7xl">
                  {project.metric.value}
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  {project.metric.label}
                </p>
              </div>
            )}
          </div>

          {project.testimonial && (
            <blockquote className="mt-20 border-l-2 border-primary pl-6 md:pl-10">
              <p className="font-display text-2xl leading-snug tracking-tight md:text-4xl text-balance">
                "{project.testimonial.quote}"
              </p>
              <footer className="mt-6 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                — {project.testimonial.author}
                {project.testimonial.role && <span className="opacity-60"> / {project.testimonial.role}</span>}
              </footer>
            </blockquote>
          )}
        </Section>

        {/* Next / Prev */}
        <nav className="border-t border-border mt-12 py-20 md:py-28">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 md:grid-cols-2 md:px-10">
            {prev && (
              <Link to="/work/$slug" params={{ slug: prev.slug }} className="group block">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  ← Previous project
                </p>
                <p className="mt-3 font-display text-3xl tracking-tight transition-colors group-hover:text-primary md:text-4xl">
                  {prev.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{prev.client} · {prev.year}</p>
              </Link>
            )}
            {next && (
              <Link
                to="/work/$slug"
                params={{ slug: next.slug }}
                className="group block md:text-right"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Next project →
                </p>
                <p className="mt-3 font-display text-3xl tracking-tight transition-colors group-hover:text-primary md:text-4xl">
                  {next.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{next.client} · {next.year}</p>
              </Link>
            )}
          </div>
        </nav>

        {/* CTA back to contact */}
        <div className="border-t border-border py-24 text-center md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-display text-4xl tracking-tight text-balance md:text-6xl">
              Have a project that needs this kind of attention?
            </h2>
            <Link
              to="/contact"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:gap-4"
            >
              Start a conversation
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-lg leading-snug tracking-tight">{value}</p>
    </div>
  );
}

function Section({
  label,
  heading,
  children,
}: {
  label: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_2.2fr] md:gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
            <h2 className="mt-4 font-display text-3xl leading-[1.05] tracking-tight md:text-5xl text-balance">
              {heading}
            </h2>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

function ProcessBlock({
  block,
  posterFallback,
}: {
  block: import("@/data/projects").MediaBlock;
  posterFallback: { from: string; to: string; label?: string };
}) {
  if (block.type === "text") {
    return (
      <div>
        {block.heading && (
          <h3 className="font-display text-2xl tracking-tight md:text-3xl">{block.heading}</h3>
        )}
        <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
          {block.body}
        </p>
      </div>
    );
  }
  if (block.type === "video") {
    return (
      <VideoEmbed
        url={block.url}
        aspect={block.aspect ?? "16/9"}
        poster={posterFallback}
        caption={block.caption}
        className={block.aspect === "9/16" ? "max-w-sm" : ""}
      />
    );
  }
  if (block.type === "image") {
    return (
      <figure>
        <img src={block.src} alt={block.alt} loading="lazy" className="w-full rounded-lg" />
        {block.caption && (
          <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="border-l-2 border-primary pl-6">
        <p className="font-display text-2xl leading-snug tracking-tight md:text-3xl text-balance">
          "{block.text}"
        </p>
        {block.attribution && (
          <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            — {block.attribution}
          </footer>
        )}
      </blockquote>
    );
  }
  return null;
}
