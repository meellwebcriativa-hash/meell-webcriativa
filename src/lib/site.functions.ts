import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseSiteContent, type SiteContent } from "@/lib/site-content";

export type PublicSite = {
  id: string;
  name: string;
  segment: string;
  template: string;
  slug: string;
  updatedAt: string;
  content: SiteContent;
  /** Signed URLs for the gallery storage paths. */
  urls: Record<string, string>;
};

const SIGNED_URL_TTL = 60 * 60 * 24 * 7;

/**
 * Loads a published site for anonymous visitors.
 * Runs server-side with the service role so the `uploads` bucket can stay private.
 */
export const getPublicSite = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string().trim().min(1).max(120) }).parse(input))
  .handler(async ({ data }): Promise<PublicSite | null> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data: project, error } = await supabaseAdmin
        .from("projects")
        .select("id, name, segment, template, slug, content, updated_at")
        .eq("slug", data.slug)
        .eq("status", "publicado")
        .maybeSingle();

      if (error) {
        console.error("getPublicSite", error);
        return null;
      }
      if (!project?.slug) return null;

      const content = parseSiteContent(project.content);
      const urls: Record<string, string> = {};

      if (content.gallery.length > 0) {
        const { data: signed, error: signError } = await supabaseAdmin.storage
          .from("uploads")
          .createSignedUrls(content.gallery, SIGNED_URL_TTL);
        if (signError) console.error("getPublicSite:signedUrls", signError);
        for (const item of signed ?? []) {
          if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
        }
      }

      return {
        id: project.id,
        name: project.name,
        segment: project.segment,
        template: project.template,
        slug: project.slug,
        updatedAt: project.updated_at,
        content,
        urls,
      };
    } catch (error) {
      console.error("getPublicSite:failed", error);
      return null;
    }
  });
