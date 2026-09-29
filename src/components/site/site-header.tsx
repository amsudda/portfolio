import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { getFirstCaseStudySlug } from "@/lib/queries";
import { MobileMenu, type MobileNavKey } from "./mobile-menu";

export type HeaderLink = { href: string; label: string };

/**
 * Sticky header shared by every public page. Each page passes its own desktop
 * links (the prototypes differ per page); the mobile sheet is always the same.
 */
export async function SiteHeader({
  links,
  current,
  cta = "button",
}: {
  links: HeaderLink[];
  current: MobileNavKey;
  /** "chip" renders the Contact page's outlined mono chip instead of the button. */
  cta?: "button" | "chip";
}) {
  const caseStudySlug = await getFirstCaseStudySlug();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(10,11,10,0.94)] backdrop-blur-[10px]">
      <div className="container-site px-gutter flex min-h-[68px] flex-wrap items-center justify-between gap-x-6 gap-y-3.5 py-3">
        <Link href="/" className="flex items-center" aria-label="Idearigs Studios — home">
          <Wordmark size={22} />
        </Link>

        <nav aria-label="Primary" className="hidden flex-wrap items-center gap-[clamp(14px,2.4vw,34px)] md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-white/72 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
          {cta === "chip" ? (
            <span
              aria-current="page"
              className="border border-white/20 px-3.5 py-[9px] font-mono text-[11.5px] tracking-[0.12em] text-green-bright"
            >
              CONTACT
            </span>
          ) : (
            <Link
              href="/contact"
              className="bg-green px-[18px] py-2.5 font-display text-sm font-semibold text-on-green transition-colors hover:bg-green-hover"
            >
              Book a call
            </Link>
          )}
        </nav>

        <MobileMenu current={current} caseStudyHref={caseStudySlug ? `/work/${caseStudySlug}` : "/portfolio#campaigns"} />
      </div>
    </header>
  );
}
