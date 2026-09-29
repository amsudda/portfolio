"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { MediaDrop } from "@/components/admin/media-drop";
import {
  CardChevron,
  CardList,
  Drawer,
  DrawerFooter,
  EditButton,
  EmptyState,
  FilterChips,
  MobileCard,
  PageHeader,
  Section,
  Segmented,
  Select,
  StatCard,
  StatRow,
  SearchField,
  TableShell,
  TagToggles,
  TextArea,
  TextInput,
  Thumb,
  Toolbar,
  btnOutline,
  cellCls,
  inputCls,
  monoInputCls,
  rowCls,
} from "@/components/admin/ui";
import { projectSectors, projectServices } from "@/content/site";
import { cn } from "@/lib/cn";
import type { Metric, Project } from "@/lib/db/schema";
import { formatMonoDate } from "@/lib/format";
import { deleteProject, saveProject, type ProjectInput } from "./actions";

type ClientOption = { id: string; name: string; sector: string };
type Form = Omit<ProjectInput, "trend" | "services" | "sector"> & {
  trend: string[];
  services: (typeof projectServices)[number][];
  sector: (typeof projectSectors)[number];
};
type Filter = "all" | "published" | "draft";

const pad = <T,>(list: T[], n: number, make: () => T): T[] => [...list, ...Array.from({ length: Math.max(0, n - list.length) }, make)];
const emptyMetric = (): Metric => ({ label: "", value: "" });

function toForm(p?: Project): Form {
  return {
    id: p?.id,
    slug: p?.slug ?? "",
    title: p?.title ?? "",
    clientId: p?.clientId ?? null,
    sector: ((projectSectors as readonly string[]).includes(p?.sector ?? "") ? p!.sector : "FMCG") as Form["sector"],
    services: (p?.services ?? []).filter((s): s is Form["services"][number] => (projectServices as readonly string[]).includes(s)),
    summary: p?.summary ?? "",
    metrics: pad(p?.metrics ?? [], 2, emptyMetric),
    status: p?.status ?? "draft",
    heroUrl: p?.heroUrl ?? null,
    reelUrl: p?.reelUrl ?? null,
    gallery: p?.gallery ?? [],
    featured: p?.featured ?? false,
    platforms: p?.platforms ?? "",
    tags: p?.tags ?? "",
    cardStats: pad(p?.cardStats ?? [], 3, emptyMetric),
    trend: pad((p?.trend ?? []).map(String), 8, () => ""),
    headline: p?.headline ?? "",
    intro: p?.intro ?? "",
    sectorDetail: p?.sectorDetail ?? "",
    engagementPeriod: p?.engagementPeriod ?? "",
    scope: p?.scope ?? "",
    keyMetrics: pad(p?.keyMetrics ?? [], 4, emptyMetric),
    problem: p?.problem ?? "",
    approach: p?.approach?.length ? p.approach : [{ title: "", body: "" }],
    quote: p?.quote ?? "",
    quoteAttribution: p?.quoteAttribution ?? "",
  };
}

function MetricRows({
  rows,
  onChange,
  labelHint,
  valueHint,
}: {
  rows: Metric[];
  onChange: (rows: Metric[]) => void;
  labelHint: string;
  valueHint: string;
}) {
  const set = (i: number, p: Partial<Metric>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  return (
    <div className="grid gap-2.5">
      {rows.map((m, i) => (
        <div key={i} className="grid grid-cols-[1.4fr_1fr] gap-2.5">
          <input aria-label={`Metric ${i + 1} label`} value={m.label} onChange={(e) => set(i, { label: e.target.value })} placeholder={labelHint} maxLength={60} className={inputCls} />
          <input aria-label={`Metric ${i + 1} value`} value={m.value} onChange={(e) => set(i, { value: e.target.value })} placeholder={valueHint} maxLength={30} className={monoInputCls} />
        </div>
      ))}
    </div>
  );
}

function Disclosure({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-white/12 pt-[18px]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-mono text-[10px] tracking-[0.1em] text-white/50">{title}</span>
          <span className="mt-1 block text-[12.5px] text-white/40">{hint}</span>
        </span>
        <ChevronDown size={16} className="flex-none text-white/50 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-4 grid gap-4">{children}</div>
    </details>
  );
}

export function ProjectsManager({ projects, clients }: { projects: Project[]; clients: ClientOption[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? "—";

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => filter === "all" || p.status === filter)
      .filter((p) => !q || `${p.title} ${clientName(p.clientId)}`.toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, query, filter, clients]);

  const open = (p?: Project) => {
    setForm(toForm(p));
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

  const headline = (p: Project) => (p.metrics[0] ? `${p.metrics[0].value} ${p.metrics[0].label.toLowerCase()}` : "—");
  const services = (p: Project) => p.services.join(" · ").toUpperCase() || "—";
  const mediaPending = projects.filter((p) => !p.heroUrl).length;
  const clientOptions = [{ value: "", label: "No client" }, ...clients.map((c) => ({ value: c.id, label: c.name }))];

  return (
    <>
      <PageHeader
        crumb="CONTENT / PROJECTS"
        title="Project manager"
        description="Case studies published to the portfolio and project pages. Edits go live when a project is set to Published."
        action={{ label: "Add project", onClick: () => open() }}
      />

      <StatRow>
        <StatCard label="TOTAL PROJECTS" value={projects.length} />
        <StatCard label="PUBLISHED" value={projects.filter((p) => p.status === "published").length} accent />
        <StatCard label="DRAFTS" value={projects.filter((p) => p.status === "draft").length} />
        <StatCard label="MEDIA PENDING" value={mediaPending} note="NO HERO IMAGE YET" />
      </StatRow>

      <Toolbar>
        <SearchField value={query} onChange={setQuery} placeholder="Search projects or clients" className="flex-[1_1_220px]" />
        <FilterChips<Filter>
          label="Filter by status"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "ALL" },
            { value: "published", label: "PUBLISHED" },
            { value: "draft", label: "DRAFTS" },
          ]}
        />
      </Toolbar>

      <TableShell minWidth={860} head={["PROJECT", "CLIENT", "SERVICES", "HEADLINE", "STATUS", "ACTIONS"]}>
        {rows.map((p) => (
          <tr key={p.id} className={rowCls}>
            <td className="py-4 pl-5">
              <div className="flex min-w-0 items-center gap-3">
                <Thumb src={p.heroUrl} className="h-[38px] w-[52px]" />
                <div className="min-w-0">
                  <p className="font-display text-[14.5px] font-semibold">{p.title}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.08em] text-white/40">UPDATED {formatMonoDate(p.updatedAt)}</p>
                </div>
              </div>
            </td>
            <td className={cn(cellCls, "text-white/78")}>{clientName(p.clientId)}</td>
            <td className={cn(cellCls, "font-mono text-[10.5px] tracking-[0.06em] text-white/55")}>{services(p)}</td>
            <td className={cn(cellCls, "max-w-[180px] truncate font-mono text-green-bright")}>{headline(p)}</td>
            <td className={cn(cellCls, "font-mono text-[10.5px] tracking-[0.1em]", p.status === "published" ? "text-green-bright" : "text-white/50")}>
              {p.status.toUpperCase()}
            </td>
            <td className={cn(cellCls, "pr-5")}>
              <EditButton onClick={() => open(p)} label={`Edit ${p.title}`} />
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={6}>
              <EmptyState>NO PROJECTS MATCH THIS FILTER</EmptyState>
            </td>
          </tr>
        )}
      </TableShell>

      <CardList>
        {rows.map((p) => (
          <MobileCard key={p.id} onClick={() => open(p)} label={`Edit ${p.title}`}>
            <div className="flex items-center gap-3">
              <Thumb src={p.heroUrl} className="h-12 w-16 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15.5px] font-semibold">{p.title}</p>
                <p className="mt-[3px] text-[13px] text-white/60">{clientName(p.clientId)}</p>
              </div>
              <CardChevron />
            </div>
            <p className="font-mono text-[10px] tracking-[0.06em] text-white/45">{services(p)}</p>
            <div className="flex justify-between gap-2.5 border-t border-white/10 pt-2.5">
              <span className="font-mono text-[13px] text-green-bright">{headline(p)}</span>
              <span className={cn("font-mono text-[10.5px] tracking-[0.1em]", p.status === "published" ? "text-green-bright" : "text-white/50")}>
                {p.status.toUpperCase()}
              </span>
            </div>
          </MobileCard>
        ))}
        {rows.length === 0 && <EmptyState bordered>NO PROJECTS MATCH THIS FILTER</EmptyState>}
      </CardList>

      <Drawer
        open={form !== null}
        onClose={close}
        width={600}
        label={form?.id ? "EDITING PROJECT" : "NEW PROJECT"}
        title={form?.id ? clientName(form.clientId ?? null) : "Add a case study"}
      >
        {form && (
          <>
            <TextInput label="Project title" value={form.title} onChange={(title) => patch({ title })} placeholder="e.g. Retail Launch" error={fieldErrors.title} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
              <Select
                label="Client"
                value={form.clientId ?? ""}
                onChange={(v) => {
                  const c = clients.find((x) => x.id === v);
                  const sector = (projectSectors as readonly string[]).includes(c?.sector ?? "") ? (c!.sector as Form["sector"]) : form.sector;
                  patch({ clientId: v || null, sector: form.id ? form.sector : sector });
                }}
                options={clientOptions}
                error={fieldErrors.clientId}
              />
              <Select label="Sector" value={form.sector} onChange={(sector) => patch({ sector })} options={projectSectors} />
            </div>
            <TagToggles label="Services" options={projectServices} value={form.services} onChange={(services) => patch({ services })} />
            <TextArea
              label="Summary"
              value={form.summary}
              onChange={(summary) => patch({ summary })}
              placeholder="Two or three lines shown on the home and portfolio cards."
              error={fieldErrors.summary}
            />

            <Section label="Headline metrics">
              <MetricRows rows={form.metrics} onChange={(metrics) => patch({ metrics })} labelHint="Label, e.g. ROAS over 12 months" valueHint="6.1x" />
              {fieldErrors.metrics && <p className="text-[12.5px] text-[#F97066]">{fieldErrors.metrics}</p>}
            </Section>

            <Section label="Media">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
                <MediaDrop kind="image" value={form.heroUrl ?? null} onChange={(heroUrl) => patch({ heroUrl })} prompt={"HERO IMAGE\n16:9"} className="aspect-[4/3]" compact />
                <MediaDrop kind="video" value={form.reelUrl ?? null} onChange={(reelUrl) => patch({ reelUrl })} prompt={"REEL CLIP\nMP4"} className="aspect-[4/3]" compact />
              </div>
            </Section>

            <Section
              label="Delivered assets (gallery)"
              aside={
                <button
                  type="button"
                  onClick={() => patch({ gallery: [...form.gallery, { url: null, label: "", caption: "" }] })}
                  disabled={form.gallery.length >= 12}
                  className={cn(btnOutline, "gap-1.5 px-3 py-1.5 text-[12.5px]")}
                >
                  <Plus size={14} aria-hidden /> Add
                </button>
              }
            >
              {form.gallery.length === 0 && <p className="text-[13px] text-white/40">No assets yet. Shown as 4:5 tiles on the case study page.</p>}
              {form.gallery.map((g, i) => {
                const set = (p: Partial<typeof g>) => patch({ gallery: form.gallery.map((x, j) => (j === i ? { ...x, ...p } : x)) });
                return (
                  <div key={i} className="grid grid-cols-[88px_1fr_auto] items-start gap-2.5">
                    <MediaDrop kind="image" value={g.url ?? null} onChange={(u) => set({ url: u })} prompt={"4:5"} className="aspect-[4/5]" compact />
                    <div className="grid gap-2">
                      <input aria-label={`Asset ${i + 1} type`} value={g.label} onChange={(e) => set({ label: e.target.value })} placeholder="Type, e.g. Product still" maxLength={40} className={inputCls} />
                      <input aria-label={`Asset ${i + 1} caption`} value={g.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="Caption" maxLength={120} className={inputCls} />
                    </div>
                    <button
                      type="button"
                      onClick={() => patch({ gallery: form.gallery.filter((_, j) => j !== i) })}
                      aria-label={`Remove asset ${i + 1}`}
                      className="flex size-11 items-center justify-center border border-white/20 text-white/60 hover:text-white"
                    >
                      <Trash2 size={15} aria-hidden />
                    </button>
                  </div>
                );
              })}
            </Section>

            <Disclosure title="HOME & PORTFOLIO CARDS" hint="Featured flag, platform line, three card stats and the 8-bar trend.">
              <Segmented
                label="Show on the home page"
                value={form.featured ? "yes" : "no"}
                onChange={(v) => patch({ featured: v === "yes" })}
                off={{ value: "no", label: "Portfolio only" }}
                on={{ value: "yes", label: "Featured on home" }}
              />
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                <TextInput label="Platforms (home card)" value={form.platforms} onChange={(platforms) => patch({ platforms })} placeholder="IG · FB · TikTok" />
                <TextInput label="Tag line (portfolio card)" value={form.tags} onChange={(tags) => patch({ tags })} placeholder="Social · Meta ads · Studio" />
              </div>
              <div className="grid gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.1em] text-white/50">CARD STATS (3)</span>
                <MetricRows rows={form.cardStats} onChange={(cardStats) => patch({ cardStats })} labelHint="Label, e.g. Followers" valueHint="48.2K" />
              </div>
              <div className="grid gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.1em] text-white/50">TREND — 8 VALUES, OLDEST FIRST</span>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {form.trend.map((v, i) => (
                    <input
                      key={i}
                      aria-label={`Trend value ${i + 1}`}
                      value={v}
                      inputMode="decimal"
                      onChange={(e) => patch({ trend: form.trend.map((x, j) => (j === i ? e.target.value : x)) })}
                      className={cn(monoInputCls, "px-2 text-center")}
                    />
                  ))}
                </div>
              </div>
            </Disclosure>

            <Disclosure title="CASE STUDY PAGE" hint="Headline, facts, key metrics, the problem, what we did and the quote.">
              <TextInput label="Page headline (H1)" value={form.headline} onChange={(headline) => patch({ headline })} placeholder="Twelve months of always-on content for…" maxLength={200} />
              <TextArea label="Intro" value={form.intro} onChange={(intro) => patch({ intro })} rows={3} />
              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
                <TextInput label="Sector detail" value={form.sectorDetail} onChange={(sectorDetail) => patch({ sectorDetail })} placeholder="FMCG · Export & retail" />
                <TextInput label="Engagement" value={form.engagementPeriod} onChange={(engagementPeriod) => patch({ engagementPeriod })} placeholder="Sep 2025 — Aug 2026" />
                <TextInput label="Scope" value={form.scope} onChange={(scope) => patch({ scope })} placeholder="Social, Meta ads, studio" />
              </div>
              <div className="grid gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.1em] text-white/50">KEY METRICS (UP TO 4)</span>
                <MetricRows rows={form.keyMetrics} onChange={(keyMetrics) => patch({ keyMetrics })} labelHint="Label, e.g. Average CPC" valueHint="LKR 9.80" />
              </div>
              <TextArea label="The problem" value={form.problem} onChange={(problem) => patch({ problem })} rows={6} hint="Separate paragraphs with a blank line." />
              <div className="grid gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-white/50">WHAT WE DID</span>
                  <button
                    type="button"
                    onClick={() => patch({ approach: [...form.approach, { title: "", body: "" }] })}
                    disabled={form.approach.length >= 8}
                    className={cn(btnOutline, "gap-1.5 px-3 py-1.5 text-[12.5px]")}
                  >
                    <Plus size={14} aria-hidden /> Add step
                  </button>
                </div>
                {form.approach.map((s, i) => {
                  const set = (p: Partial<typeof s>) => patch({ approach: form.approach.map((x, j) => (j === i ? { ...x, ...p } : x)) });
                  return (
                    <div key={i} className="grid grid-cols-[28px_1fr_auto] items-start gap-2.5">
                      <span className="pt-3.5 font-mono text-[11.5px] text-green-bright">{String(i + 1).padStart(2, "0")}</span>
                      <div className="grid gap-2">
                        <input aria-label={`Step ${i + 1} title`} value={s.title} onChange={(e) => set({ title: e.target.value })} placeholder="Step title" maxLength={80} className={inputCls} />
                        <textarea aria-label={`Step ${i + 1} description`} value={s.body} onChange={(e) => set({ body: e.target.value })} rows={2} maxLength={400} className={cn(inputCls, "resize-y")} />
                      </div>
                      <button
                        type="button"
                        onClick={() => patch({ approach: form.approach.filter((_, j) => j !== i) })}
                        aria-label={`Remove step ${i + 1}`}
                        className="flex size-11 items-center justify-center border border-white/20 text-white/60 hover:text-white"
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
                  );
                })}
              </div>
              <TextArea label="Client quote" value={form.quote} onChange={(quote) => patch({ quote })} rows={3} />
              <TextInput label="Quote attribution" value={form.quoteAttribution} onChange={(quoteAttribution) => patch({ quoteAttribution })} placeholder="Marketing Director — Ceylon Leaf Tea Co." />
              <TextInput
                label="URL slug"
                value={form.slug}
                onChange={(slug) => patch({ slug })}
                mono
                placeholder="generated from client + title"
                hint={`Page lives at /work/${form.slug || "…"}`}
                error={fieldErrors.slug}
              />
            </Disclosure>

            <Segmented
              label="Status"
              value={form.status}
              onChange={(status) => patch({ status })}
              off={{ value: "draft", label: "Draft" }}
              on={{ value: "published", label: "Published" }}
            />

            <DrawerFooter
              saveLabel="Save project"
              pending={pending}
              error={error}
              onSave={() => run(() => saveProject(form))}
              onCancel={close}
              onDelete={form.id ? () => run(() => deleteProject(form.id!)) : undefined}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
