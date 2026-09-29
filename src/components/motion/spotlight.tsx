"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/** Glass panel whose sheen follows the pointer (writes CSS vars; no re-renders). */
export function Spotlight({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("glass-hero", className)}
    >
      {children}
    </div>
  );
}
