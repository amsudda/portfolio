"use client";

import { LoaderCircle, Pencil, Upload } from "lucide-react";
import { useMemo, useRef, useState, useTransition } from "react";
import { MediaDrop, uploadFile } from "@/components/admin/media-drop";
import {
  Drawer,
  DrawerFooter,
  EmptyState,
  FilterChips,
  PageHeader,
  Segmented,
  Select,
  SearchField,
  TextInput,
  Thumb,
  Toolbar,
  btnOutline,
} from "@/components/admin/ui";
import { assetRatios } from "@/content/site";
import { cn } from "@/lib/cn";
import type { MediaAsset } from "@/lib/db/schema";
import { createAssetsFromUploads, deleteAsset, saveAsset, toggleAssetStatus, type AssetInput } from "./actions";

type ClientOption = { id: string; name: string };
type Filter = "all" | "photo" | "video" | "draft";
type Form = AssetInput;

const toForm = (a?: MediaAsset): Form => ({
  id: a?.id,
  caption: a?.caption ?? "",
  label: a?.label ?? "",
  clientId: a?.clientId ?? null,
  kind: a?.kind ?? "photo",
  ratio: a?.ratio ?? "3:4",
  url: a?.url ?? null,
  status: a?.status ?? "unpublished",
});

export function GalleryManager({ assets, clients }: { assets: MediaAsset[]; clients: ClientOption[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);
  const [over, setOver] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? "Unassigned";

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets
      .filter((a) =>
        filter === "photo" ? a.kind === "photo" : filter === "video" ? a.kind === "video_frame" : filter === "draft" ? a.status !== "published" : true,
      )
      .filter((a) => !q || `${a.caption} ${clientName(a.clientId)}`.toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, query, filter, clients]);

  const open = (a?: MediaAsset) => {
    setForm(toForm(a));
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

  async function uploadMany(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setNotice(null);
    setBulk({ done: 0, total: list.length });
    const urls: string[] = [];
    const failures: string[] = [];
    for (const f of list) {
      try {
        urls.push(await uploadFile(f, "any"));
      } catch (e) {
        failures.push(e instanceof Error ? e.message : f.name);
      }
      setBulk((b) => (b ? { ...b, done: b.done + 1 } : b));
    }
    if (urls.length) {
      const res = await createAssetsFromUploads(urls);
      if (!res.ok) failures.push(res.error);
    }
    setBulk(null);
    if (fileRef.current) fileRef.current.value = "";
    setNotice(
      [urls.length ? `${urls.length} file${urls.length === 1 ? "" : "s"} added as unpublished — add captions, then publish.` : "", ...failures]
        .filter(Boolean)
        .join(" "),
    );
  }

  return (
    <>
      <PageHeader
        crumb="CONTENT / STUDIO GALLERY"
        title="Media library"
        description="Stills and frames from the studio floor. Published assets appear in the gallery on the home and portfolio pages."
        action={{ label: "Add asset", onClick: () => open() }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          uploadMany(e.dataTransfer.files);
        }}
        className={cn(
          "mt-[clamp(22px,3vw,32px)] flex flex-wrap items-center justify-between gap-4 border border-dashed bg-white/3 p-[clamp(22px,3vw,34px)] transition-colors",
          over ? "border-green bg-green/5" : "border-white/26",
        )}
      >
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 flex-none items-center justify-center border border-white/20">
            {bulk ? <LoaderCircle size={20} className="animate-spin text-green-bright" aria-hidden /> : <Upload size={20} className="text-green-bright" aria-hidden />}
          </div>
          <div>
            <p className="font-display text-base font-semibold">{bulk ? `Uploading ${bulk.done} of ${bulk.total}…` : "Drop files to upload"}</p>
            <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.08em] text-white/45">JPG, PNG, WEBP, MP4 · UP TO 200MB EACH</p>
          </div>
        </div>
        <button type="button" disabled={!!bulk} onClick={() => fileRef.current?.click()} className={cn(btnOutline, "px-5 py-3 text-sm")}>
          Browse files
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => uploadMany(e.target.files)}
        />
      </div>
      {notice && (
        <p role="status" className="mt-3 text-[13.5px] text-white/70">
          {notice}
        </p>
      )}

      <Toolbar>
        <SearchField value={query} onChange={setQuery} placeholder="Search captions or clients" className="flex-[1_1_220px]" />
        <FilterChips<Filter>
          label="Filter assets"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "ALL" },
            { value: "photo", label: "PHOTO" },
            { value: "video", label: "VIDEO FRAME" },
            { value: "draft", label: "UNPUBLISHED" },
          ]}
        />
      </Toolbar>

      {items.length === 0 ? (
        <EmptyState bordered>NO ASSETS MATCH THIS FILTER</EmptyState>
      ) : (
        <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3.5">
          {items.map((a) => {
            const live = a.status === "published";
            return (
              <li key={a.id} className="overflow-hidden rounded-[14px] border border-white/14 bg-white/4 backdrop-blur-[18px]">
                <div className="relative aspect-[4/3]">
                  <Thumb src={a.url} className="absolute inset-0 border-0" />
                  <span className="absolute top-2.5 left-2.5 bg-[rgba(8,9,8,0.7)] px-2 py-[5px] font-mono text-[9.5px] tracking-[0.08em] text-white/70">
                    {a.ratio}
                  </span>
                  <span
                    className={cn(
                      "absolute top-2.5 right-2.5 px-2 py-[5px] font-mono text-[9.5px] tracking-[0.08em]",
                      live ? "bg-green text-on-green" : "bg-[rgba(8,9,8,0.7)] text-white/70",
                    )}
                  >
                    {a.status.toUpperCase()}
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="font-display text-[14.5px] font-semibold">{a.caption || "Untitled asset"}</p>
                  <p className="mt-[5px] truncate font-mono text-[10px] tracking-[0.08em] text-white/45">
                    {clientName(a.clientId).toUpperCase()} · {a.kind === "photo" ? "PHOTO" : "VIDEO FRAME"}
                  </p>
                  <div className="mt-3.5 flex gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          const res = await toggleAssetStatus(a.id);
                          setNotice(res.ok ? null : res.error);
                        })
                      }
                      className={cn(btnOutline, "min-h-11 flex-1 p-[9px] text-[13px] md:min-h-0")}
                    >
                      {live ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => open(a)}
                      aria-label={`Edit ${a.caption || "asset"}`}
                      className={cn(btnOutline, "w-11 md:w-[38px]")}
                    >
                      <Pencil size={15} aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Drawer
        open={form !== null}
        onClose={close}
        width={520}
        label={form?.id ? "EDITING ASSET" : "NEW ASSET"}
        title={form?.id ? form.caption || "Asset" : "Add a gallery asset"}
      >
        {form && (
          <>
            <MediaDrop kind="any" value={form.url ?? null} onChange={(url) => patch({ url })} prompt="CLICK OR DROP TO UPLOAD FILE" className="aspect-video" />
            <TextInput label="Caption" value={form.caption} onChange={(caption) => patch({ caption })} placeholder="e.g. Loose leaf range, white cyc" error={fieldErrors.caption} />
            <TextInput
              label="Shot type"
              value={form.label}
              onChange={(label) => patch({ label })}
              placeholder="e.g. Product still"
              hint="Shown in the caption line, e.g. “PRODUCT STILL — 3:4”."
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
              <Select
                label="Client"
                value={form.clientId ?? ""}
                onChange={(v) => patch({ clientId: v || null })}
                options={[{ value: "", label: "Unassigned" }, ...clients.map((c) => ({ value: c.id, label: c.name }))]}
              />
              <Select
                label="Type"
                value={form.kind}
                onChange={(kind) => patch({ kind })}
                options={[
                  { value: "photo", label: "Photo" },
                  { value: "video_frame", label: "Video frame" },
                ]}
              />
              <Select label="Ratio" value={form.ratio} onChange={(ratio) => patch({ ratio })} options={assetRatios} />
            </div>
            <Segmented
              label="Status"
              value={form.status}
              onChange={(status) => patch({ status })}
              off={{ value: "unpublished", label: "Unpublished" }}
              on={{ value: "published", label: "Published" }}
            />
            <DrawerFooter
              saveLabel="Save asset"
              pending={pending}
              error={error}
              onSave={() => run(() => saveAsset(form))}
              onCancel={close}
              onDelete={form.id ? () => run(() => deleteAsset(form.id!)) : undefined}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
