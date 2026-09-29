"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CardChevron,
  CardList,
  Drawer,
  DrawerFooter,
  EditButton,
  EmptyState,
  MobileCard,
  PageHeader,
  Section,
  Segmented,
  Select,
  StatCard,
  StatRow,
  SearchField,
  TableShell,
  TextInput,
  Toolbar,
  cellCls,
  monoInputCls,
  rowCls,
} from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import type { AdRecord } from "@/lib/db/schema";
import { formatFixed, formatInt } from "@/lib/format";
import { MONTH_LABELS, SPLIT_KEYS, computePerformance, splitTotal, type SplitKey } from "@/lib/metrics";
import { deleteAdRecord, saveAdRecord, type AdInput } from "./actions";

type ClientOption = { id: string; name: string };
type Form = AdInput;

const SPLIT_LABELS: Record<SplitKey, string> = {
  conversions: "Conversions",
  leadgen: "Lead gen",
  retargeting: "Retargeting",
  awareness: "Awareness",
};

const str = (n: number | null | undefined) => (n === null || n === undefined || n === 0 ? "" : String(n));

function toForm(r?: AdRecord): Form {
  return {
    id: r?.id,
    clientId: r?.clientId ?? "",
    period: r?.period ?? "",
    spendLkr: str(r?.spendLkr),
    roas: str(r?.roas),
    cpcLkr: str(r?.cpcLkr),
    cvrPct: str(r?.cvrPct),
    costPerPurchaseLkr: str(r?.costPerPurchaseLkr),
    purchases: str(r?.purchases),
    monthlyRoas: MONTH_LABELS.map((_, i) => str(r?.monthlyRoas[i])),
    split: Object.fromEntries(SPLIT_KEYS.map((k) => [k, str(r?.split[k])])) as Form["split"],
    visibility: r?.visibility ?? "internal",
  };
}

export function MetaAdsManager({ records, clients }: { records: AdRecord[]; clients: ClientOption[] }) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const account = (id: string) => clients.find((c) => c.id === id)?.name ?? "Unknown account";

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? records.filter((r) => account(r.clientId).toLowerCase().includes(q)) : records;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, query, clients]);

  // Exactly what the public Performance section shows.
  const perf = useMemo(() => computePerformance(records.filter((r) => r.visibility === "published")), [records]);

  const open = (r?: AdRecord) => {
    setForm(toForm(r));
    setError(null);
    setFieldErrors({});
  };
  const close = () => !pending && setForm(null);
  const patch = (p: Partial<Form>) => setForm((f) => (f ? { ...f, ...p } : f));

  const run = (fn: () => Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string> }>) =>
    startTransition(async () => {
      const res = await fn();
      if (res.ok) setForm(null);
      else {
        setError(res.error ?? "Something went wrong.");
        setFieldErrors(res.fieldErrors ?? {});
      }
    });

  const total = form ? splitTotal(form.split) : 0;
  const numField = (key: "spendLkr" | "roas" | "cpcLkr" | "cvrPct" | "costPerPurchaseLkr" | "purchases", label: string, placeholder: string) =>
    form && (
      <TextInput
        label={label}
        value={form[key]}
        onChange={(v) => patch({ [key]: v } as Partial<Form>)}
        placeholder={placeholder}
        mono
        inputMode="decimal"
        maxLength={20}
        error={fieldErrors[key]}
      />
    );

  return (
    <>
      <PageHeader
        crumb="PERFORMANCE / META ADS DATA"
        title="Ad account records"
        description="Enter each client's reconciled figures. Published records feed the Performance section on the home page — the blended numbers below are what visitors see."
        action={{ label: "Add account data", onClick: () => open() }}
      />

      <StatRow>
        <StatCard label="BLENDED ROAS" value={perf.hasData ? `${formatFixed(perf.roas, 2)}x` : "—"} note="SPEND-WEIGHTED" accent />
        <StatCard label="AVG. CPC" value={perf.hasData ? formatFixed(perf.cpc, 2) : "—"} note="LKR" />
        <StatCard label="AVG. CONV. RATE" value={perf.hasData ? `${formatFixed(perf.cvr, 1)}%` : "—"} note="ACROSS PUBLISHED" />
        <StatCard label="TOTAL SPEND" value={formatInt(perf.totalSpend)} note="LKR, PUBLISHED" />
      </StatRow>

      <Toolbar>
        <SearchField value={query} onChange={setQuery} placeholder="Search accounts" className="flex-[1_1_220px]" />
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-white/45">{rows.length} RECORDS</span>
      </Toolbar>

      <TableShell minWidth={900} head={["ACCOUNT", "PERIOD", "SPEND", "ROAS", "CPC", "CVR", "STATUS", "ACTIONS"]}>
        {rows.map((r) => (
          <tr key={r.id} className={rowCls}>
            <td className="py-4 pl-5 font-display text-[14.5px] font-semibold">{account(r.clientId)}</td>
            <td className={cn(cellCls, "font-mono text-[11px] text-white/60")}>{r.period || "—"}</td>
            <td className={cn(cellCls, "font-mono text-white/80")}>{formatInt(r.spendLkr)}</td>
            <td className={cn(cellCls, "font-mono text-green-bright")}>{formatFixed(r.roas, 1)}x</td>
            <td className={cn(cellCls, "font-mono text-white/80")}>{formatFixed(r.cpcLkr, 2)}</td>
            <td className={cn(cellCls, "font-mono text-white/80")}>{formatFixed(r.cvrPct, 1)}%</td>
            <td className={cn(cellCls, "font-mono text-[10.5px] tracking-[0.1em]", r.visibility === "published" ? "text-green-bright" : "text-white/50")}>
              {r.visibility.toUpperCase()}
            </td>
            <td className={cn(cellCls, "pr-5")}>
              <EditButton onClick={() => open(r)} label={`Edit ${account(r.clientId)}`} />
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={8}>
              <EmptyState>NO ACCOUNTS MATCH THIS SEARCH</EmptyState>
            </td>
          </tr>
        )}
      </TableShell>

      <CardList>
        {rows.map((r) => (
          <MobileCard key={r.id} onClick={() => open(r)} label={`Edit ${account(r.clientId)}`}>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15.5px] font-semibold">{account(r.clientId)}</p>
                <p className="mt-1 font-mono text-[10.5px] text-white/50">{r.period}</p>
              </div>
              <span className={cn("font-mono text-[10px] tracking-[0.1em]", r.visibility === "published" ? "text-green-bright" : "text-white/50")}>
                {r.visibility.toUpperCase()}
              </span>
              <CardChevron />
            </div>
            <dl className="grid grid-cols-4 gap-2 border-t border-white/10 pt-3 font-mono">
              {[
                ["ROAS", `${formatFixed(r.roas, 1)}x`, true],
                ["CPC", formatFixed(r.cpcLkr, 2)],
                ["CVR", `${formatFixed(r.cvrPct, 1)}%`],
                ["SPEND", formatInt(r.spendLkr)],
              ].map(([k, v, accent]) => (
                <div key={String(k)} className="flex min-w-0 flex-col-reverse">
                  <dt className="text-[9px] tracking-[0.1em] text-white/45">{k}</dt>
                  <dd className={cn("mb-1 truncate", k === "SPEND" ? "text-xs" : "text-sm", accent && "text-green-bright")}>{v}</dd>
                </div>
              ))}
            </dl>
          </MobileCard>
        ))}
        {rows.length === 0 && <EmptyState bordered>NO ACCOUNTS MATCH THIS SEARCH</EmptyState>}
      </CardList>

      <figure className="glass-soft mt-4 rounded-2xl p-[clamp(18px,2.4vw,28px)]">
        <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[17px] font-semibold">Monthly blended ROAS — front-end chart</h2>
          <span className="font-mono text-[10.5px] tracking-[0.1em] text-white/45">AVERAGE OF PUBLISHED RECORDS</span>
        </figcaption>
        <div className="mt-[22px] flex h-[150px] items-end gap-[clamp(6px,1.4vw,16px)] border-b border-white/14">
          {perf.monthly.map((m) => (
            <div key={m.label} className="flex h-full flex-1 flex-col justify-end gap-2">
              <span className="text-center font-mono text-[10px] text-white/60">{m.value === null ? "—" : formatFixed(m.value, 1)}</span>
              <div className="bg-green" style={{ height: `${m.heightPct}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex gap-[clamp(6px,1.4vw,16px)]">
          {perf.monthly.map((m) => (
            <span key={m.label} className="flex-1 text-center font-mono text-[10px] text-white/45">
              {m.label}
            </span>
          ))}
        </div>
      </figure>

      <Drawer
        open={form !== null}
        onClose={close}
        width={580}
        label={form?.id ? "EDITING RECORD" : "NEW RECORD"}
        title={form?.id ? account(form.clientId) : "Add ad account data"}
      >
        {form && (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
              <Select
                label="Account / client"
                value={form.clientId}
                onChange={(clientId) => patch({ clientId })}
                options={[{ value: "", label: "Choose a client…" }, ...clients.map((c) => ({ value: c.id, label: c.name }))]}
                error={fieldErrors.clientId}
              />
              <TextInput label="Reporting period" value={form.period} onChange={(period) => patch({ period })} placeholder="Sep 2025 — Aug 2026" />
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
              {numField("spendLkr", "Spend (LKR)", "4180000")}
              {numField("roas", "ROAS", "6.1")}
              {numField("cpcLkr", "CPC (LKR)", "9.80")}
              {numField("cvrPct", "Conv. rate (%)", "7.2")}
              {numField("costPerPurchaseLkr", "Cost / purchase", "486")}
              {numField("purchases", "Purchases", "8,600")}
            </div>

            <Section label="Monthly ROAS — Jan to Aug">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2">
                {MONTH_LABELS.map((m, i) => (
                  <label key={m} className="grid gap-[5px]">
                    <span className="font-mono text-[9.5px] text-white/40">{m}</span>
                    <input
                      value={form.monthlyRoas[i]}
                      inputMode="decimal"
                      maxLength={6}
                      onChange={(e) => patch({ monthlyRoas: form.monthlyRoas.map((x, j) => (j === i ? e.target.value : x)) })}
                      className={cn(monoInputCls, "px-2 py-2.5 text-center text-sm")}
                    />
                  </label>
                ))}
              </div>
            </Section>

            <Section label="Spend split by objective (%)">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
                {SPLIT_KEYS.map((k) => (
                  <label key={k} className="grid gap-1.5">
                    <span className="text-[12.5px] text-white/65">{SPLIT_LABELS[k]}</span>
                    <input
                      value={form.split[k]}
                      inputMode="decimal"
                      maxLength={5}
                      onChange={(e) => patch({ split: { ...form.split, [k]: e.target.value } })}
                      className={cn(monoInputCls, "px-3 py-2.5 text-sm")}
                    />
                  </label>
                ))}
              </div>
              <p
                aria-live="polite"
                className={cn("font-mono text-[10.5px] tracking-[0.08em]", total === 100 ? "text-green-bright" : "text-white/50")}
              >
                SPLIT TOTAL: {total}%
              </p>
              {fieldErrors.split && <p className="text-[12.5px] text-[#F97066]">{fieldErrors.split}</p>}
            </Section>

            <Segmented
              label="Visibility"
              value={form.visibility}
              onChange={(visibility) => patch({ visibility })}
              off={{ value: "internal", label: "Internal only" }}
              on={{ value: "published", label: "Published" }}
            />
            <p className="-mt-2 text-[12.5px] leading-[1.6] text-white/50">
              Only published records are averaged into the figures shown on the public site.
            </p>

            <DrawerFooter
              saveLabel="Save record"
              pending={pending}
              error={error}
              onSave={() => run(() => saveAdRecord(form))}
              onCancel={close}
              onDelete={form.id ? () => run(() => deleteAdRecord(form.id!)) : undefined}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
