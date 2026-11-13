import { type SiteDesign, SITE_DESIGNS } from "@/lib/site-designs";
import { type SiteTheme, themeFor } from "@/lib/site-content";

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
};

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

export function HeroLayoutRenderer({ layout, ...props }: { layout: HeroLayout } & HeroSectionProps) {
  const designs = SITE_DESIGNS;
  
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
            <p style={props.muted} className="mt-6 max-w-2xl text-lg">
              {props.tagline}
            </p>
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
            <div 
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border"
              style={{ borderColor: props.theme.border }}
            >
              <img
                src={designs[Object.keys(designs).find(k => designs[k].hero === "split") as keyof typeof designs]?.image || designs.outro.image}
                alt={`${props.name} - imagem de exemplo`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      );

    case "banner":
      return (
        <section style={{ background: props.theme.heroBg }} className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase" style={{ color: props.darkMode ? "#ff8080" : props.theme.accent }}>
              {props.segmentText}
            </p>
            <h1 style={{ fontFamily: props.theme.display }} className="mt-4 text-4xl font-semibold sm:text-5xl">
              {props.name}
            </h1>
            <p style={props.muted} className="mt-5 max-w-2xl text-lg">
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
            <p style={props.muted} className="mt-6 max-w-2xl text-center text-lg">
              {props.tagline}
            </p>
            <div className="mt-12 grid grid-cols-3 gap-4 sm:grid-cols-4 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="relative overflow-hidden rounded-2xl border bg-card shadow-card"
                  style={{ borderColor: props.theme.border }}
                >
                  <img
                    src={designs.outro.image}
                    alt={`Foto ${n}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              ))}
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
            <p style={props.muted} className="mt-6 max-w-2xl text-lg">
              {props.tagline}
            </p>
          </div>
        </section>
      );

    case "bold":
      return (
        <section style={{ background: props.darkMode ? "#1a1a1a" : "#fafafa" }} className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h1 style={{ fontFamily: props.theme.display }} className="text-6xl font-bold sm:text-8xl" style={{ color: props.darkMode ? "#e0e0e0" : "#333" }}>
              {props.name.split("")[0]}
            </h1>
            <div className="mt-4">
              <h2 style={{ fontFamily: props.theme.display }} className="text-2xl font-semibold sm:text-3xl">
                {props.name}
              </h2>
              <p style={props.muted} className="mt-2 max-w-lg text-lg">
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
                Fotografia
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border" style={{ borderColor: props.theme.border }}>
              <img
                src={designs.fotografia.image}
                alt={`${props.name} - ensaio fotográfico`}
                className="h-full w-full object-cover"
              />
            </div>
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