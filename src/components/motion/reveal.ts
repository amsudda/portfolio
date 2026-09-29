import type { CSSProperties } from "react";

/**
 * Spread onto any element to fade it up when it scrolls into view (see RevealRoot).
 * `index` staggers siblings by `step` ms.
 */
export function reveal(index = 0, step = 90): { "data-reveal": ""; style: CSSProperties } {
  return { "data-reveal": "", style: { "--d": `${index * step}ms` } as CSSProperties };
}

/** Stagger delay for a [data-grow] bar inside a revealed parent. */
export function growDelay(index: number, step = 70): CSSProperties {
  return { "--d": `${index * step}ms` } as CSSProperties;
}
