import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRightIcon } from "@/components/icons";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aris Moreau / Studio" },
      {
        name: "description",
        content:
          "Videographer and editor working in-house at a creative studio. A short note on philosophy, services, and process.",
      },
      { property: "og:title", content: "About — Aris Moreau / Studio" },
      {
        property: "og:description",
        content:
          "Videographer and editor working in-house at a creative studio. A short note on philosophy, services, and process.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const SERVICES = [
  { title: "Videography", body: "Direction, cinematography, and on-set producing — single-camera to small unit." },
  { title: "Editing", body: "Long-form, brand films, and rapid social cutdowns. Story first, technique second." },
  { title: "Color", body: "Resolve grading with custom LUTs built per project. Skin tones held, mood pushed." },
  { title: "Motion", body: "Type, lower-thirds, and end-card work that supports the cut without competing with it." },
];

const PROCESS = [
  { step: "01", title: "Discovery", body: "We start with the brief and the audience. What does success look like? Who is this actually for?" },
  { step: "02", title: "Direction", body: "A short treatment with references, tone, and a shot logic. Approved before we touch a camera." },
  { step: "03", title: "Production", body: "Small, deliberate crews. We protect the schedule and the subject in equal measure." },
  { step: "04", title: "Post", body: "An edit room you're welcome in. Two structured rounds of notes, plus polish." },
  { step: "05", title: "Delivery", body: "Master plus every cutdown the brief needs — vertical, square, captioned, framed for spec." },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="pt-40 pb-24 md:pt-56 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-fade-in">
            About
          </p>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.75rem,8vw,8rem)] leading-[0.95] tracking-[-0.035em] animate-fade-up text-balance">
            I make films the way
            <br />
            <span className="italic text-primary">a writer drafts</span> — slowly, then all at once.
          </h1>
        </div>
      </section>

      {/* Bio */}
      <section className="border-y border-border py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">(01) Bio</p>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-foreground/90 md:text-xl text-pretty">
              <p>
                I'm Aris Moreau, a videographer and editor working in-house at a creative
                studio. I've spent the last seven years making brand films, documentaries,
                and commercial work for clients who care more about the second viewing than
                the first.
              </p>
              <p className="text-muted-foreground">
                My background is in editorial — which is to say I learned to cut before I
                learned to shoot, and it shows. I value rhythm over coverage, restraint
                over flourish, and the moment a film stops feeling assembled and starts
                feeling authored.
              </p>
              <p className="text-muted-foreground">
                Outside the studio I shoot 35mm, read too many short stories, and run very
                slowly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">(02) Services</p>
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
                What I do.
              </h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2">
              {SERVICES.map((s) => (
                <div key={s.title} className="bg-background p-8">
                  <h3 className="font-display text-2xl tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">(03) Process</p>
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
                How a project moves.
              </h2>
            </div>
            <ol className="divide-y divide-border border-y border-border">
              {PROCESS.map((p) => (
                <li key={p.step} className="grid grid-cols-[auto_1fr] items-baseline gap-8 py-6 md:grid-cols-[80px_180px_1fr]">
                  <span className="font-mono text-xs text-primary">{p.step}</span>
                  <h3 className="font-display text-xl tracking-tight md:text-2xl">{p.title}</h3>
                  <p className="col-span-2 text-sm leading-relaxed text-muted-foreground md:col-span-1 md:text-base">
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl tracking-tight text-balance md:text-6xl">
            Ready when you are.
          </h2>
          <Link
            to="/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:gap-4"
          >
            Start a conversation
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
