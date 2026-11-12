import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteRenderer } from "@/components/site/SiteRenderer";
import { getPublicSite } from "@/lib/site.functions";
import { segmentLabel } from "@/lib/constants";

export const Route = createFileRoute("/s/$slug")({
  loader: async ({ params }) => {
    const site = await getPublicSite({ data: { slug: params.slug } });
    if (!site) throw notFound();
    return site;
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
        { name: "twitter:card", content: "summary_large_image" },
      ],
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
