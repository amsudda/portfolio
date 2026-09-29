import { studioSpec } from "@/content/site";
import { cn } from "@/lib/cn";
import { ratioClass } from "@/components/ui/media";

export function StudioSpecCard({ ratio, rows = studioSpec }: { ratio: string; rows?: typeof studioSpec }) {
  return (
    <figure className={cn("m-0 flex flex-col justify-between border border-ink bg-ink p-[22px] text-white", ratioClass(ratio))}>
      <figcaption className="font-mono text-[10.5px] tracking-[0.12em] text-green-bright">STUDIO SPEC</figcaption>
      <dl className="grid gap-2.5 text-sm leading-[1.4] text-white/78">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={cn("flex justify-between gap-2", i < rows.length - 1 && "border-b border-white/14 pb-2")}
          >
            <dt>{r.label}</dt>
            <dd className="font-mono text-white">{r.value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
