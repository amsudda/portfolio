import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Index" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary text-primary-foreground font-display text-sm">
            ◐
          </span>
          <span className="font-display text-base tracking-tight">
            Aris Moreau<span className="text-muted-foreground"> / Studio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-underline text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-foreground/90 transition-all hover:border-primary hover:text-primary md:inline-block"
        >
          Start a project
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center md:hidden"
        >
          <span className="relative block h-px w-5 bg-foreground before:absolute before:left-0 before:block before:h-px before:w-5 before:bg-foreground before:content-[''] after:absolute after:left-0 after:block after:h-px after:w-5 after:bg-foreground after:content-['']" style={{}}>
            <span className="sr-only">Menu</span>
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-4 font-display text-2xl tracking-tight"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-block self-start rounded-full border border-primary px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary"
            >
              Start a project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
