import { createFileRoute } from "@tanstack/react-router";
import { isAuthed } from "@/lib/auth.server";
import { deleteProject } from "@/lib/store.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

export const Route = createFileRoute("/api/projects/$id")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        if (!isAuthed(request)) return json({ error: "Unauthorized" }, 401);
        await deleteProject(params.id);
        return json({ ok: true });
      },
    },
  },
});
