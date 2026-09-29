"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Splits "LKR 87M" / "4.65x" / "2,400+" into prefix, number, suffix. */
function parse(value: string) {
  const m = value.match(/^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const raw = m[2];
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { prefix: m[1], target: Number(raw.replace(/,/g, "")), decimals, grouped: raw.includes(","), suffix: m[3] };
}

/**
 * Counts up to `value` the first time it scrolls into view. The server renders the
 * final value (SEO, no-JS); the client resets to zero before first paint.
 */
export function CountUp({ value, duration = 1400, className }: { value: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);
  const [text, setText] = useState(value);

  useIsoLayoutEffect(() => {
    if (!parsed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const format = (n: number) =>
      parsed.prefix +
      (parsed.grouped
        ? n.toLocaleString("en-US", { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })
        : n.toFixed(parsed.decimals)) +
      parsed.suffix;

    setText(format(0));
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * t); // easeOutExpo
          setText(t === 1 ? value : format(parsed.target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {text}
    </span>
  );
}
