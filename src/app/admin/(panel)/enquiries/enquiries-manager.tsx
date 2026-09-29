"use client";

import { Mail, Phone } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import {
  CardChevron,
  CardList,
  Drawer,
  EmptyState,
  FilterChips,
  MobileCard,
  PageHeader,
  StatCard,
  StatRow,
  SearchField,
  TableShell,
  Toolbar,
  btnOutline,
  btnPrimary,
  cellCls,
  rowCls,
} from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import type { Enquiry } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/format";
import { deleteEnquiry, setEnquiryStatus } from "./actions";

type Filter = "inbox" | "new" | "archived";

export function EnquiriesManager({ enquiries, recentCount }: { enquiries: Enquiry[]; recentCount: number }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("inbox");
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enquiries
      .filter((e) => (filter === "archived" ? e.status === "archived" : filter === "new" ? e.status === "new" : e.status !== "archived"))
      .filter((e) => !q || `${e.name} ${e.company} ${e.email} ${e.message}`.toLowerCase().includes(q));
  }, [enquiries, query, filter]);

  const current = enquiries.find((e) => e.id === openId) ?? null;

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>, closeAfter = false) =>
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      else if (closeAfter) setOpenId(null);
    });

  const open = (e: Enquiry) => {
    setOpenId(e.id);
    setError(null);
    setConfirmDelete(false);
    if (e.status === "new") act(() => setEnquiryStatus(e.id, "read"));
  };

  const StatusLabel = ({ e }: { e: Enquiry }) => (
    <span className={cn("font-mono text-[10.5px] tracking-[0.1em]", e.status === "new" ? "text-green-bright" : "text-white/50")}>
      {e.status.toUpperCase()}
    </span>
  );

  return (
    <>
      <PageHeader
        crumb="INBOX / ENQUIRIES"
        title="Enquiries"
        description="Briefs sent through the contact form. Opening an enquiry marks it as read; archive it once someone has replied."
      />

      <StatRow>
        <StatCard label="NEW" value={enquiries.filter((e) => e.status === "new").length} accent />
        <StatCard label="IN INBOX" value={enquiries.filter((e) => e.status !== "archived").length} />
        <StatCard label="ARCHIVED" value={enquiries.filter((e) => e.status === "archived").length} />
        <StatCard label="LAST 30 DAYS" value={recentCount} />
      </StatRow>

      <Toolbar>
        <SearchField value={query} onChange={setQuery} placeholder="Search names, companies or messages" className="flex-[1_1_220px]" />
        <FilterChips<Filter>
          label="Filter enquiries"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "inbox", label: "INBOX" },
            { value: "new", label: "NEW" },
            { value: "archived", label: "ARCHIVED" },
          ]}
        />
      </Toolbar>

      <TableShell minWidth={860} head={["FROM", "SERVICE", "BUDGET", "RECEIVED", "STATUS", "ACTIONS"]}>
        {rows.map((e) => (
          <tr key={e.id} className={rowCls}>
            <td className="py-4 pl-5">
              <p className={cn("font-display text-[14.5px]", e.status === "new" ? "font-bold" : "font-semibold")}>{e.name}</p>
              <p className="mt-1 text-[13px] text-white/55">{e.company || e.email}</p>
            </td>
            <td className={cn(cellCls, "text-white/75")}>{e.service}</td>
            <td className={cn(cellCls, "font-mono text-[11px] text-white/60")}>{e.budget}</td>
            <td className={cn(cellCls, "font-mono text-[11px] text-white/60")}>{formatDateTime(e.createdAt)}</td>
            <td className={cellCls}>
              <StatusLabel e={e} />
            </td>
            <td className={cn(cellCls, "pr-5")}>
              <button type="button" onClick={() => open(e)} className={cn(btnOutline, "px-3.5 py-[9px] text-[13px]")}>
                Open
              </button>
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={6}>
              <EmptyState>NO ENQUIRIES HERE</EmptyState>
            </td>
          </tr>
        )}
      </TableShell>

      <CardList>
        {rows.map((e) => (
          <MobileCard key={e.id} onClick={() => open(e)} label={`Open enquiry from ${e.name}`}>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15.5px] font-semibold">{e.name}</p>
                <p className="mt-[3px] truncate text-[13px] text-white/60">{e.company || e.email}</p>
              </div>
              <StatusLabel e={e} />
              <CardChevron />
            </div>
            <p className="line-clamp-2 text-[13px] leading-[1.5] text-white/60">{e.message}</p>
            <p className="border-t border-white/10 pt-2.5 font-mono text-[10.5px] text-white/45">{formatDateTime(e.createdAt)}</p>
          </MobileCard>
        ))}
        {rows.length === 0 && <EmptyState bordered>NO ENQUIRIES HERE</EmptyState>}
      </CardList>

      <Drawer open={current !== null} onClose={() => !pending && setOpenId(null)} width={560} label="ENQUIRY" title={current?.name ?? ""}>
        {current && (
          <>
            <p className="-mt-3 font-mono text-[11px] text-white/45">RECEIVED {formatDateTime(current.createdAt).toUpperCase()}</p>
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px border border-white/12 bg-white/12">
              {[
                ["COMPANY", current.company || "—"],
                ["SERVICE", current.service],
                ["BUDGET", current.budget],
                ["PHONE", current.phone || "—"],
              ].map(([k, v]) => (
                <div key={k} className="bg-panel p-3.5">
                  <dt className="font-mono text-[10px] tracking-[0.1em] text-white/45">{k}</dt>
                  <dd className="mt-1.5 text-[14.5px]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-white/12 pt-[18px]">
              <p className="font-mono text-[10px] tracking-[0.1em] text-white/50">MESSAGE</p>
              <p className="mt-3 text-[15px] leading-[1.7] whitespace-pre-wrap text-white/85">{current.message}</p>
            </div>
            <div className="flex flex-wrap gap-2.5 border-t border-white/12 pt-[18px]">
              <a href={`mailto:${current.email}?subject=${encodeURIComponent("Re: your brief to Idearigs")}`} className={cn(btnPrimary, "px-5 py-3 text-sm")}>
                <Mail size={15} aria-hidden /> Reply by email
              </a>
              {current.phone && (
                <a href={`tel:${current.phone.replace(/[^\d+]/g, "")}`} className={cn(btnOutline, "px-5 py-3 text-sm")}>
                  <Phone size={15} aria-hidden /> Call
                </a>
              )}
            </div>
            {error && (
              <p role="alert" className="text-[13.5px] text-[#FDA29B]">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2.5 border-t border-white/12 pt-[18px]">
              {current.status === "archived" ? (
                <button type="button" disabled={pending} onClick={() => act(() => setEnquiryStatus(current.id, "read"))} className={cn(btnOutline, "px-5 py-3 text-sm")}>
                  Move to inbox
                </button>
              ) : (
                <button type="button" disabled={pending} onClick={() => act(() => setEnquiryStatus(current.id, "archived"), true)} className={cn(btnOutline, "px-5 py-3 text-sm")}>
                  Archive
                </button>
              )}
              <button type="button" disabled={pending} onClick={() => act(() => setEnquiryStatus(current.id, "new"), true)} className={cn(btnOutline, "px-5 py-3 text-sm")}>
                Mark unread
              </button>
              {confirmDelete ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => act(() => deleteEnquiry(current.id), true)}
                  className="ml-auto border border-[#F97066] px-4 py-3 text-sm text-[#FDA29B] hover:bg-[#F97066]/15"
                >
                  Confirm delete
                </button>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="ml-auto border border-white/20 px-4 py-3 text-sm text-white/70 hover:border-white hover:text-white">
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
