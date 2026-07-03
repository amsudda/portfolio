/**
 * Client-side helpers the admin panel uses to talk to the /api routes.
 * (Browser fetch with relative URLs; the session cookie rides along.)
 */
import type { Project } from "@/data/projects";

export async function apiList(): Promise<Project[]> {
  const r = await fetch("/api/projects");
  if (!r.ok) throw new Error("Failed to load projects");
  return r.json();
}

export async function apiSave(project: Project): Promise<void> {
  const r = await fetch("/api/projects", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(project),
  });
  if (r.status === 401) throw new Error("UNAUTHORIZED");
  if (!r.ok) throw new Error("Save failed");
}

export async function apiDelete(id: string): Promise<void> {
  const r = await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (r.status === 401) throw new Error("UNAUTHORIZED");
  if (!r.ok) throw new Error("Delete failed");
}

export async function apiLogin(username: string, password: string): Promise<boolean> {
  const r = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return r.ok;
}

export async function apiLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function apiMe(): Promise<boolean> {
  try {
    const r = await fetch("/api/auth/me");
    if (!r.ok) return false;
    const d = (await r.json()) as { authed?: boolean };
    return !!d.authed;
  } catch {
    return false;
  }
}
