import { cn } from "@/lib/cn";

/**
 * "idearigs" wordmark. The i is a dotless ı (U+0131) with a green circle placed
 * over it, per the handoff's logo spec.
 */
export function Wordmark({
  suffix = "STUDIOS",
  size = 22,
  className,
}: {
  suffix?: "STUDIOS" | "ADMIN";
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-baseline font-display font-bold leading-none tracking-[-0.015em] text-white", className)}
      style={{ fontSize: size }}
    >
      <span aria-hidden="true" className="relative inline-block">
        ı
        <span className="absolute left-1/2 top-[0.05em] size-[0.17em] -translate-x-1/2 rounded-full bg-green" />
      </span>
      <span aria-hidden="true">dearigs</span>
      <span aria-hidden="true" className="ml-[0.4em] text-[0.6em] font-medium tracking-[0.18em] text-white/62">
        {suffix}
      </span>
      <span className="sr-only">Idearigs {suffix === "ADMIN" ? "Admin" : "Studios"}</span>
    </span>
  );
}
