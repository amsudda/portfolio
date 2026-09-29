import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { SocialIcon } from "@/components/ui/social-icons";
import { company, site, socials } from "@/content/site";

const legalLine = (withVat: boolean) =>
  `${company.legalName} is a legally registered entity in Sri Lanka, incorporated under the ${company.act}. ` +
  (withVat ? `Company Reg. No. ${company.regNo} · VAT Reg. No. ${company.vatNo}.` : `Reg. No. ${company.regNo}.`);

const monoHeading = "font-mono text-[10.5px] tracking-[0.14em] text-white/45";

/** Full footer — home page. */
export function SiteFooter() {
  return (
    <footer id="contact" className="bg-ink px-gutter pt-[clamp(56px,7vw,96px)] pb-8 text-white">
      <div className="container-site">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[clamp(28px,4vw,56px)]">
          <div>
            <Wordmark size={22} />
            <p className="mt-4 max-w-[34ch] text-[14.5px] leading-[1.7] text-white/60">
              Digital management, paid media and studio production for Sri Lankan brands. Operating since{" "}
              {site.foundedYear}.
            </p>
          </div>

          <div>
            <h2 className={monoHeading}>CONTACT</h2>
            <ul className="mt-4 grid gap-3 text-[14.5px] text-white/80">
              <li>
                <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 hover:text-green-bright">
                  <Mail size={16} className="flex-none text-green-bright" aria-hidden />
                  {company.email}
                </a>
              </li>
              <li>
                <a href={company.phoneHref} className="flex items-center gap-2.5 hover:text-green-bright">
                  <Phone size={16} className="flex-none text-green-bright" aria-hidden />
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 leading-normal">
                <MapPin size={16} className="mt-[3px] flex-none text-green-bright" aria-hidden />
                <address className="not-italic">
                  {company.address[0]}
                  <br />
                  {company.address[1]}
                </address>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={monoHeading}>SERVICES</h2>
            <ul className="mt-4 grid gap-2.5 text-[14.5px]">
              {[
                ["/#work", "Social media management"],
                ["/#ads", "Meta & Google advertising"],
                ["/#studio", "Photography & video"],
                ["/#partnership", "Brand & content strategy"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-white/80 transition-colors hover:text-green-bright">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={monoHeading}>FOLLOW</h2>
            <ul className="mt-4 flex gap-2.5">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    aria-label={s.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-green hover:text-green-bright"
                  >
                    <SocialIcon name={s.name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-start justify-between gap-4 border-t border-white/14 pt-6">
          <div className="flex max-w-[62ch] items-start gap-2.5">
            <ShieldCheck size={16} className="mt-[3px] flex-none text-green-bright" aria-hidden />
            <p className="text-[13px] leading-[1.7] text-white/55">{legalLine(true)}</p>
          </div>
          <p className="font-mono text-[11px] tracking-[0.08em] text-white/40">
            © {new Date().getFullYear()} {company.shortLegal}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Slim legal footer — inner pages. */
export function LegalFooter({ withVat = false, bordered = false }: { withVat?: boolean; bordered?: boolean }) {
  return (
    <footer className={`bg-ink px-gutter py-8 text-white ${bordered ? "border-t border-white/14" : ""}`}>
      <div className="container-site flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[62ch] text-[13px] leading-[1.7] text-white/55">{legalLine(withVat)}</p>
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.1em] text-white/55 transition-colors hover:text-green-bright"
        >
          ← BACK TO HOME
        </Link>
      </div>
    </footer>
  );
}
