export function ClientMarquee({ names }: { names: string[] }) {
  if (names.length < 3) return null;
  // Two copies side by side; the track slides by exactly one copy (-50%) per loop.
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex flex-none items-center">
      {names.map((n) => (
        <li key={n} className="flex items-center gap-8 pr-8 font-display text-[clamp(17px,1.6vw,22px)] font-semibold whitespace-nowrap text-white/45">
          {n}
          <span aria-hidden className="size-1.5 rounded-full bg-green" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Brands we work with" className="border-y border-white/8 bg-ink py-6 text-white">
      <div className="container-site px-gutter flex items-center gap-8">
        <p className="hidden flex-none font-mono text-[10.5px] tracking-[0.16em] text-white/40 md:block">TRUSTED BY</p>
        <div className="marquee relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee-track flex w-max">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
