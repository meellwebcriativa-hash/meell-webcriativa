import { SEGMENTS } from "@/lib/constants";

/** A service or product listed on the site. */
export type SiteService = {
  title: string;
  description: string;
  price: string;
  image?: string;
};

/**
 * Everything the client can personalize about her own site.
 * Stored as JSON in `projects.content`.
 */
export type SiteContent = {
  segmentOther: string;
  tagline: string;
  about: string;
  whatsapp: string;
  instagram: string;
  email: string;
  address: string;
  hours: string;
  services: SiteService[];
  /** Storage paths inside the `uploads` bucket. */
  gallery: string[];
};

export const emptySiteContent: SiteContent = {
  segmentOther: "",
  tagline: "",
  about: "",
  whatsapp: "",
  instagram: "",
  email: "",
  address: "",
  hours: "",
  services: [],
  gallery: [],
};

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

/** Reads any JSON blob from the database into a complete SiteContent. */
export function parseSiteContent(raw: unknown): SiteContent {
  if (!raw || typeof raw !== "object") return { ...emptySiteContent };
  const source = raw as Record<string, unknown>;

  const servicesRaw = source["services"];
  const services = Array.isArray(servicesRaw)
    ? servicesRaw
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => ({
          title: text(item["title"]).trim(),
          description: text(item["description"]).trim(),
          price: text(item["price"]).trim(),
          image: text(item["image"]).trim() || undefined,
        }))
        .filter((item) => item.title || item.description)
    : [];

  const galleryRaw = source["gallery"];
  const gallery = Array.isArray(galleryRaw)
    ? galleryRaw.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];

  return {
    segmentOther: text(source["segmentOther"]),
    tagline: text(source["tagline"]),
    about: text(source["about"]),
    whatsapp: text(source["whatsapp"]),
    instagram: text(source["instagram"]),
    email: text(source["email"]),
    address: text(source["address"]),
    hours: text(source["hours"]),
    services,
    gallery,
  };
}

/** Requests store the free-text segment as `outro:descrição`. */
export function parseRequestSegment(raw: string): { segment: string; other: string } {
  const value = (raw ?? "").trim();
  if (value.startsWith("outro:")) return { segment: "outro", other: value.slice(6).trim() };
  if (SEGMENTS.some((item) => item.value === value)) return { segment: value, other: "" };
  if (!value) return { segment: "outro", other: "" };
  return { segment: "outro", other: value };
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

export function digitsOnly(value: string): string {
  return (value ?? "").replace(/\D/g, "");
}

/** Builds a wa.me link, adding the Brazilian country code when missing. */
export function whatsappLink(phone: string): string {
  const digits = digitsOnly(phone);
  if (!digits) return "";
  if (digits.length <= 11) return `https://wa.me/55${digits}`;
  return `https://wa.me/${digits}`;
}

export function instagramLink(handle: string): string {
  const clean = (handle ?? "")
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/+$/, "");
  if (!clean) return "";
  return `https://instagram.com/${clean}`;
}

export function instagramHandle(handle: string): string {
  const clean = (handle ?? "")
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/+$/, "");
  return clean ? `@${clean}` : "";
}

export type SiteTheme = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accentInk: string;
  border: string;
  heroBg: string;
  display: string;
  body: string;
  heroRadius: string;
};

const DISPLAY = "'Fraunces', Georgia, serif";
const BODY = "'Outfit', system-ui, sans-serif";

const ELEGANTE_THEME: SiteTheme = {
  bg: "#fbf8f5",
  surface: "#ffffff",
  ink: "#332029",
  muted: "#7d6570",
  accent: "#8a5a75",
  accentInk: "#ffffff",
  border: "#eadddd",
  heroBg: "linear-gradient(180deg, #f6ecef 0%, #fbf8f5 100%)",
  display: DISPLAY,
  body: BODY,
  heroRadius: "2.5rem",
};

export const SITE_THEMES: Record<string, SiteTheme> = {
  elegante: ELEGANTE_THEME,
  moderno: {
    bg: "#0f0c15",
    surface: "#1a1523",
    ink: "#f7f3fb",
    muted: "#b9aecb",
    accent: "#c9a3e8",
    accentInk: "#241a2f",
    border: "#2c2438",
    heroBg: "linear-gradient(150deg, #1c1230 0%, #0f0c15 70%)",
    display: DISPLAY,
    body: BODY,
    heroRadius: "2rem",
  },
  delicado: {
    bg: "#fff9fc",
    surface: "#ffffff",
    ink: "#533741",
    muted: "#96707c",
    accent: "#e58ab5",
    accentInk: "#ffffff",
    border: "#f6e0ea",
    heroBg: "linear-gradient(180deg, #ffeef6 0%, #fff9fc 100%)",
    display: DISPLAY,
    body: BODY,
    heroRadius: "2.5rem",
  },
  minimalista: {
    bg: "#ffffff",
    surface: "#fafafa",
    ink: "#151515",
    muted: "#6f6f6f",
    accent: "#151515",
    accentInk: "#ffffff",
    border: "#e6e6e6",
    heroBg: "#ffffff",
    display: BODY,
    body: BODY,
    heroRadius: "1rem",
  },
};

export function themeFor(template: string): SiteTheme {
  return SITE_THEMES[template] ?? ELEGANTE_THEME;
}
