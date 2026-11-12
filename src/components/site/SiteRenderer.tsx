import type { CSSProperties, ReactNode } from "react";
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

export type SiteRendererProps = {
  name: string;
  segment: string;
  template: string;
  content: SiteContent;
  /** Signed URLs for the gallery paths. */
  urls?: Record<string, string>;
  /** Shows gentle placeholders instead of empty gaps. */
  preview?: boolean;
};

/**
 * Renders a client site. Used by the public page and by the live preview
 * inside the editor, so both always look exactly the same.
 */
export function SiteRenderer({
  name,
  segment,
  template,
  content,
  urls = {},
  preview = false,
}: SiteRendererProps) {
  const theme = themeFor(template);
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
  ].filter((item) => item.show || preview);

  const muted: CSSProperties = { color: theme.muted };

  return (
    <div
      style={{ background: theme.bg, color: theme.ink, fontFamily: theme.body }}
      className="flex min-h-full flex-col"
    >
      <header
        style={{ borderColor: theme.border, background: theme.bg }}
        className="sticky top-0 z-10 border-b"
      >
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
                style={{ background: theme.accent, color: theme.accentInk }}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            ) : null}
          </nav>
        </div>
      </header>

      <section style={{ background: theme.heroBg }} className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p
            style={{ color: theme.accent }}
            className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase"
          >
            {segmentText}
          </p>
          <h1
            style={{ fontFamily: theme.display, lineHeight: 1.03 }}
            className="mt-4 text-4xl font-semibold sm:text-6xl"
          >
            {businessName}
          </h1>
          <p style={muted} className="mt-5 max-w-xl text-lg">
            {tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={{ background: theme.accent, color: theme.accentInk }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                <MessageCircle className="size-4" /> Falar no WhatsApp
              </a>
            ) : (
              <span
                style={{ background: theme.accent, color: theme.accentInk }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium opacity-70"
              >
                <MessageCircle className="size-4" /> Falar no WhatsApp
              </span>
            )}
            {instagramHref ? (
              <a
                href={instagramHref}
                target="_blank"
                rel="noreferrer"
                style={{ borderColor: theme.border, color: theme.ink }}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium"
              >
                <Instagram className="size-4" /> Instagram
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {(about || preview) && (
        <section id="sobre" className="px-5 py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-[0.6fr_1fr]">
            <h2
              style={{ fontFamily: theme.display }}
              className="text-3xl font-semibold sm:text-4xl"
            >
              Sobre
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              {about ? (
                about.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index} style={muted}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p style={muted}>
                  Conte aqui a história do seu negócio, o que você faz e o que torna o seu
                  atendimento especial.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {(services.length > 0 || preview) && (
        <section
          id="servicos"
          style={{ background: theme.surface }}
          className="px-5 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-5xl">
            <h2
              style={{ fontFamily: theme.display }}
              className="text-3xl font-semibold sm:text-4xl"
            >
              Serviços
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <article
                    key={`${service.title}-${index}`}
                    style={{
                      borderColor: theme.border,
                      background: theme.bg,
                      borderRadius: theme.heroRadius,
                    }}
                    className="flex flex-col border p-6"
                  >
                    <h3 className="text-lg font-semibold">{service.title || "Serviço"}</h3>
                    {service.description ? (
                      <p style={muted} className="mt-2 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    ) : null}
                    {service.price ? (
                      <p style={{ color: theme.accent }} className="mt-4 text-sm font-semibold">
                        {service.price}
                      </p>
                    ) : null}
                  </article>
                ))
              ) : (
                <article
                  style={{ borderColor: theme.border, borderRadius: theme.heroRadius }}
                  className="border border-dashed p-6 sm:col-span-2 lg:col-span-3"
                >
                  <p style={muted} className="text-sm">
                    Adicione os serviços ou produtos que você oferece — com descrição e preço, se
                    quiser.
                  </p>
                </article>
              )}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section id="galeria" className="px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2
              style={{ fontFamily: theme.display }}
              className="text-3xl font-semibold sm:text-4xl"
            >
              Galeria
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((url, index) => (
                <img
                  key={url}
                  src={url}
                  alt={`${businessName} — foto ${index + 1}`}
                  loading="lazy"
                  style={{ borderColor: theme.border, borderRadius: theme.heroRadius }}
                  className="aspect-square w-full border object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contato" style={{ background: theme.surface }} className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl">
            Vamos conversar?
          </h2>
          <p style={muted} className="mt-3 max-w-lg">
            Fale com a gente pelos canais abaixo — respondemos com todo carinho.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {contact.map((item) => {
              const Icon = item.icon;
              const body = (
                <>
                  <Icon className="size-4 shrink-0" style={{ color: theme.accent }} />
                  <span className="break-words">{item.label || "Seu contato aqui"}</span>
                </>
              );
              const style: CSSProperties = {
                borderColor: theme.border,
                color: theme.ink,
                borderRadius: theme.heroRadius,
              };
              return item.href ? (
                <a
                  key={item.key}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  style={style}
                  className="flex items-center gap-3 border p-4 text-sm"
                >
                  {body}
                </a>
              ) : (
                <div
                  key={item.key}
                  style={style}
                  className="flex items-center gap-3 border p-4 text-sm"
                >
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer style={{ borderColor: theme.border }} className="mt-auto border-t px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-xs sm:flex-row">
          <span style={muted}>
            © {new Date().getFullYear()} {businessName}
          </span>
          <a href="/" style={muted} className="underline-offset-4 hover:underline">
            Site criado com Web Criativa
          </a>
        </div>
      </footer>
    </div>
  );
}

export function SitePreviewCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-card">
      <div className="flex items-center gap-1.5 border-b bg-soft px-4 py-2">
        <span className="size-2.5 rounded-full bg-pink/70" />
        <span className="size-2.5 rounded-full bg-lilac/60" />
        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-2 text-[0.7rem] tracking-wide text-muted-foreground uppercase">
          Prévia ao vivo
        </span>
      </div>
      <div className="max-h-[70vh] overflow-y-auto">{children}</div>
    </div>
  );
}
