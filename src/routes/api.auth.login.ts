import { createFileRoute } from "@tanstack/react-router";
import { checkPassword, makeSessionCookie } from "@/lib/auth.server";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let password = "";
        try {
          const body = (await request.json()) as { password?: string };
          password = body.password ?? "";
        } catch {
          /* ignore malformed body */
        }
        if (!checkPassword(password)) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "set-cookie": makeSessionCookie(),
          },
        });
      },
    },
  },
});
