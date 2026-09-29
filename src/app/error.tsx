"use client";

import Link from "next/link";
import { useEffect } from "react";
import { btn } from "@/components/ui/styles";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center bg-ink px-gutter py-16 text-white">
      <div className="container-site w-full">
        <p className="eyebrow text-green-bright">SOMETHING WENT WRONG</p>
        <h1 className="mt-5 max-w-[20ch] text-[clamp(30px,4vw,50px)] leading-[1.08] font-bold tracking-[-0.03em]">
          We couldn&apos;t load this page.
        </h1>
        <p className="mt-4 max-w-[46ch] text-base leading-[1.65] text-white/68">
          Please try again. If it keeps happening, email hello@idearigs.lk
          {error.digest ? ` and quote reference ${error.digest}` : ""}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={btn.primary}>
            Try again
          </button>
          <Link href="/" className={btn.outlineDark}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
