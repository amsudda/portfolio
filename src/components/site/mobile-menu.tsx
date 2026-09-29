"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Wordmark } from "@/components/brand/wordmark";
import { company } from "@/content/site";
import { cn } from "@/lib/cn";

export type MobileNavKey = "home" | "portfolio" | "work" | "contact";

const squareBtn =
  "flex size-11 flex-none items-center justify-center border border-white/16 bg-white/8 text-white transition-colors hover:bg-white/14";

export function MobileMenu({ current, caseStudyHref }: { current: MobileNavKey; caseStudyHref: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const items: { href: string; label: string; key?: MobileNavKey }[] = [
    { href: "/", label: "Home", key: "home" },
    { href: "/#partnership", label: "Partnership" },
    { href: "/#reel", label: "Showreel" },
    { href: "/#ads", label: "Performance" },
    { href: "/portfolio", label: "Portfolio", key: "portfolio" },
    { href: caseStudyHref, label: "Project details", key: "work" },
    { href: "/contact", label: "Contact", key: "contact" },
  ];

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Returning to desktop width closes the sheet, as in the prototype.
    const mq = window.matchMedia("(min-width: 761px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={cn(squareBtn, "md:hidden")}
      >
        <Menu size={20} strokeWidth={2} aria-hidden />
      </button>

      {open &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-80 flex flex-col overflow-y-auto bg-[rgba(8,9,8,0.78)] px-5 pt-3 pb-7 text-white backdrop-blur-[24px] backdrop-saturate-[1.6]"
          >
            <div className="flex min-h-11 items-center justify-between">
              <Link href="/" onClick={close} aria-label="Idearigs Studios — home">
                <Wordmark size={21} />
              </Link>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close menu" className={squareBtn}>
                <X size={20} strokeWidth={2} aria-hidden />
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-7 grid border-t border-white/12">
              {items.map((item, i) => {
                const active = item.key === current;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-[60px] items-center justify-between border-b border-white/12 px-0.5 font-display text-2xl font-semibold tracking-[-0.02em]",
                      active ? "text-green-bright" : "text-white",
                    )}
                  >
                    {item.label}
                    <span className="font-mono text-[11px] tracking-[0.1em] text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto grid gap-3.5 pt-8">
              <Link
                href="/contact"
                onClick={close}
                className="flex min-h-[54px] items-center justify-center gap-2.5 bg-green font-display text-base font-semibold text-on-green"
              >
                Book a strategy call
              </Link>
              <div className="flex flex-wrap justify-between gap-2 font-mono text-[11px] tracking-[0.06em] text-white/55">
                <a href={`mailto:${company.email}`}>{company.email}</a>
                <a href={company.phoneHref}>{company.phone}</a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
