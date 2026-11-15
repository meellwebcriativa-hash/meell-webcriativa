import { SEGMENTS } from "@/lib/constants";

/** Link preview of the Web Criativa home page (crop of the home hero photo). */
export const LANDING_SHARE_IMAGE = "/og/web-criativa.jpg";
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;

export type ShareImageSource =
  | { kind: "storage"; path: string }
  | { kind: "url"; url: string }
  | { kind: "default"; path: string };

/** Share-sized copy of the segment's template photo (the hero shown when no photo was uploaded). */
export function defaultShareImagePath(segment: string): string {
  const known = SEGMENTS.some((item) => item.value === segment);
  return `/og/segments/${known ? segment : "outro"}.jpg`;
}

/**
 * The link preview of a client site is always its main photo (hero):
 * the uploaded one when there is one, otherwise the segment's template photo.
 */
export function shareImageSource(heroImage: string | undefined, segment: string): ShareImageSource {
  const hero = (heroImage ?? "").trim();
  if (/^https:\/\//i.test(hero)) return { kind: "url", url: hero };
  if (hero && !/^(http:|data:|blob:|\/)/i.test(hero)) return { kind: "storage", path: hero };
  return { kind: "default", path: defaultShareImagePath(segment) };
}

/** Public, non-expiring address crawlers fetch; `v` changes whenever the site is saved. */
export function shareImageUrl(origin: string, slug: string, updatedAt: string): string {
  const version = Date.parse(updatedAt) || 0;
  return `${origin}/api/public/share-image/${encodeURIComponent(slug)}?v=${version}`;
}
