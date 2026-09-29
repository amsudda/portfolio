"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useTransition } from "react";
import { MediaDrop } from "@/components/admin/media-drop";
import { Badge, Drawer, DrawerFooter, PageHeader, Segmented, Select, TextInput, Thumb, btnOutline, EmptyState } from "@/components/admin/ui";
import { clipCategories } from "@/content/site";
import { cn } from "@/lib/cn";
import type { ReelClip } from "@/lib/db/schema";
import { deleteClip, moveClip, saveClip, saveHeroLoop, toggleClip, type ClipInput } from "./actions";

type ClientOption = { id: string; name: string };
type Form = ClipInput;

const toForm = (c?: ReelClip): Form => ({
  id: c?.id,
  title: c?.title ?? "",
  clientId: c?.clientId ?? null,
  duration: c?.duration ?? "",
  category: ((clipCategories as readonly string[]).includes(c?.category ?? "") ? c!.category : "Social cut") as Form["category"],
  fileUrl: c?.fileUrl ?? null,
  posterUrl: c?.posterUrl ?? null,
  status: c?.status ?? "hidden",
});

const iconBtn = cn(btnOutline, "size-11 md:size-[38px]");

export function ShowreelManager({
  clips,
  clients,
  heroLoopUrl,
  heroPosterUrl,
}: {
  clips: ReelClip[];
  clients: ClientOption[];
  heroLoopUrl: string | null;
  heroPosterUrl: string | null;
}) {
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? "Unassigned";
  const open = (c?: ReelClip) => {
    setForm(toForm(c));
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

  const quick = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      const res = await fn();
      setNotice(res.ok ? null : res.error ?? "Something went wrong.");
    });

  const liveCount = clips.filter((c) => c.status === "live").length;

  return (
    <>
      <PageHeader
        crumb="CONTENT / SHOWREEL CLIPS"
        title="Showreel"
        description="The hero background and the reel clips. Order here is the order visitors see — clip #1 is the “best work” player in the hero."
        action={{ label: "Add clip", onClick: () => open() }}
      />

      <section className="glass-admin mt-[clamp(22px,3vw,32px)] grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] items-center gap-5 rounded-2xl p-[clamp(18px,2.4vw,26px)]">
        <div>
          <p className="font-mono text-[10.5px] tracking-[0.12em] text-green-bright">HERO BACKGROUND LOOP</p>
          <h2 className="mt-2.5 text-[19px] font-semibold">Plays full-bleed behind the hero glass</h2>
          <p className="mt-2 text-[13.5px] leading-[1.6] text-white/55">
            Wide (16:9 or 21:9), no audio, under 12 seconds and 6MB so mobile loads fast. The still image shows while the video loads, or on its own if there’s no video. Changes save immediately.
          </p>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-[2fr_1fr]">
          <MediaDrop
            kind="video"
            value={heroLoopUrl}
            onChange={(url) => quick(() => saveHeroLoop({ heroLoopUrl: url, heroPosterUrl }))}
            prompt="CLICK OR DROP TO REPLACE LOOP"
            className="aspect-[21/9]"
          />
          <MediaDrop
            kind="image"
            value={heroPosterUrl}
            onChange={(url) => quick(() => saveHeroLoop({ heroLoopUrl, heroPosterUrl: url }))}
            prompt={"BACKGROUND\nIMAGE"}
            className="aspect-[21/9] sm:aspect-auto sm:h-full"
            compact
          />
        </div>
      </section>

      <div className="mt-[clamp(24px,3vw,34px)] flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold">Reel clips</h2>
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-white/45">
          {clips.length} CLIPS · {liveCount} LIVE
        </span>
      </div>
      {notice && (
        <p role="status" className="mt-3 text-[13.5px] text-[#FDA29B]">
          {notice}
        </p>
      )}

      {clips.length === 0 ? (
        <EmptyState bordered>NO CLIPS YET — ADD THE FIRST CUT</EmptyState>
      ) : (
        <ol className="mt-3.5 grid gap-3">
          {clips.map((c, i) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-4 rounded-[14px] border border-white/14 bg-white/4 p-3.5 backdrop-blur-[18px]"
            >
              <div className="relative aspect-video w-[132px] flex-none">
                <Thumb src={c.posterUrl ?? c.fileUrl} className="absolute inset-0" />
                <span className="absolute right-1.5 bottom-1.5 bg-[rgba(8,9,8,0.75)] px-1.5 py-[3px] font-mono text-[9.5px] text-white/75">
                  {c.duration || "—:—"}
                </span>
              </div>
              <div className="min-w-0 flex-[1_1_200px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-white/40">#{i + 1}</span>
                  <span className="font-display text-base font-semibold">{c.title}</span>
                  <Badge on={c.status === "live"}>{c.status}</Badge>
                </div>
                <p className="mt-[7px] truncate font-mono text-[10.5px] tracking-[0.06em] text-white/45">
                  {clientName(c.clientId)} · {c.fileUrl ? c.fileUrl.split("/").pop() : "no file"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={pending || i === 0} onClick={() => quick(() => moveClip(c.id, -1))} aria-label={`Move ${c.title} up`} className={iconBtn}>
                  <ChevronUp size={15} strokeWidth={2.2} aria-hidden />
                </button>
                <button
                  type="button"
                  disabled={pending || i === clips.length - 1}
                  onClick={() => quick(() => moveClip(c.id, 1))}
                  aria-label={`Move ${c.title} down`}
                  className={iconBtn}
                >
                  <ChevronDown size={15} strokeWidth={2.2} aria-hidden />
                </button>
                <button type="button" disabled={pending} onClick={() => quick(() => toggleClip(c.id))} className={cn(btnOutline, "min-h-11 px-3.5 text-[13px] md:min-h-[38px]")}>
                  {c.status === "live" ? "Hide" : "Go live"}
                </button>
                <button type="button" onClick={() => open(c)} className={cn(btnOutline, "min-h-11 px-3.5 text-[13px] md:min-h-[38px]")}>
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <Drawer open={form !== null} onClose={close} width={520} label={form?.id ? "EDITING CLIP" : "NEW CLIP"} title={form?.id ? form.title || "Clip" : "Add a reel clip"}>
        {form && (
          <>
            <MediaDrop kind="video" value={form.fileUrl ?? null} onChange={(fileUrl) => patch({ fileUrl })} prompt="CLICK OR DROP MP4 · UP TO 200MB" className="aspect-video" />
            {fieldErrors.fileUrl && <p className="-mt-2 text-[12.5px] text-[#F97066]">{fieldErrors.fileUrl}</p>}
            <TextInput label="Clip title" value={form.title} onChange={(title) => patch({ title })} placeholder="e.g. pour sequence" error={fieldErrors.title} hint="Shown after the client’s short name: “Ceylon Leaf — pour sequence”." />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
              <Select
                label="Client"
                value={form.clientId ?? ""}
                onChange={(v) => patch({ clientId: v || null })}
                options={[{ value: "", label: "Unassigned" }, ...clients.map((c) => ({ value: c.id, label: c.name }))]}
              />
              <TextInput label="Duration" value={form.duration} onChange={(duration) => patch({ duration })} placeholder="0:48" mono maxLength={5} error={fieldErrors.duration} />
              <Select label="Category" value={form.category} onChange={(category) => patch({ category })} options={clipCategories} />
            </div>
            <div className="grid gap-[7px]">
              <span className="font-mono text-[10px] tracking-[0.1em] text-white/50">POSTER FRAME (OPTIONAL)</span>
              <MediaDrop kind="image" value={form.posterUrl ?? null} onChange={(posterUrl) => patch({ posterUrl })} prompt="JPG · 16:9" className="aspect-video max-w-[240px]" compact />
            </div>
            <Segmented label="Status" value={form.status} onChange={(status) => patch({ status })} off={{ value: "hidden", label: "Hidden" }} on={{ value: "live", label: "Live" }} />
            <DrawerFooter
              saveLabel="Save clip"
              pending={pending}
              error={error}
              onSave={() => run(() => saveClip(form))}
              onCancel={close}
              onDelete={form.id ? () => run(() => deleteClip(form.id!)) : undefined}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
