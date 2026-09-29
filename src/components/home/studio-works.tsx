import { ArrowRight, Camera } from "lucide-react";
import Link from "next/link";
import { AssetFigure } from "@/components/site/asset-figure";
import { reveal } from "@/components/motion/reveal";
import { StudioSpecCard } from "@/components/site/studio-spec";
import { btn } from "@/components/ui/styles";
import type { PublicAsset } from "@/lib/queries";

export function StudioWorks({ assets }: { assets: PublicAsset[] }) {
  const portraits = assets.filter((a) => a.ratio === "3:4").slice(0, 3);
  const wides = assets.filter((a) => a.ratio === "16:9").slice(0, 2);

  return (
    <section id="studio" className="bg-paper px-gutter py-section">
      <div className="container-site">
        <div {...reveal()} className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-green-deep">
              <Camera size={15} aria-hidden />
              LATEST STUDIO WORKS / IDEARIGS STUDIOS
            </p>
            <h2 className="h-section mt-4 max-w-[22ch]">Shot, lit and graded by our own crew.</h2>
          </div>
          <Link href="/contact" className={btn.underline}>
            Request the full reel
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </Link>
        </div>

        <div className="mt-[clamp(32px,4vw,52px)] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
          {portraits.map((a, i) => (
            <div key={a.id} {...reveal(i)}>
              <AssetFigure asset={a} sizes="(min-width: 1240px) 300px, (min-width: 761px) 45vw, 90vw" />
            </div>
          ))}
          <div {...reveal(portraits.length)}>
            <StudioSpecCard ratio="3:4" />
          </div>
        </div>

        {wides.length > 0 && (
          <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-3.5">
            {wides.map((a, i) => (
              <div key={a.id} {...reveal(i)}>
                <AssetFigure asset={a} sizes="(min-width: 1240px) 610px, (min-width: 761px) 50vw, 90vw" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
