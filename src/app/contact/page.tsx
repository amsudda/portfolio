import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { LegalFooter } from "@/components/site/footers";
import { SiteHeader } from "@/components/site/site-header";
import { Figure } from "@/components/ui/media";
import { SocialIcon } from "@/components/ui/social-icons";
import { eyebrowDark } from "@/components/ui/styles";
import { company, site, socials } from "@/content/site";
import { EnquiryForm } from "./enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send the brief, or just the problem. We reply within one working day, and the first call is with the people who would actually run your account.",
  alternates: { canonical: "/contact" },
};

const monoLabel = "font-mono text-[10.5px] tracking-[0.12em] text-caption";
const value = "mt-1.5 block font-display text-[16.5px] font-semibold text-ink";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-paper text-ink">
      <SiteHeader
        current="contact"
        cta="chip"
        links={[
          { href: "/#partnership", label: "Partnership" },
          { href: "/#ads", label: "Performance" },
          { href: "/portfolio", label: "Gallery" },
        ]}
      />
      <main className="flex flex-1 flex-col">
        <section className="bg-ink px-gutter py-[clamp(48px,6vw,88px)] text-white">
          <div className="container-site grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-end gap-[clamp(28px,4vw,64px)]">
            <div>
              <p className={eyebrowDark}>GET IN TOUCH</p>
              <h1 className="mt-5 max-w-[18ch] text-[clamp(34px,4.6vw,58px)] leading-[1.05] font-bold tracking-[-0.03em]">
                Tell us what the work needs to achieve.
              </h1>
            </div>
            <p className="max-w-[44ch] text-[clamp(15.5px,1.2vw,18px)] leading-[1.65] text-white/68">
              Send the brief, or just the problem. We reply within one working day, and the first call is with the
              people who would actually run your account.
            </p>
          </div>
        </section>

        <section className="flex-1 px-gutter py-[clamp(40px,5vw,72px)]">
          <div className="container-site grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-[clamp(24px,3vw,40px)]">
            <ul className="grid gap-px border border-line bg-line">
              <li className="flex items-start gap-3 bg-white p-6">
                <Mail size={18} className="mt-[3px] flex-none text-green-deep" aria-hidden />
                <div>
                  <p className={monoLabel}>EMAIL</p>
                  <a href={`mailto:${company.email}`} className={`${value} hover:text-green-deep`}>
                    {company.email}
                  </a>
                  <p className="mt-1 text-sm text-muted">New business &amp; general enquiries</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white p-6">
                <Phone size={18} className="mt-[3px] flex-none text-green-deep" aria-hidden />
                <div>
                  <p className={monoLabel}>PHONE &amp; WHATSAPP</p>
                  <a href={company.phoneHref} className={`${value} hover:text-green-deep`}>
                    {company.phone}
                  </a>
                  <p className="mt-1 text-sm text-muted">{company.hours}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white p-6">
                <MapPin size={18} className="mt-[3px] flex-none text-green-deep" aria-hidden />
                <div>
                  <p className={monoLabel}>OFFICE &amp; STUDIO</p>
                  <address className={`${value} leading-[1.4] not-italic`}>
                    {company.address[0]}
                    <br />
                    {company.address[1]}
                  </address>
                  <p className="mt-1 text-sm text-muted">{site.partnerStudio} visits by appointment</p>
                </div>
              </li>
              <li className="bg-white p-6">
                <p className={monoLabel}>FOLLOW</p>
                <div className="mt-3.5 flex gap-2.5">
                  {socials
                    .filter((s) => s.name !== "YouTube")
                    .map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        aria-label={s.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-11 items-center justify-center border border-line text-ink transition-colors hover:border-green hover:text-green-deep"
                      >
                        <SocialIcon name={s.name} />
                      </a>
                    ))}
                </div>
              </li>
            </ul>

            <div className="relative border border-line bg-white p-[clamp(24px,3vw,40px)]">
              <EnquiryForm />
            </div>
          </div>
        </section>

        <section className="px-gutter pb-[clamp(40px,5vw,72px)]">
          <div className="container-site">
            <Figure
              ratio="21:9"
              label="OFFICE MAP / EXTERIOR — 21:9"
              caption={`${company.address[0]} ${company.address[1]}`}
              sizes="(min-width: 1240px) 1240px, 100vw"
            />
          </div>
        </section>
      </main>
      <LegalFooter withVat />
    </div>
  );
}
