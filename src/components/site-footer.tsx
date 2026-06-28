import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl text-balance">
              Have a story
              <br />
              worth telling?
            </h2>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-primary"
            >
              <span className="link-underline">Start a conversation</span>
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Studio
            </p>
            <ul className="space-y-3 text-sm">
              <li><Link to="/work" className="link-underline">Work</Link></li>
              <li><Link to="/about" className="link-underline">About</Link></li>
              <li><Link to="/contact" className="link-underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Elsewhere
            </p>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="link-underline">Instagram</a></li>
              <li><a href="#" className="link-underline">Vimeo</a></li>
              <li><a href="#" className="link-underline">LinkedIn</a></li>
              <li><a href="mailto:studio@example.com" className="link-underline">studio@example.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Aris Moreau / Studio. All rights reserved.</p>
          <p className="tracking-wider">Crafted with intent.</p>
        </div>
      </div>
    </footer>
  );
}
