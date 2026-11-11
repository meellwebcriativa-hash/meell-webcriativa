import { createFileRoute } from "@tanstack/react-router";

// Temporary one-off: creates the fixed admin account with a random, never-returned password.
// The admin then sets her own password through "Esqueci minha senha". Remove after use.
export const Route = createFileRoute("/api/public/setup-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const email = "meell.webcriativa@gmail.com";
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
        if (list?.users.some((u) => u.email?.toLowerCase() === email)) {
          return Response.json({ ok: true, existed: true });
        }
        const password = `${crypto.randomUUID()}${crypto.randomUUID()}`;
        const { error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: "Meell" },
        });
        return Response.json({ ok: !error, error: error?.message ?? null });
      },
    },
  },
});
