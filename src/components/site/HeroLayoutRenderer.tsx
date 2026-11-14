import { ImagePlus } from "lucide-react";
import { type SiteDesign } from "@/lib/site-designs";
import { type SiteTheme } from "@/lib/site-content";

type HeroSectionProps = {
  design: SiteDesign;
  name: string;
  segmentText: string;
  tagline: string;
  muted: { color: string };
  accentStyle: { color: string };
  darkMode: boolean;
  theme: SiteTheme;
  whatsappHref: string;
  instagramHref: string | null;
  heroImage?: string | undefined;
  /** When set (editor), clicking the main photo opens the photo picker. */
  onEditImage?: (() => void) | undefined;
};

/** Main photo of the site; in the editor it becomes a "Trocar foto" button. */
function HeroImage({
  src,
  alt,
  className = "",
  onEdit,
}: {
  src: string;
  alt: string;
  className?: string;
  onEdit?: (() => void) | undefined;
}) {
  const img = <img src={src} alt={alt} className="h-full w-full object-cover" />;
  if (!onEdit) return <div className={`relative overflow-hidden ${className}`}>{img}</div>;
  return (
    <button
      type="button"
      onClick={onEdit}
      aria-label="Trocar a foto principal do site"
      className={`group/hero relative block overflow-hidden ${className}`}
    >
      {img}
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/hero:bg-black/35">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-neutral-800 shadow-lg">
          <ImagePlus className="size-4" /> Trocar foto principal
        </span>
      </span>
    </button>
  );
}

export function HeroArch({ name, tagline, segmentText, theme, muted, darkMode }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute -top-40 -right-40 size-80 rounded-full bg-pink/20 shadow-candy" />
      <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-lilac/20 shadow-candy" />
      <div className="mx-auto max-w-5xl px-5 py-24 text-center">
        <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
          {segmentText}
        </p>
        <h1
          style={{ fontFamily: theme.display }}
          className="mt-4 text-5xl font-semibold sm:text-7xl tracking-tight"
        >
          {name}
        </h1>
        <p style={muted} className="mt-6 max-w-2xl text-lg">
          {tagline}
        </p>
      </div>
    </section>
  );
}

type HeroLayout = SiteDesign["hero"];

export function HeroLayoutRenderer({ layout, design, ...props }: { layout: HeroLayout } & HeroSectionProps) {
  const src = props.heroImage || design.image;
  const alt = props.heroImage ? `${props.name} — foto principal` : design.imageAlt;
  const edit = props.onEditImage;
  
  switch (layout) {
    case "arch":
      return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink/10 via-white to-lilac/10">
          <div className="absolute -top-60 -right-60 size-96 rounded-full bg-pink/30 shadow-candy" />
          <div className="absolute -bottom-60 -left-60 size-96 rounded-full bg-lilac/30 shadow-candy" />
          <div className="mx-auto max-w-5xl px-5 py-24 text-center">
            <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
              {props.segmentText}
            </p>
            <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-5xl font-semibold sm:text-7xl">
              {props.name}
            </h1>
            <p style={props.muted} className="mx-auto mt-6 max-w-2xl text-lg">
              {props.tagline}
            </p>
            <HeroImage src={src} alt={alt} onEdit={edit} className="mx-auto mt-10 aspect-[4/3] w-full max-w-xl rounded-t-[12rem] rounded-b-3xl" />
          </div>
        </section>
      );

    case "split":
      return (
        <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <div className="grid items-center gap-8 sm:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
                {props.segmentText}
              </p>
              <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-4xl font-semibold sm:text-5xl">
                {props.name}
              </h1>
              <p style={props.muted} className="mt-5 max-w-lg text-lg">
                {props.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {props.whatsappHref ? (
                  <a
                    href={props.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: props.darkMode ? "#e04040" : props.theme.accent }}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
                  >
                    Falar no WhatsApp
                  </a>
                ) : null}
                {props.instagramHref ? (
                  <a
                    href={props.instagramHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ borderColor: props.theme.border, color: props.theme.ink }}
                    className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium"
                  >
                    Instagram
                  </a>
                ) : null}
              </div>
            </div>
            <HeroImage src={src} alt={alt} onEdit={edit} className="aspect-[4/3] w-full rounded-3xl" />
          </div>
        </section>
      );

    case "banner":
      return (
        <section style={{ background: props.theme.heroBg }} className="px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <HeroImage src={src} alt={alt} onEdit={edit} className="mb-10 aspect-[21/9] w-full rounded-3xl" />
            <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase" style={{ color: props.darkMode ? "#ff8080" : props.theme.accent }}>
              {props.segmentText}
            </p>
            <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-4xl font-semibold sm:text-5xl">
              {props.name}
            </h1>
            <p style={props.muted} className="mx-auto mt-5 max-w-2xl text-lg">
              {props.tagline}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {props.whatsappHref ? (
                <a
                  href={props.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: props.darkMode ? "#e04040" : props.theme.accent }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
                >
                  Falar no WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </section>
      );

    case "polaroid":
      return (
        <section style={{ background: props.theme.bg }} className="px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
              {props.segmentText}
            </p>
            <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-center text-4xl font-semibold sm:text-5xl">
              {props.name}
            </h1>
            <p style={props.muted} className="mx-auto mt-6 max-w-2xl text-center text-lg">
              {props.tagline}
            </p>
            <div className="mx-auto mt-12 max-w-2xl -rotate-2 rounded-2xl bg-white p-3 pb-10 shadow-card">
              <HeroImage src={src} alt={alt} onEdit={edit} className="aspect-[4/3] w-full rounded-xl" />
            </div>
          </div>
        </section>
      );

    case "circle":
      return (
        <section className="relative w-full overflow-hidden">
          <div className="absolute -inset-px bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink/30 via-lilac/20 to-transparent opacity-60" />
          <div className="mx-auto max-w-5xl px-5 py-24 text-center">
            <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
              {props.segmentText}
            </p>
            <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-4xl font-semibold sm:text-5xl">
              {props.name}
            </h1>
            <p style={props.muted} className="mx-auto mt-6 max-w-2xl text-lg">
              {props.tagline}
            </p>
            <HeroImage src={src} alt={alt} onEdit={edit} className="mx-auto mt-10 aspect-[16/10] w-full max-w-2xl rounded-[2.5rem]" />
          </div>
        </section>
      );

    case "bold":
      return (
        <section style={{ background: props.darkMode ? "#1a1a1a" : "#fafafa" }} className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <HeroImage src={src} alt={alt} onEdit={edit} className="mb-10 aspect-[21/9] w-full rounded-2xl" />
            <h1 style={{ fontFamily: props.theme.display, color: props.darkMode ? "#e0e0e0" : "#333" }} className="text-6xl font-bold uppercase sm:text-8xl">
              {props.name}
            </h1>
            <div className="mt-4">
              <h2 style={{ fontFamily: props.theme.display }} className="text-2xl font-semibold uppercase tracking-widest sm:text-3xl">
                {props.segmentText}
              </h2>
              <p style={props.muted} className="mx-auto mt-2 max-w-lg text-lg">
                {props.tagline}
              </p>
            </div>
            <div className="mt-8">
              {props.whatsappHref ? (
                <a
                  href={props.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium"
                  style={{ background: props.darkMode ? "#e04040" : props.theme.accent }}
                >
                  Falar no WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </section>
      );

    case "editorial":
      return (
        <section className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
          <div className="grid items-center gap-12 sm:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
                {props.segmentText}
              </p>
              <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-4xl font-semibold sm:text-5xl">
                {props.name}
              </h1>
              <p style={props.muted} className="mt-5 text-lg">
                {props.tagline}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {props.whatsappHref ? (
                  <a
                    href={props.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: props.theme.accent }}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                  >
                    Falar no WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
            <HeroImage src={src} alt={alt} onEdit={edit} className="aspect-[4/5] w-full rounded-3xl" />
          </div>
        </section>
      );

    default:
      return (
        <section style={{ background: props.theme.heroBg }} className="px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <p style={{ color: props.darkMode ? "#ff8080" : props.theme.accent }} className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase">
              {props.segmentText}
            </p>
            <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-4xl font-semibold sm:text-5xl">
              {props.name}
            </h1>
            <p style={props.muted} className="mt-5 max-w-2xl text-lg">
              {props.tagline}
            </p>
          </div>
        </section>
      );
  }
}