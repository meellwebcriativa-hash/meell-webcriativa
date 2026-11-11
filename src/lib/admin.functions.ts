import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { clientAccountSchema, passwordSchema } from "@/lib/schemas";
import { friendlyAuthError } from "@/lib/auth-errors";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Acesso restrito à administradora.");
}

export const createClientAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => clientAccountSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (error || !created.user) {
      console.error("createClientAccount", error);
      return { ok: false as const, error: friendlyAuthError(error?.message) };
    }
    await supabaseAdmin
      .from("profiles")
      .update({ phone: data.phone || null, business_name: data.businessName || null, full_name: data.fullName })
      .eq("id", created.user.id);
    return { ok: true as const, id: created.user.id };
  });

const targetSchema = z.object({ userId: z.string().uuid() });

async function assertTargetIsClient(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if ((data ?? []).some((r) => r.role === "admin")) throw new Error("Não é possível alterar a conta da administradora.");
  return supabaseAdmin;
}

export const setClientBlocked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => targetSchema.extend({ blocked: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const supabaseAdmin = await assertTargetIsClient(data.userId);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      ban_duration: data.blocked ? "876000h" : "none",
    });
    if (error) {
      console.error("setClientBlocked", error);
      return { ok: false as const, error: "Não foi possível alterar o acesso agora." };
    }
    await supabaseAdmin.from("profiles").update({ blocked: data.blocked }).eq("id", data.userId);
    return { ok: true as const };
  });

export const setClientPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => targetSchema.extend({ password: passwordSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const supabaseAdmin = await assertTargetIsClient(data.userId);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { password: data.password });
    if (error) {
      console.error("setClientPassword", error);
      return { ok: false as const, error: friendlyAuthError(error.message) };
    }
    return { ok: true as const };
  });
