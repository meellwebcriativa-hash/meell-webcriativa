import { useMemo } from "react";
import { Clock, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { segmentLabel } from "@/lib/constants";
import {
  instagramHandle,
  instagramLink,
  parseSiteContent,
  themeFor,
  whatsappLink,
  type SiteContent,
} from "@/lib/site-content";
import { designForSegment, type SiteDesign } from "@/lib/site-designs";
import { HeroLayoutRenderer } from "@/components/site/HeroLayoutRenderer";
import { ServicesLayoutRenderer } from "@/components/site/ServicesLayoutRenderer";

export type SiteRendererProps = {
  name: string;
  segment: string;
  template: string;
  content: SiteContent;
  /** Signed URLs for the gallery paths. */
  urls?: Record<string, string>;
  /** Shows gentle placeholders instead of empty gaps. */
  preview?: boolean;
  /** Toggle dark mode preview */
  darkMode?: boolean;
};

export function SiteRenderer({
  name,
  segment,
  template,
  content,
  urls = {},
  preview = false,
  darkMode = false,
}: SiteRendererProps) {
  const theme = themeFor(template);
  const design: SiteDesign = designForSegment(segment);
  const segmentText = segmentLabel(segment, content.segmentOther);
  const safe = parseSiteContent(content);
  const businessName = name.trim() || (preview ? "Nome do seu negócio" : "Meu negócio");

  const tagline =
    safe.tagline.trim() ||
    (preview
      ? "Uma frase curta que resume o que você faz e para quem."
      : `${segmentText} com atendimento personalizado e carinho em cada detalhe.`);

  const about = safe.about.trim();
  const whatsappHref = whatsappLink(safe.whatsapp);
  const instagramHref = instagramLink(safe.instagram);
  const emailHref = safe.email.trim() ? `mailto:${safe.email.trim()}` : "";
  const services = safe.services;
  const gallery = safe.gallery.map((path) => urls[path]).filter((url): url is string => !!url);

  const nav = [
    { id: "sobre", label: "Sobre", show: !!about || preview },
    { id: "servicos", label: "Serviços", show: services.length > 0 || preview },
    { id: "galeria", label: "Galeria", show: gallery.length > 0 },
    { id: "contato", label: "Contato", show: true },
  ].filter((item) => item.show);

  const contact = [
    {
      key: "whatsapp",
      icon: MessageCircle,
      label: safe.whatsapp,
      href: whatsappHref,
      show: !!safe.whatsapp.trim(),
    },
    {
      key: "instagram",
      icon: Instagram,
      label: instagramHandle(safe.instagram),
      href: instagramHref,
      show: !!instagramHref,
    },
    { key: "email", icon: Mail, label: safe.email, href: emailHref, show: !!emailHref },
    { key: "address", icon: MapPin, label: safe.address, href: "", show: !!safe.address.trim() },
    { key: "hours", icon: Clock, label: safe.hours, href: "", show: !!safe.hours.trim() },
  ].filter((item) => item.show);

  const muted = { color: darkMode ? "#a0a0a0" : theme.muted };
  const accentStyle = { color: darkMode ? "#ff8080" : theme.accent };

  const headerBg = darkMode ? "#1e1e1e" : theme.bg;
  const heroBg = darkMode ? `linear-gradient(135deg, #2d2d2d 0%, #1e1e1e 100%)` : theme.heroBg;
  const surfaceBg = darkMode ? "#2d2d2d" : theme.surface;
  const serviceCardBg = darkMode ? "#252525" : theme.bg;
  const footerBg = darkMode ? "#1e1e1e" : theme.bg;
  const textColor = darkMode ? "#e0e0e0" : theme.ink;
  const borderColor = darkMode ? "#404040" : theme.border;

  return (
    <div
      style={{
        background: darkMode ? "#121212" : theme.bg,
        color: textColor,
        fontFamily: theme.body,
      }}
      className="flex min-h-full flex-col dark:bg-slate-900 dark:text-slate-100"
    >
      <header style={{ borderColor, background: headerBg }} className="sticky top-0 z-10 border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <span style={{ fontFamily: theme.display }} className="truncate text-lg font-semibold">
            {businessName}
          </span>
          <nav className="flex items-center gap-4 text-sm">
            {nav
              .filter((item) => item.id !== "contato")
              .map((item) => (
                <a key={item.id} href={`#${item.id}`} style={muted} className="hidden sm:inline">
                  {item.label}
                </a>
              ))}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: darkMode ? "#e04040" : theme.accent,
                  color: "#ffffff",
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            ) : null}
          </nav>
        </div>
      </header>

      <HeroLayoutRenderer
        layout={design.hero}
        name={businessName}
        segmentText={segmentText}
        tagline={tagline}
        theme={theme}
        muted={muted}
        accentStyle={accentStyle}
        darkMode={darkMode}
        whatsappHref={whatsappHref}
        instagramHref={instagramHref}
      />

      {about && (
        <section id="sobre" className="px-5 py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-[0.6fr_1fr]">
            <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl">
              Sobre
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              {about.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index} style={muted}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <ServicesLayoutRenderer
          layout={design.services}
          services={services}
          theme={theme}
          darkMode={darkMode}
          muted={muted}
          accentStyle={accentStyle}
          borderColor={borderColor}
        />
      )}

      {gallery.length > 0 && (
        <section id="galeria" className="px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl">
              Galeria
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((url, index) => (
                <img
                  key={url}
                  src={url}
                  alt={`${businessName} — foto ${index + 1}`}
                  loading="lazy"
                  style={{ borderColor }}
                  className="aspect-square w-full border object-cover transition-shadow duration-200 hover:shadow-lg"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contato" style={{ background: surfaceBg }} className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl">
            Vamos conversar?
          </h2>
          <p style={muted} className="mt-3 max-w-lg">
            Fale com a gente pelos canais abaixo — respondemos com todo carinho.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {contact.length === 0 && preview && (
              <p
                style={{ borderColor, color: darkMode ? "#a0a0a0" : theme.muted }}
                className="rounded-2xl border border-dashed p-4 text-sm sm:col-span-2"
              >
                Adicione WhatsApp, Instagram, e-mail e endereço no editor — os botões de contato aparecem
                aqui.
              </p>
            )}
            {contact.map((item) => {
              const Icon = item.icon;
              const body = (
                <>
                  <Icon className="size-4 shrink-0" style={{ color: darkMode ? "#f0a0a0" : theme.accent }} />
                  <span className="break-words">{item.label || "Seu contato aqui"}</span>
                </>
              );
              const itemStyle = {
                borderColor,
                color: textColor,
                borderRadius: theme.heroRadius,
              };
              return item.href ? (
                <a
                  key={item.key}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  style={itemStyle}
                  className="flex items-center gap-3 border p-4 text-sm"
                >
                  {body}
                </a>
              ) : (
                <div key={item.key} style={itemStyle} className="flex items-center gap-3 border p-4 text-sm">
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer style={{ borderColor }} className="mt-auto border-t px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-xs sm:flex-row">
          <div className="flex items-center gap-4">
            <span style={muted}>
              © {new Date().getFullYear()} {businessName}
            </span>
            <span style={muted} className="hidden sm:inline-flex items-center gap-1">
              <span className="opacity-50">•</span>
              <span>Criado com Web Criativa</span>
            </span>
          </div>
          <a href="/" style={muted} className="underline-offset-4 hover:underline">
            Feito com IA
          </a>
        </div>
      </footer>
    </div>
  );
}

export function SitePreviewCard({ children, darkMode }: { children: React.ReactNode; darkMode?: boolean }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-border/50 bg-card shadow-card dark:bg-slate-800">
      <div className="flex items-center gap-1.5 border-b bg-soft px-4 py-2 dark:bg-slate-700">
        <span className="size-2.5 rounded-full bg-pink/70 animate-pulse" style={{ animationDelay: "0ms" }} />
        <span className="size-2.5 rounded-full bg-lilac/60 animate-pulse" style={{ animationDelay: "200ms" }} />
        <span className="size-2.5 rounded-full bg-muted-foreground/30 animate-pulse" style={{ animationDelay: "400ms" }} />
        <span className="ml-2 text-[0.7rem] tracking-wide text-muted-foreground uppercase dark:text-slate-300">
          Prévia ao vivo
        </span>
      </div>
      <div className="max-h-[70vh] overflow-y-auto">{children}</div>
    </div>
  );
}