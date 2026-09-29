"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole page: any element with [data-reveal] gets
 * [data-inview] when it scrolls into view (CSS in globals.css does the rest).
 * Keeps server components free of client wrappers.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-inview])"));
    if (!pending.length) return;

    const show = (el: Element) => el.setAttribute("data-inview", "");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
