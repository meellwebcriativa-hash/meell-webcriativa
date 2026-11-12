import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/site-content";
import type { ProjectStatus } from "@/lib/constants";

const UNIQUE_VIOLATION = "23505";

/**
 * Publishes a project, reserving a unique public address (`/s/<slug>`).
 * Retries with a numeric suffix when the name is already taken.
 */
export async function publishProject(projectId: string, name: string): Promise<string> {
  const base = slugify(name) || "meu-site";
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const { error } = await supabase
      .from("projects")
      .update({ status: "publicado" as ProjectStatus, slug })
      .eq("id", projectId);
    if (!error) return slug;
    if (error.code !== UNIQUE_VIOLATION) throw new Error(error.message);
  }
  throw new Error("Não foi possível reservar um endereço para este site.");
}

export async function setProjectStatus(projectId: string, status: ProjectStatus) {
  const { error } = await supabase.from("projects").update({ status }).eq("id", projectId);
  if (error) throw new Error(error.message);
}

export function publicSitePath(slug: string) {
  return `/s/${slug}`;
}
