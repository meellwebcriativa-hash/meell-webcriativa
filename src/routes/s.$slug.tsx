import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteRenderer } from "@/components/site/SiteRenderer";
import { getPublicSite } from "@/lib/site.functions";
import { segmentLabel } from "@/lib/constants";
import { getRequestOrigin } from "@/lib/origin.functions";
import { shareImageUrl } from "@/lib/share-image";

export const Route = createFileRoute("/s/$slug")({
  loader: async ({ params }) => {
    const [site, origin] = await Promise.all([getPublicSite({ data: { slug: params.slug } }), getRequestOrigin()]);
    if (!site) throw notFound();
    // A foto principal (hero) do site é sempre a miniatura do link compartilhado.
    return { ...site, shareImage: shareImageUrl(origin, site.slug, site.updatedAt), pageUrl: `${origin}/s/${site.slug}` };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Site não encontrado — Web Criativa" }] };
    }
    const title = `${loaderData.name} — ${segmentLabel(loaderData.segment, loaderData.content.segmentOther)}`;
    const description =
      loaderData.content.tagline.trim() ||
      `${loaderData.name}: ${segmentLabel(loaderData.segment, loaderData.content.segmentOther)}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: loaderData.pageUrl },
        { property: "og:image", content: loaderData.shareImage },
        { property: "og:image:alt", content: `${loaderData.name} — foto principal` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: loaderData.shareImage },
      ],
      links: [{ rel: "canonical", href: loaderData.pageUrl }],
    };
  },
  component: PublicSitePage,
});

function PublicSitePage() {
  const site = Route.useLoaderData();

  return (
    <SiteRenderer
      name={site.name}
      segment={site.segment}
      template={site.template}
      content={site.content}
      urls={site.urls}
    />
  );
}
