"use client";

import { Camera, ChartColumn, ExternalLink, Inbox, LayoutGrid, LogOut, Menu, Play, Settings, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { cn } from "@/lib/cn";

const groups = [
  {
    label: "CONTENT",
    items: [
      { href: "/admin/projects", label: "Projects", icon: LayoutGrid },
      { href: "/admin/gallery", label: "Studio gallery", icon: Camera },
      { href: "/admin/showreel", label: "Showreel clips", icon: Play },
      { href: "/admin/clients", label: "Clients", icon: Users },
    ],
  },
  { label: "PERFORMANCE", items: [{ href: "/admin/meta-ads", label: "Meta ads data", icon: ChartColumn }] },
  { label: "INBOX", items: [{ href: "/admin/enquiries", label: "Enquiries", icon: Inbox }] },
  {
    label: "ACCOUNT",
    items: [
      { href: "/admin/settings", label: "Site settings", icon: Settings },
      { href: "/", label: "View live site", icon: ExternalLink, external: true },
    ],
  },
];

type User = { name: string; title: string };

function Nav({ newEnquiries, onNavigate }: { newEnquiries: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="grid gap-0.5">
      {groups.map((g, gi) => (
        <div key={g.label} className="grid gap-0.5">
          <p className={cn("px-3 pb-2.5 font-mono text-[9.5px] tracking-[0.16em] text-white/35", gi > 0 && "pt-[18px]")}>
            {g.label}
          </p>
          {g.items.map((item) => {
            const active = pathname.startsWith(item.href) && item.href !== "/";
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                target={"external" in item ? "_blank" : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-[11px] border-l-2 px-3 text-[14.5px] transition-colors",
                  active
                    ? "border-green bg-white/8 text-white"
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon size={16} className={active ? "text-green-bright" : undefined} aria-hidden />
                {item.label}
                {item.href === "/admin/enquiries" && newEnquiries > 0 && (
                  <span className="ml-auto bg-green px-1.5 py-0.5 font-mono text-[10px] text-on-green">
                    {newEnquiries}
                    <span className="sr-only"> new</span>
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function UserChip({ user, logout }: { user: User; logout: () => Promise<void> }) {
  return (
    <div className="flex items-center gap-[11px] border-t border-white/10 pt-4">
      <div aria-hidden className="size-[34px] flex-none rounded-full bg-[repeating-linear-gradient(135deg,#1E201E_0_6px,#171817_6px_12px)]" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[13.5px] font-semibold">{user.name}</p>
        <p className="truncate font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase">{user.title}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          aria-label="Sign out"
          title="Sign out"
          className="flex size-9 items-center justify-center text-white/50 transition-colors hover:bg-white/8 hover:text-white"
        >
          <LogOut size={16} aria-hidden />
        </button>
      </form>
    </div>
  );
}

export function AdminShell({
  user,
  newEnquiries,
  logout,
  children,
}: {
  user: User;
  newEnquiries: number;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // Nav links close the drawer themselves; also close on Escape or desktop width.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 761px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:z-90 focus:bg-green focus:p-3 focus:text-on-green">
        Skip to content
      </a>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-[rgba(10,11,10,0.86)] px-4 py-2.5 backdrop-blur-[18px] backdrop-saturate-[1.6] md:hidden">
        <Wordmark suffix="ADMIN" size={21} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex size-11 items-center justify-center border border-white/16 bg-white/8 text-white"
        >
          <Menu size={20} aria-hidden />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-80 flex bg-[rgba(4,5,4,0.6)] backdrop-blur-[6px] md:hidden">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="flex h-full w-[min(300px,86%)] flex-col gap-6 overflow-y-auto border-r border-white/12 bg-ink px-4 pt-3 pb-6"
          >
            <div className="flex min-h-11 items-center justify-between">
              <Wordmark suffix="ADMIN" size={21} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="flex size-11 items-center justify-center border border-white/16 bg-white/8 text-white"
              >
                <X size={20} aria-hidden />
              </button>
            </div>
            <Nav newEnquiries={newEnquiries} onNavigate={() => setOpen(false)} />
            <div className="mt-auto">
              <UserChip user={user} logout={logout} />
            </div>
          </div>
          <button type="button" aria-label="Close menu" className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col gap-7 overflow-y-auto border-r border-white/10 bg-ink px-[18px] py-[22px] md:flex">
        <Link href="/admin/projects" aria-label="Admin home">
          <Wordmark suffix="ADMIN" size={21} />
        </Link>
        <Nav newEnquiries={newEnquiries} />
        <div className="mt-auto">
          <UserChip user={user} logout={logout} />
        </div>
      </aside>

      <main id="admin-main" className="relative min-w-0 flex-1 overflow-hidden">
        <div aria-hidden className="backdrop-texture-admin pointer-events-none absolute inset-0" />
        <div className="pad-admin relative">{children}</div>
      </main>
    </div>
  );
}
