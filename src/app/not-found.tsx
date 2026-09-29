import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { btn } from "@/components/ui/styles";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-ink px-gutter py-10 text-white">
      <div aria-hidden className="backdrop-texture pointer-events-none absolute inset-0" />
      <Link href="/" className="relative w-fit" aria-label="Idearigs Studios — home">
        <Wordmark size={22} />
      </Link>
      <div className="container-site relative my-auto w-full py-16">
        <p className="eyebrow text-green-bright">ERROR 404</p>
        <h1 className="mt-5 max-w-[18ch] text-[clamp(34px,4.6vw,58px)] leading-[1.05] font-bold tracking-[-0.03em]">
          This page isn&apos;t on the schedule.
        </h1>
        <p className="mt-5 max-w-[44ch] text-[17px] leading-[1.65] text-white/68">
          The link may be out of date, or the case study may have been unpublished.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={btn.primary}>
            Back to home
          </Link>
          <Link href="/portfolio" className={btn.outlineDark}>
            See our work
          </Link>
        </div>
      </div>
    </main>
  );
}
