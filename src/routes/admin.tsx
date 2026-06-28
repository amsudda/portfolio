import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  LogOut,
  Pencil,
  X,
  ImagePlus,
} from "lucide-react";
import type { MediaBlock, Project } from "@/data/projects";
import { VideoEmbed, youtubeThumbnail } from "@/components/video-embed";
import {
  CATEGORIES,
  emptyProject,
  exportProjectTs,
  fileToDataUrl,
  slugify,
} from "@/lib/project-store";
import { apiDelete, apiList, apiLogin, apiLogout, apiMe, apiSave } from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Projects" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    apiMe().then((ok) => {
      setAuthed(ok);
      setReady(true);
    });
  }, []);

  if (!ready) return null;
  if (!authed) return <Login onAuth={() => setAuthed(true)} />;
  return (
    <Dashboard
      onLogout={async () => {
        await apiLogout();
        setAuthed(false);
      }}
    />
  );
}

/* ----------------------------- Login ----------------------------- */

function Login({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const ok = await apiLogin(pw);
          setBusy(false);
          if (ok) onAuth();
          else setError(true);
        }}
        className="w-full max-w-sm"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">Project manager</h1>
        <input
          type="password"
          value={pw}
          autoFocus
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="mt-8 w-full border-b border-border bg-transparent py-3 text-base outline-none focus:border-primary"
        />
        {error && (
          <p className="mt-3 text-xs text-destructive">Incorrect password.</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Set the password via the <code className="rounded bg-surface px-1">ADMIN_PASSWORD</code>{" "}
          environment variable on the server.
        </p>
      </form>
    </div>
  );
}

/* --------------------------- Dashboard --------------------------- */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = () =>
    apiList()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  if (editing) {
    return (
      <Editor
        initial={editing}
        onCancel={() => setEditing(null)}
        onSaved={async () => {
          await reload();
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-16 md:px-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
            Projects
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Log out
        </button>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => setEditing(emptyProject())}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <ul className="mt-10 divide-y divide-border border-y border-border">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center gap-4 py-4">
            <div
              className="h-12 w-16 shrink-0 rounded"
              style={
                p.thumbnail.image
                  ? {
                      backgroundImage: `url(${p.thumbnail.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {
                      backgroundImage: `linear-gradient(135deg, ${p.thumbnail.from}, ${p.thumbnail.to})`,
                    }
              }
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg tracking-tight">
                {p.title || "Untitled"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {p.client} · {p.category} · {p.year}
              </p>
            </div>
            <CopyButton text={() => exportProjectTs(p)} label="Copy code" />
            <button
              onClick={() => setEditing(p)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
            <button
              onClick={async () => {
                if (!confirm(`Delete "${p.title}"?`)) return;
                try {
                  await apiDelete(p.id);
                  await reload();
                } catch {
                  alert("Delete failed — are you still logged in?");
                }
              }}
              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {!loading && projects.length === 0 && (
          <li className="py-12 text-center text-sm text-muted-foreground">
            No projects yet. Create your first one.
          </li>
        )}
        {loading && (
          <li className="py-12 text-center text-sm text-muted-foreground">Loading…</li>
        )}
      </ul>
    </div>
  );
}

/* ----------------------------- Editor ----------------------------- */

function Editor({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Project;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Project>(initial);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = async () => {
    if (!draft.title.trim()) return alert("Title is required.");
    if (!draft.client.trim()) return alert("Client is required.");
    setSaving(true);
    try {
      await apiSave({ ...draft, slug: draft.slug.trim() || slugify(draft.title) });
      onSaved();
    } catch (err) {
      setSaving(false);
      alert(
        err instanceof Error && err.message === "UNAUTHORIZED"
          ? "Your session expired — please log in again."
          : "Save failed. Check your connection and try again.",
      );
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-12 md:px-10">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
        <div className="flex items-center gap-3">
          <CopyButton text={() => exportProjectTs(draft)} label="Copy code" />
          <button
            onClick={submit}
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save project"}
          </button>
        </div>
      </div>

      <h1 className="mt-8 font-display text-3xl tracking-tight md:text-4xl">
        {initial.title ? `Edit — ${initial.title}` : "New project"}
      </h1>

      {/* Basics */}
      <Group title="Basics">
        <Field label="Title">
          <Input value={draft.title} onChange={(v) => set("title", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Client">
            <Input value={draft.client} onChange={(v) => set("client", v)} />
          </Field>
          <Field label="Year">
            <Input
              type="number"
              value={String(draft.year)}
              onChange={(v) => set("year", Number(v) || draft.year)}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) => set("category", e.target.value as Project["category"])}
              className="w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-background">
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="What we handled (role)">
            <Input
              value={draft.role}
              onChange={(v) => set("role", v)}
              placeholder="Strategy · Production · Edit"
            />
          </Field>
        </div>
        <Field label="Slug (URL)" hint="Auto-filled from the title if left blank.">
          <Input
            value={draft.slug}
            onChange={(v) => set("slug", v)}
            placeholder={slugify(draft.title) || "project-url"}
          />
        </Field>
        <Field label="Hook" hint="One line shown on cards and hover.">
          <Input value={draft.hook} onChange={(v) => set("hook", v)} />
        </Field>
      </Group>

      {/* Deliverables */}
      <Group title="Deliverables">
        <ListEditor
          items={draft.deliverables}
          onChange={(items) => set("deliverables", items)}
          placeholder="e.g. 12× Reels / TikToks"
        />
      </Group>

      {/* Case study */}
      <Group title="Case study">
        <Field label="The brief — what the client needed">
          <Textarea value={draft.brief} onChange={(v) => set("brief", v)} />
        </Field>
        <Field label="Our approach — creative direction">
          <Textarea value={draft.approach} onChange={(v) => set("approach", v)} />
        </Field>
        <Field label="Result — what it earned">
          <Textarea value={draft.result} onChange={(v) => set("result", v)} />
        </Field>
      </Group>

      {/* Metric */}
      <Group title="Headline metric (optional)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Value">
            <Input
              value={draft.metric?.value ?? ""}
              onChange={(v) =>
                set("metric", v || draft.metric?.label ? { value: v, label: draft.metric?.label ?? "" } : undefined)
              }
              placeholder="3.4M"
            />
          </Field>
          <Field label="Label">
            <Input
              value={draft.metric?.label ?? ""}
              onChange={(v) =>
                set("metric", v || draft.metric?.value ? { value: draft.metric?.value ?? "", label: v } : undefined)
              }
              placeholder="organic views in month one"
            />
          </Field>
        </div>
      </Group>

      {/* Testimonial */}
      <Group title="Testimonial (optional)">
        <Field label="Quote">
          <Textarea
            value={draft.testimonial?.quote ?? ""}
            onChange={(v) =>
              set("testimonial", v ? { ...(draft.testimonial ?? { author: "" }), quote: v } : undefined)
            }
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Author">
            <Input
              value={draft.testimonial?.author ?? ""}
              onChange={(v) =>
                set("testimonial", { ...(draft.testimonial ?? { quote: "" }), author: v })
              }
            />
          </Field>
          <Field label="Author role">
            <Input
              value={draft.testimonial?.role ?? ""}
              onChange={(v) =>
                set("testimonial", { ...(draft.testimonial ?? { quote: "", author: "" }), role: v })
              }
            />
          </Field>
        </div>
      </Group>

      {/* Media */}
      <Group title="Hero & thumbnail">
        <Field label="Hero video link" hint="YouTube or Vimeo URL.">
          <Input
            value={draft.heroVideoUrl}
            onChange={(v) => set("heroVideoUrl", v)}
            placeholder="https://youtu.be/..."
          />
          <VideoLinkPreview url={draft.heroVideoUrl} aspect="16/9" />
        </Field>
        <ThumbnailEditor
          thumbnail={draft.thumbnail}
          onChange={(t) => set("thumbnail", t)}
        />
      </Group>

      {/* Process */}
      <Group title="Process blocks">
        <ProcessEditor blocks={draft.process} onChange={(b) => set("process", b)} />
      </Group>

      <div className="mt-12 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-full border border-border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save project"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------- sub-editors ------------------------- */

function ThumbnailEditor({
  thumbnail,
  onChange,
}: {
  thumbnail: Project["thumbnail"];
  onChange: (t: Project["thumbnail"]) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Thumbnail
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <div
          className="h-24 w-40 shrink-0 rounded-lg border border-border"
          style={
            thumbnail.image
              ? {
                  backgroundImage: `url(${thumbnail.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  backgroundImage: `linear-gradient(135deg, ${thumbnail.from}, ${thumbnail.to})`,
                }
          }
        />
        <div className="space-y-3">
          <ImageUpload
            onPick={(dataUrl) => onChange({ ...thumbnail, image: dataUrl })}
            label={thumbnail.image ? "Replace image" : "Upload image"}
          />
          {thumbnail.image && (
            <button
              onClick={() => onChange({ ...thumbnail, image: undefined })}
              className="block text-xs text-muted-foreground hover:text-destructive"
            >
              Remove image (use gradient)
            </button>
          )}
          {!thumbnail.image && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <label className="flex items-center gap-2">
                From
                <input
                  type="color"
                  value={thumbnail.from}
                  onChange={(e) => onChange({ ...thumbnail, from: e.target.value })}
                  className="h-7 w-10 rounded border border-border bg-transparent"
                />
              </label>
              <label className="flex items-center gap-2">
                To
                <input
                  type="color"
                  value={thumbnail.to}
                  onChange={(e) => onChange({ ...thumbnail, to: e.target.value })}
                  className="h-7 w-10 rounded border border-border bg-transparent"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProcessEditor({
  blocks,
  onChange,
}: {
  blocks: MediaBlock[];
  onChange: (b: MediaBlock[]) => void;
}) {
  const update = (i: number, block: MediaBlock) => {
    const next = blocks.slice();
    next[i] = block;
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(blocks.filter((_, k) => k !== i));
  const add = (type: MediaBlock["type"]) => {
    const block: MediaBlock =
      type === "text"
        ? { type: "text", heading: "", body: "" }
        : type === "video"
          ? { type: "video", url: "", aspect: "16/9", caption: "" }
          : type === "image"
            ? { type: "image", src: "", alt: "", caption: "" }
            : { type: "quote", text: "", attribution: "" };
    onChange([...blocks, block]);
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary">
              {block.type}
            </span>
            <div className="flex items-center gap-1">
              <IconBtn onClick={() => move(i, -1)} disabled={i === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn onClick={() => move(i, 1)} disabled={i === blocks.length - 1}>
                <ArrowDown className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn onClick={() => remove(i)} danger>
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
          </div>

          {block.type === "text" && (
            <div className="space-y-3">
              <Input
                value={block.heading ?? ""}
                onChange={(v) => update(i, { ...block, heading: v })}
                placeholder="Heading (optional)"
              />
              <Textarea
                value={block.body}
                onChange={(v) => update(i, { ...block, body: v })}
                placeholder="Body"
              />
            </div>
          )}

          {block.type === "video" && (
            <div className="space-y-3">
              <Input
                value={block.url}
                onChange={(v) => update(i, { ...block, url: v })}
                placeholder="YouTube / Vimeo link"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={block.aspect ?? "16/9"}
                  onChange={(e) =>
                    update(i, { ...block, aspect: e.target.value as "16/9" | "9/16" | "1/1" })
                  }
                  className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="16/9" className="bg-background">16:9 — wide</option>
                  <option value="9/16" className="bg-background">9:16 — vertical</option>
                  <option value="1/1" className="bg-background">1:1 — square</option>
                </select>
                <Input
                  value={block.caption ?? ""}
                  onChange={(v) => update(i, { ...block, caption: v })}
                  placeholder="Caption (optional)"
                />
              </div>
              <VideoLinkPreview url={block.url} aspect={block.aspect ?? "16/9"} />
            </div>
          )}

          {block.type === "image" && (
            <div className="space-y-3">
              {block.src && (
                <img src={block.src} alt="" className="max-h-40 rounded-lg" />
              )}
              <div className="flex flex-wrap items-center gap-3">
                <ImageUpload
                  onPick={(dataUrl) => update(i, { ...block, src: dataUrl })}
                  label={block.src ? "Replace image" : "Upload image"}
                />
                <span className="text-xs text-muted-foreground">or paste a URL below</span>
              </div>
              <Input
                value={block.src}
                onChange={(v) => update(i, { ...block, src: v })}
                placeholder="https://image-url..."
              />
              <Input
                value={block.alt}
                onChange={(v) => update(i, { ...block, alt: v })}
                placeholder="Alt text (for accessibility)"
              />
              <Input
                value={block.caption ?? ""}
                onChange={(v) => update(i, { ...block, caption: v })}
                placeholder="Caption (optional)"
              />
            </div>
          )}

          {block.type === "quote" && (
            <div className="space-y-3">
              <Textarea
                value={block.text}
                onChange={(v) => update(i, { ...block, text: v })}
                placeholder="Quote"
              />
              <Input
                value={block.attribution ?? ""}
                onChange={(v) => update(i, { ...block, attribution: v })}
                placeholder="Attribution (optional)"
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {(["text", "video", "image", "quote"] as const).map((t) => (
          <button
            key={t}
            onClick={() => add(t)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(v) => {
              const next = items.slice();
              next[i] = v;
              onChange(next);
            }}
            placeholder={placeholder}
          />
          <IconBtn onClick={() => onChange(items.filter((_, k) => k !== i))} danger>
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary"
      >
        <Plus className="h-3 w-3" /> Add
      </button>
    </div>
  );
}

function ImageUpload({
  onPick,
  label,
}: {
  onPick: (dataUrl: string) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-xs hover:border-primary hover:text-primary">
      <ImagePlus className="h-3.5 w-3.5" />
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 1.5 * 1024 * 1024) {
            alert(
              "That image is over 1.5MB. Browser storage is limited — use a smaller image, or connect cloud storage for full-size uploads."
            );
            return;
          }
          onPick(await fileToDataUrl(file));
          e.target.value = "";
        }}
      />
    </label>
  );
}

function VideoLinkPreview({
  url,
  aspect = "16/9",
}: {
  url?: string;
  aspect?: "16/9" | "9/16" | "1/1";
}) {
  if (!url || !url.trim()) return null;

  const ytThumb = youtubeThumbnail(url);
  const recognized = ytThumb || /vimeo\.com/.test(url);

  return (
    <div className="mt-4">
      <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Live preview
      </p>
      <div className={aspect === "9/16" ? "max-w-[200px]" : "max-w-sm"}>
        <VideoEmbed
          url={url}
          aspect={aspect}
          poster={
            ytThumb
              ? { from: "#1a1a1a", to: "#2a2a2a", image: ytThumb }
              : { from: "#1a1a1a", to: "#2a2a2a" }
          }
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground/70">
        {ytThumb
          ? "YouTube link recognized — thumbnail shown above. Click to play."
          : recognized
            ? "Vimeo link recognized — click play to load the preview."
            : "Not a recognized YouTube/Vimeo link. It'll still embed, but double-check the URL."}
      </p>
    </div>
  );
}

/* ------------------------- primitives ------------------------- */

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="mb-5 font-display text-xl tracking-tight">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-b border-border bg-transparent py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full resize-y border border-border bg-transparent p-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary rounded-lg"
    />
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors disabled:opacity-30 ${
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function CopyButton({ text, label }: { text: () => string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}
