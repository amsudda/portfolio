"use client";

import { useOptimistic, useTransition } from "react";
import { PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

type Key = "showTrustBar" | "showAdsBreakdown" | "showClosingCta";
type Settings = Record<Key, boolean>;

const toggles: { key: Key; title: string; body: string }[] = [
  { key: "showTrustBar", title: "Trust bar", body: "The four stats under the hero video (years, brands, ad spend, ROAS)." },
  { key: "showAdsBreakdown", title: "Ad account breakdown", body: "The per-account table at the bottom of the Performance section." },
  { key: "showClosingCta", title: "Closing call-to-action", body: "The green “Tell us what the next quarter has to deliver” band." },
];

export function SettingsForm({ settings, update }: { settings: Settings; update: (key: Key, value: boolean) => Promise<void> }) {
  const [optimistic, setOptimistic] = useOptimistic(settings, (s, p: Partial<Settings>) => ({ ...s, ...p }));
  const [pending, startTransition] = useTransition();

  return (
    <>
      <PageHeader
        crumb="ACCOUNT / SITE SETTINGS"
        title="Home page sections"
        description="Switch optional sections of the home page on or off. Changes are live within seconds."
      />
      <ul className="mt-[clamp(22px,3vw,32px)] grid max-w-[720px] gap-3">
        {toggles.map((t) => {
          const on = optimistic[t.key];
          return (
            <li key={t.key} className="glass-admin flex items-center justify-between gap-5 rounded-[14px] p-[18px]">
              <div>
                <p id={`${t.key}-label`} className="font-display text-base font-semibold">
                  {t.title}
                </p>
                <p className="mt-1 text-[13.5px] leading-[1.55] text-white/55">{t.body}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-labelledby={`${t.key}-label`}
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    setOptimistic({ [t.key]: !on });
                    await update(t.key, !on);
                  })
                }
                className={cn(
                  "relative h-7 w-12 flex-none rounded-full border transition-colors",
                  on ? "border-green bg-green" : "border-white/24 bg-white/8",
                )}
              >
                <span
                  aria-hidden
                  className={cn("absolute top-[3px] size-5 rounded-full transition-all", on ? "left-[23px] bg-on-green" : "left-[3px] bg-white/70")}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 max-w-[60ch] text-[13px] leading-[1.6] text-white/45">
        The hero background loop is managed under Showreel clips. Company details, team and trust-bar figures live in{" "}
        <code className="font-mono text-white/70">src/content/site.ts</code>.
      </p>
    </>
  );
}
