import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { parseSiteContent } from "@/lib/site-content";
import { SHARE_IMAGE_HEIGHT, SHARE_IMAGE_WIDTH, shareImageSource } from "@/lib/share-image";

const slugSchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/);
const CACHE = "public, max-age=3600, s-maxage=86400";

/**
 * Link preview image of a published client site: always its main photo.
 * Only returns a photo that is already visible on the public site.
 */
export const Route = createFileRoute("/api/public/share-image/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const slug = slugSchema.safeParse(params.slug);
        if (!slug.success) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: project, error } = await supabaseAdmin
          .from("projects")
          .select("segment, content")
          .eq("slug", slug.data)
          .eq("status", "publicado")
          .maybeSingle();
        if (error) console.error("share-image", error);
        if (!project) return new Response("Not found", { status: 404 });

        const source = shareImageSource(parseSiteContent(project.content).heroImage, project.segment);
        const fallback = () => {
          const path = shareImageSource(undefined, project.segment);
          const target = path.kind === "default" ? path.path : "/og/segments/outro.jpg";
          return new Response(null, {
            status: 302,
            headers: { Location: new URL(target, request.url).toString(), "Cache-Control": CACHE },
          });
        };

        if (source.kind === "url") {
          return new Response(null, { status: 302, headers: { Location: source.url, "Cache-Control": CACHE } });
        }
        if (source.kind === "default") return fallback();

        const bucket = supabaseAdmin.storage.from("uploads");
        let file: Blob | null = null;
        const resized = await bucket.download(source.path, {
          transform: { width: SHARE_IMAGE_WIDTH, height: SHARE_IMAGE_HEIGHT, resize: "cover", quality: 80 },
        });
        if (resized.data && resized.data.size > 0) {
          file = resized.data;
        } else {
          const original = await bucket.download(source.path);
          if (original.error) console.error("share-image:download", original.error);
          file = original.data;
        }
        if (!file) return fallback();

        return new Response(file, {
          headers: {
            "Content-Type": file.type && file.type.startsWith("image/") ? file.type : "image/jpeg",
            "Cache-Control": CACHE,
          },
        });
      },
    },
  },
});
