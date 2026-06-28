import { type Project, type ProjectCategory } from "@/data/projects";

/**
 * Client-safe helpers for the admin editor. Data persistence now lives behind
 * the /api routes (see admin-api.ts) backed by Postgres in production; this file
 * only holds pure utilities used while editing a draft.
 */

export const CATEGORIES: ProjectCategory[] = [
  "Short-Form Social",
  "Paid Ad Campaign",
  "Product Launch",
  "Brand Content",
  "Long-Form",
];

export function newId() {
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function emptyProject(): Project {
  return {
    id: newId(),
    slug: "",
    title: "",
    client: "",
    year: new Date().getFullYear(),
    category: "Short-Form Social",
    role: "",
    deliverables: [],
    hook: "",
    brief: "",
    approach: "",
    process: [],
    result: "",
    heroVideoUrl: "",
    thumbnail: { from: "#1f3320", to: "#3f7a32" },
  };
}

/** Reads an image File as a data URL (stored inline in the project record). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Produces a ready-to-paste TS snippet for src/data/projects.ts. */
export function exportProjectTs(project: Project): string {
  return (
    JSON.stringify(project, null, 2).replace(
      /"([a-zA-Z_][a-zA-Z0-9_]*)":/g,
      "$1:",
    ) + ","
  );
}
