import { Check, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { reveal } from "@/components/motion/reveal";
import { MediaImage } from "@/components/ui/media";
import { eyebrowLight } from "@/components/ui/styles";
import { agreementPoints, site, team } from "@/content/site";

export function Partnership() {
  return (
    <section id="partnership" className="bg-paper px-gutter py-[clamp(64px,8vw,128px)]">
      <div className="container-site">
        <p className={eyebrowLight} {...reveal()}>
          OUR PARTNERSHIP
        </p>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[clamp(28px,4vw,64px)]">
          <h2 {...reveal(1)} className="max-w-[20ch] text-[clamp(30px,3.6vw,50px)] leading-[1.08] font-bold tracking-[-0.025em]">
            One team since day one. Now with a studio on contract.
          </h2>
          <div {...reveal(2)} className="grid max-w-[56ch] gap-[18px] text-[16.5px] leading-[1.7] text-body">
            <p>
              Idearigs did not assemble freelancers for this. The four people who started the agency in{" "}
              {site.foundedYear} still run every account — the same strategist, the same media buyer, the same
              designer, the same account lead. Clients talk to the people doing the work.
            </p>
            <p>
              In January 2026 we signed a formal collaboration agreement with{" "}
              <strong className="font-semibold text-ink">{site.partnerStudio}</strong>, founded and run by the brother
              of our creative director. The relationship is contracted, not casual: fixed rates, guaranteed booking
              windows and shared accountability on delivery. Full-scale photography and video production now sits
              in-house.
            </p>
          </div>
        </div>

        <ul className="mt-[clamp(40px,5vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
          {team.map((m, i) => (
            <li key={m.name} {...reveal(i)} className="group border border-line bg-white hover:-translate-y-1 hover:border-ink hover:shadow-[0_18px_40px_rgba(10,11,10,0.08)]">
              <div className="stripes-light relative flex aspect-square items-end p-3">
                {m.photo ? (
                  <MediaImage src={m.photo} alt={`Portrait of ${m.name}`} sizes="(min-width: 1240px) 290px, (min-width: 761px) 45vw, 90vw" />
                ) : (
                  <span className="font-mono text-[10.5px] tracking-[0.08em] text-caption">PORTRAIT — 4:5</span>
                )}
              </div>
              <div className="px-[18px] pt-[18px] pb-[22px]">
                <h3 className="text-[17px] font-semibold">{m.name}</h3>
                <p className="mt-1 text-sm text-muted">{m.role}</p>
                <p className="mt-3.5 border-t border-line-faint pt-3 font-mono text-[10.5px] tracking-[0.1em] text-green-deep">
                  {m.tag}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div
          {...reveal()}
          className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[clamp(28px,4vw,56px)] border-l-4 border-green bg-ink p-[clamp(28px,4vw,48px)] text-white">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.14em] text-green-bright">
              <ShieldCheck size={15} aria-hidden />
              SIGNED COLLABORATION AGREEMENT
            </p>
            <Image
              src={site.partnerLogo.onDark}
              alt={`${site.partnerStudio} — video production studio`}
              width={site.partnerLogo.width}
              height={site.partnerLogo.height}
              sizes="280px"
              className="mt-6 h-auto w-[min(280px,100%)]"
            />
            <h3 className="mt-5 text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-bold tracking-[-0.02em]">
              Idearigs × {site.partnerStudio}
            </h3>
            <p className="mt-3.5 max-w-[46ch] text-[15.5px] leading-[1.7] text-white/66">
              A two-year contracted partnership covering production, equipment and crew. Every shoot is scoped,
              invoiced and delivered through Idearigs, so clients keep a single point of responsibility.
            </p>
          </div>
          <ul className="grid content-center gap-3.5">
            {agreementPoints.map((point, i) => (
              <li key={point} {...reveal(i + 1, 110)} className="flex items-start gap-3 text-[15.5px] leading-normal">
                <Check size={19} strokeWidth={2.4} className="mt-0.5 flex-none text-green-bright" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
