"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { btnPrimary, inputCls } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import { login, type LoginState } from "./actions";

const labelCls = "font-mono text-[10px] tracking-[0.1em] text-white/50";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 grid gap-4">
      {state.error && (
        <p role="alert" className="border-l-2 border-[#F97066] bg-[#F97066]/10 px-3 py-2 text-[13.5px] text-[#FDA29B]">
          {state.error}
        </p>
      )}
      {next && <input type="hidden" name="next" value={next} />}
      <label className="grid gap-[7px]">
        <span className={labelCls}>EMAIL</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={state.email}
          autoFocus
          className={inputCls}
        />
      </label>
      <label className="grid gap-[7px]">
        <span className={labelCls}>PASSWORD</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </label>
      <button type="submit" disabled={pending} className={cn(btnPrimary, "mt-2 min-h-[50px] px-6 text-[15px]")}>
        {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
