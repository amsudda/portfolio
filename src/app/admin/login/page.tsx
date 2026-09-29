import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage(props: PageProps<"/admin/login">) {
  const { next } = await props.searchParams;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div aria-hidden className="backdrop-texture pointer-events-none absolute inset-0" />
      <div className="glass relative w-full max-w-[420px] rounded-[18px] p-[clamp(24px,4vw,36px)]">
        <Wordmark suffix="ADMIN" size={23} />
        <h1 className="mt-7 text-[26px] font-bold tracking-[-0.02em]">Sign in</h1>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-white/55">Team access to projects, media and performance data.</p>
        <LoginForm next={typeof next === "string" ? next : undefined} />
        <Link href="/" className="mt-6 inline-block font-mono text-[11px] tracking-[0.1em] text-white/45 hover:text-green-bright">
          ← BACK TO SITE
        </Link>
      </div>
    </main>
  );
}
