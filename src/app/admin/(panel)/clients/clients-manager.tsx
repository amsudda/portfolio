"use client";

import { useMemo, useState, useTransition } from "react";
import { MediaDrop } from "@/components/admin/media-drop";
import {
  CardChevron,
  CardList,
  Drawer,
  DrawerFooter,
  EditButton,
  EmptyState,
  MobileCard,
  PageHeader,
  Segmented,
  Select,
  StatCard,
  StatRow,
  SearchField,
  TableShell,
  TextInput,
  Thumb,
  cellCls,
  rowCls,
} from "@/components/admin/ui";
import { clientSectors } from "@/content/site";
import { cn } from "@/lib/cn";
import type { Client } from "@/lib/db/schema";
import { deleteClient, saveClient } from "./actions";

type Form = {
  id?: string;
  name: string;
  shortName: string;
  sector: (typeof clientSectors)[number];
  sinceYear: string;
  engagement: "retainer" | "project";
  logoUrl: string | null;
};

const blank = (): Form => ({ name: "", shortName: "", sector: "FMCG", sinceYear: "", engagement: "project", logoUrl: null });

const toForm = (c: Client): Form => ({
  id: c.id,
  name: c.name,
  shortName: c.shortName ?? "",
  sector: (clientSectors as readonly string[]).includes(c.sector) ? (c.sector as Form["sector"]) : "Services",
  sinceYear: c.sinceYear ? String(c.sinceYear) : "",
  engagement: c.engagement,
  logoUrl: c.logoUrl,
});

export function ClientsManager({ clients }: { clients: Client[] }) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? clients.filter((c) => `${c.name} ${c.sector}`.toLowerCase().includes(q)) : clients;
  }, [clients, query]);

  const open = (f: Form) => {
    setForm(f);
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

  const engagementLabel = (c: Client) => (c.engagement === "retainer" ? "RETAINER" : "PROJECT BASED");

  return (
    <>
      <PageHeader
        crumb="CONTENT / CLIENTS"
        title="Client base"
        description="The logo grid on the portfolio page. Listed clients also appear in the account picker on projects and ad records."
        action={{ label: "Add client", onClick: () => open(blank()) }}
      />

      <StatRow>
        <StatCard label="TOTAL CLIENTS" value={clients.length} />
        <StatCard label="ON RETAINER" value={clients.filter((c) => c.engagement === "retainer").length} accent />
        <StatCard label="PROJECT BASED" value={clients.filter((c) => c.engagement !== "retainer").length} />
        <StatCard label="LOGOS MISSING" value={clients.filter((c) => !c.logoUrl).length} />
      </StatRow>

      <SearchField value={query} onChange={setQuery} placeholder="Search clients or sectors" className="mt-[clamp(22px,3vw,32px)] max-w-[420px]" />

      <TableShell minWidth={820} head={["CLIENT", "SECTOR", "SINCE", "ENGAGEMENT", "LOGO", "ACTIONS"]}>
        {rows.map((c) => (
          <tr key={c.id} className={rowCls}>
            <td className="py-[15px] pl-5">
              <div className="flex items-center gap-3">
                <Thumb src={c.logoUrl} className="h-[30px] w-11 bg-white/90" />
                <span className="font-display text-[14.5px] font-semibold">{c.name}</span>
              </div>
            </td>
            <td className={cn(cellCls, "text-white/75")}>{c.sector}</td>
            <td className={cn(cellCls, "font-mono text-white/70")}>{c.sinceYear ?? "—"}</td>
            <td className={cn(cellCls, "font-mono text-[10.5px] tracking-[0.08em]", c.engagement === "retainer" ? "text-green-bright" : "text-white/60")}>
              {engagementLabel(c)}
            </td>
            <td className={cn(cellCls, "font-mono text-[10.5px] tracking-[0.08em]", c.logoUrl ? "text-white/60" : "text-green-bright")}>
              {c.logoUrl ? "UPLOADED" : "MISSING"}
            </td>
            <td className={cn(cellCls, "pr-5")}>
              <EditButton onClick={() => open(toForm(c))} label={`Edit ${c.name}`} />
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={6}>
              <EmptyState>NO CLIENTS MATCH THIS SEARCH</EmptyState>
            </td>
          </tr>
        )}
      </TableShell>

      <CardList>
        {rows.map((c) => (
          <MobileCard key={c.id} onClick={() => open(toForm(c))} label={`Edit ${c.name}`}>
            <div className="flex items-center gap-3">
              <Thumb src={c.logoUrl} className="h-9 w-[52px] rounded-lg bg-white/90" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15.5px] font-semibold">{c.name}</p>
                <p className="mt-[3px] text-[13px] text-white/60">
                  {c.sector} · since {c.sinceYear ?? "—"}
                </p>
              </div>
              <CardChevron />
            </div>
            <div className="flex justify-between gap-2.5 border-t border-white/10 pt-2.5 font-mono text-[10.5px] tracking-[0.08em]">
              <span className={c.engagement === "retainer" ? "text-green-bright" : "text-white/60"}>{engagementLabel(c)}</span>
              <span className={c.logoUrl ? "text-white/60" : "text-green-bright"}>LOGO {c.logoUrl ? "UPLOADED" : "MISSING"}</span>
            </div>
          </MobileCard>
        ))}
        {rows.length === 0 && <EmptyState bordered>NO CLIENTS MATCH THIS SEARCH</EmptyState>}
      </CardList>

      <Drawer
        open={form !== null}
        onClose={close}
        width={500}
        label={form?.id ? "EDITING CLIENT" : "NEW CLIENT"}
        title={form?.id ? form.name || "Client" : "Add a client"}
      >
        {form && (
          <>
            <MediaDrop
              kind="logo"
              value={form.logoUrl}
              onChange={(logoUrl) => patch({ logoUrl })}
              prompt="DROP LOGO · SVG OR PNG, TRANSPARENT"
              className="h-24"
            />
            <TextInput label="Client name" value={form.name} onChange={(name) => patch({ name })} placeholder="e.g. Ceylon Leaf Tea Co." error={fieldErrors.name} />
            <TextInput
              label="Short name"
              value={form.shortName}
              onChange={(shortName) => patch({ shortName })}
              placeholder="e.g. Ceylon Leaf"
              hint="Used in captions like “Ceylon Leaf — pour sequence”. Optional."
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
              <Select label="Sector" value={form.sector} onChange={(sector) => patch({ sector })} options={clientSectors} />
              <TextInput
                label="Client since"
                value={form.sinceYear}
                onChange={(sinceYear) => patch({ sinceYear })}
                placeholder="2025"
                mono
                inputMode="numeric"
                maxLength={4}
                error={fieldErrors.sinceYear}
              />
            </div>
            <Segmented
              label="Engagement type"
              value={form.engagement}
              onChange={(engagement) => patch({ engagement })}
              off={{ value: "project", label: "Project based" }}
              on={{ value: "retainer", label: "Retainer" }}
            />
            <DrawerFooter
              saveLabel="Save client"
              pending={pending}
              error={error}
              onSave={() => run(() => saveClient(form))}
              onCancel={close}
              onDelete={form.id ? () => run(() => deleteClient(form.id!)) : undefined}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
