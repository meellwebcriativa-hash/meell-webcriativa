import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Me = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  businessName: string;
  isAdmin: boolean;
};

export const meQuery = queryOptions({
  queryKey: ["me"],
  staleTime: 60_000,
  queryFn: async (): Promise<Me | null> => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    const user = data.user;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("full_name, phone, business_name, email").eq("id", user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", user.id),
    ]);
    return {
      id: user.id,
      email: user.email ?? profile?.email ?? "",
      fullName: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      businessName: profile?.business_name ?? "",
      isAdmin: (roles ?? []).some((r) => r.role === "admin"),
    };
  },
});

export const myProjectsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["projects", "mine", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, segment, template, status, content, created_at, updated_at")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const myRequestsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["requests", "mine", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_requests")
        .select("id, business_name, segment, status, created_at")
        .eq("client_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const adminClientsQuery = queryOptions({
  queryKey: ["admin", "clients"],
  queryFn: async () => {
    const [{ data: profiles, error }, { data: roles, error: rolesError }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, phone, business_name, blocked, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (error) throw error;
    if (rolesError) throw rolesError;
    const admins = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
    return (profiles ?? []).filter((p) => !admins.has(p.id));
  },
});

export const adminRequestsQuery = queryOptions({
  queryKey: ["admin", "requests"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_requests")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const adminProjectsQuery = queryOptions({
  queryKey: ["admin", "projects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, segment, template, status, owner_id, request_id, content, created_at, updated_at, profiles(full_name, email)")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});
