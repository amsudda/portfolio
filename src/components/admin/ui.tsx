"use client";

import { ChevronRight, LoaderCircle, Plus, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ tokens */

export const inputCls =
  "w-full border border-white/18 bg-white/4 px-3.5 py-3 text-[15px] text-white outline-none transition-colors focus:border-green aria-[invalid=true]:border-[#F97066] [&>option]:bg-panel";
export const monoInputCls = cn(inputCls, "font-mono text-[14.5px]");
const labelCls = "font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 bg-green font-display font-semibold text-on-green transition-colors hover:bg-green-hover disabled:cursor-not-allowed disabled:opacity-60";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 border border-white/20 font-display font-semibold text-white transition-colors hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60";

/* ------------------------------------------------------------------ page chrome */

export function PageHeader({
  crumb,
  title,
  description,
  action,
}: {
  crumb: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.14em] text-white/45">{crumb}</p>
        <h1 className="mt-3 text-[clamp(24px,2.6vw,34px)] font-bold tracking-[-0.025em]">{title}</h1>
        <p className="mt-2.5 max-w-[54ch] text-[14.5px] leading-[1.6] text-white/55">{description}</p>
      </div>
      {action && (
        <button type="button" onClick={action.onClick} className={cn(btnPrimary, "px-5 py-[13px] text-[14.5px]")}>
          <Plus size={16} strokeWidth={2.4} aria-hidden />
          {action.label}
        </button>
      )}
    </div>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <dl className="mt-[clamp(22px,3vw,32px)] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">{children}</dl>
  );
}

export function StatCard({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div className="glass-admin flex flex-col rounded-[14px] p-[18px]">
      <dt className="font-mono text-[10px] tracking-[0.12em] text-white/45">{label}</dt>
      <dd className={cn("mt-2 font-display text-[28px] font-bold tracking-[-0.02em]", accent && "text-green-bright")}>
        {value}
      </dd>
      {note && <dd className="mt-1.5 font-mono text-[9.5px] tracking-[0.08em] text-white/40">{note}</dd>}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={cn("flex items-center gap-2.5 border border-white/16 bg-white/4 px-3.5 py-[11px]", className)}>
      <Search size={16} className="flex-none text-white/45" aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14.5px] text-white outline-none"
      />
    </label>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-11 border border-white/16 px-4 font-mono text-[11px] tracking-[0.1em] text-white transition-colors md:min-h-0 md:py-[11px]",
            value === o.value ? "bg-white/16" : "bg-white/4 hover:bg-white/10",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="mt-[clamp(22px,3vw,32px)] flex flex-wrap items-center gap-3">{children}</div>;
}

export function EmptyState({ children, bordered }: { children: React.ReactNode; bordered?: boolean }) {
  return (
    <p
      className={cn(
        "px-5 py-11 text-center font-mono text-[11.5px] tracking-[0.1em] text-white/45",
        bordered && "mt-4 rounded-[14px] border border-white/12",
      )}
    >
      {children}
    </p>
  );
}

/** Desktop table container (glass, horizontal scroll). */
export function TableShell({ minWidth, head, children }: { minWidth: number; head: string[]; children: React.ReactNode }) {
  return (
    <div className="glass-soft mt-4 hidden overflow-x-auto md:block">
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-white/12 font-mono text-[10px] tracking-[0.12em] text-white/45">
            {head.map((h, i) => (
              <th key={h} scope="col" className={cn("py-3.5 font-normal", i === 0 ? "pl-5" : "pl-3.5", i === head.length - 1 && "pr-5")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const rowCls = "border-b border-white/7 last:border-b-0 align-middle";
export const cellCls = "py-4 pl-3.5";

/** Mobile tappable card list. */
export function CardList({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 grid gap-2.5 md:hidden">{children}</div>;
}

export function MobileCard({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid w-full gap-3 rounded-[14px] border border-white/14 bg-white/5 p-3.5 text-left text-white backdrop-blur-[18px]"
    >
      {children}
    </button>
  );
}

export function CardChevron() {
  return <ChevronRight size={16} className="flex-none text-white/45" aria-hidden />;
}

export function EditButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={cn(btnOutline, "px-3.5 py-[9px] text-[13px]")}>
      Edit
    </button>
  );
}

export function StatusText({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span className={cn("font-mono text-[10.5px] tracking-[0.1em] uppercase", on ? "text-green-bright" : "text-white/50")}>
      {children}
    </span>
  );
}

export function Badge({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "px-2 py-1 font-mono text-[9.5px] tracking-[0.1em] uppercase",
        on ? "bg-green text-on-green" : "bg-white/8 text-white/70",
      )}
    >
      {children}
    </span>
  );
}

export function Thumb({ src, className }: { src?: string | null; className?: string }) {
  return (
    <div className={cn("stripes-dark relative flex-none overflow-hidden border border-white/10", className)}>
      {src &&
        (/\.(mp4|webm)$/i.test(src) ? (
          <video src={src} muted preload="metadata" className="absolute inset-0 size-full object-cover" />
        ) : (
          // Admin thumbnails: tiny, private, not worth the optimiser round-trip.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ form fields */

export function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (id: string, describedBy?: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("grid content-start gap-[7px]", className)}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children(id, describedBy)}
      {error ? (
        <span id={`${id}-err`} className="text-[12.5px] text-[#F97066]">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="text-[12.5px] leading-[1.5] text-white/45">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  error,
  hint,
  mono,
  placeholder,
  className,
  inputMode,
  maxLength = 500,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  mono?: boolean;
  placeholder?: string;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {(id, describedBy) => (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={mono ? monoInputCls : inputCls}
        />
      )}
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <Field label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(inputCls, "resize-y")}
        />
      )}
    </Field>
  );
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly (T | { value: T; label: string })[];
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      {(id, describedBy) => (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputCls}
        >
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      )}
    </Field>
  );
}

export function Section({ label, children, aside }: { label: string; children: React.ReactNode; aside?: React.ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="grid gap-3 border-t border-white/12 pt-[18px]">
      <div className="flex items-center justify-between gap-3">
        <span id={id} className="font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase">
          {label}
        </span>
        {aside}
      </div>
      {children}
    </div>
  );
}

/** Two-way segmented toggle; the "on" option turns solid green. */
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  off,
  on,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  off: { value: T; label: string };
  on: { value: T; label: string };
}) {
  return (
    <Section label={label}>
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {[off, on].map((o) => {
          const selected = value === o.value;
          const isOn = o === on;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              className={cn(
                "min-h-11 flex-1 border border-white/18 p-3 font-display text-sm font-semibold transition-colors",
                selected ? (isOn ? "bg-green text-on-green" : "bg-white/16 text-white") : "bg-white/4 text-white hover:bg-white/10",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

export function TagToggles<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T[];
  onChange: (v: T[]) => void;
}) {
  return (
    <div className="grid gap-[9px]">
      <span className={labelCls}>{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
              className={cn(
                "min-h-11 border border-white/18 px-3.5 text-[13px] text-white transition-colors md:min-h-0 md:py-[9px]",
                on ? "bg-white/16" : "bg-white/4 hover:bg-white/10",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ drawer */

export function Drawer({
  open,
  onClose,
  label,
  title,
  width = 560,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  title: string;
  width?: number;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="admin-root fixed inset-0 z-60 flex justify-end bg-[rgba(4,5,4,0.6)] backdrop-blur-[4px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="h-full overflow-y-auto border-l border-white/14 bg-panel p-[clamp(20px,3vw,32px)] text-white outline-none"
        style={{ width: `min(${width}px, 100%)` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10.5px] tracking-[0.14em] text-green-bright">{label}</p>
            <h2 id={titleId} className="mt-2.5 text-[clamp(20px,2.2vw,26px)] font-bold tracking-[-0.02em]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 flex-none items-center justify-center border border-white/20 text-white transition-colors hover:bg-white/12 md:size-[38px]"
          >
            <X size={16} strokeWidth={2.2} aria-hidden />
          </button>
        </div>
        <div className="mt-[26px] grid gap-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

/** Save / Cancel / two-step Delete footer, with the server error (if any) above it. */
export function DrawerFooter({
  saveLabel,
  onSave,
  onCancel,
  onDelete,
  pending,
  error,
}: {
  saveLabel: string;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  pending: boolean;
  error?: string | null;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="mt-2 grid gap-3 border-t border-white/12 pt-[18px]">
      {error && (
        <p role="alert" className="border-l-2 border-[#F97066] bg-[#F97066]/10 px-3 py-2 text-[13.5px] text-[#FDA29B]">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={onSave} disabled={pending} className={cn(btnPrimary, "px-6 py-3.5 text-[15px]")}>
          {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
          {pending ? "Saving…" : saveLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={pending} className={cn(btnOutline, "px-6 py-3.5 text-[15px]")}>
          Cancel
        </button>
        {onDelete &&
          (confirming ? (
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={onDelete}
                disabled={pending}
                className="border border-[#F97066] px-4 py-3.5 text-sm text-[#FDA29B] transition-colors hover:bg-[#F97066]/15"
              >
                Confirm delete
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="px-3 text-sm text-white/60 hover:text-white">
                Keep
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={pending}
              className="ml-auto border border-white/20 px-[18px] py-3.5 text-sm text-white/70 transition-colors hover:border-white hover:text-white"
            >
              Delete
            </button>
          ))}
      </div>
    </div>
  );
}
