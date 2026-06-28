import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aris Moreau / Studio" },
      {
        name: "description",
        content:
          "Get in touch about a brand film, commercial, documentary, or event project. Tell us the brief, timing, and budget — we'll reply within two working days.",
      },
      { property: "og:title", content: "Contact — Aris Moreau / Studio" },
      {
        property: "og:description",
        content:
          "Get in touch about a brand film, commercial, documentary, or event project.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder — wire to backend later.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="pt-40 pb-16 md:pt-56 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-fade-in">
            Contact
          </p>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-[-0.035em] animate-fade-up">
            Let's
            <br />
            <span className="italic text-primary">make something</span>.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Tell us about the brief, timing, and rough budget. We reply within two
            working days — sometimes faster.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-[1.4fr_1fr] md:gap-24 md:px-10">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="rounded-lg border border-primary/40 bg-primary/5 p-10">
                <h2 className="font-display text-3xl tracking-tight">Thanks — message received.</h2>
                <p className="mt-3 text-muted-foreground">
                  We'll be in touch within two working days. In the meantime, feel free to
                  send any reference links or briefs to <span className="text-foreground">studio@example.com</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <Field label="Name" id="name" required />
                <Field label="Email" id="email" type="email" required />
                <Field label="Company / Brand" id="company" />
                <div>
                  <label htmlFor="message" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Tell us about the project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Brief, deliverables, timing, rough budget..."
                    className="w-full resize-none border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:gap-4"
                >
                  Send message
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct */}
          <aside className="space-y-12 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Direct</p>
              <a
                href="mailto:studio@example.com"
                className="link-underline mt-3 inline-block font-display text-2xl tracking-tight md:text-3xl"
              >
                studio@example.com
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Studio</p>
              <p className="mt-3 leading-relaxed text-foreground/90">
                Brooklyn, NY
                <br />
                Available worldwide
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Follow</p>
              <ul className="mt-3 space-y-2">
                <li><a href="#" className="link-underline">Instagram</a></li>
                <li><a href="#" className="link-underline">Vimeo</a></li>
                <li><a href="#" className="link-underline">LinkedIn</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}{required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
