import { createFileRoute } from "@tanstack/react-router";
import { isAuthed } from "@/lib/auth.server";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response(JSON.stringify({ authed: isAuthed(request) }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
