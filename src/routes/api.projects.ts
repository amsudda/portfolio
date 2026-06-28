import { createFileRoute } from "@tanstack/react-router";
import type { Project } from "@/data/projects";
import { isAuthed } from "@/lib/auth.server";
import { listProjects, upsertProject } from "@/lib/store.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

export const Route = createFileRoute("/api/projects")({
  server: {
    handlers: {
      // Public — used by the site (SSR) and the admin list.
      GET: async () => json(await listProjects()),

      // Admin only — create or update a project.
      POST: async ({ request }) => {
        if (!isAuthed(request)) return json({ error: "Unauthorized" }, 401);
        let project: Project;
        try {
          project = (await request.json()) as Project;
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        if (!project?.id || !project?.slug || !project?.title) {
          return json({ error: "id, slug and title are required" }, 400);
        }
        await upsertProject(project);
        return json({ ok: true });
      },
    },
  },
});
