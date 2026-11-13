import { type SiteDesign, SITE_DESIGNS } from "@/lib/site-designs";
import { type SiteTheme, type SiteService } from "@/lib/site-content";

type ServicesSectionProps = {
  design: SiteDesign;
  services: SiteService[];
  serviceImages?: string[];
  theme: SiteTheme;
  darkMode: boolean;
  muted: { color: string };
  accentStyle: { color: string };
  borderColor: string;
};

type ServicesLayout = SiteDesign["services"];

function getServiceImageUrl(service: SiteService, images: string[] | undefined) {
  if (!images || images.length === 0) return null;
  const index = images.findIndex(img => img === service.image);
  if (index >= 0 && index < images.length) {
    return images[index];
  }
  return service.image || null;
}

export function ServicesLayoutRenderer({ layout, services, serviceImages, theme, darkMode, muted, accentStyle, borderColor }: ServicesSectionProps) {
  switch (layout) {
    case "pricelist":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            Tabela de preços
          </h2>
          <div className="mt-8 max-w-2xl">
            {services.map((service, index) => (
              <div key={index} className="mb-4 flex items-start justify-between rounded-2xl border bg-card p-4" style={{ borderColor }}>
                <div>
                  <h3 className="font-semibold text-base">{service.title || "Serviço"}</h3>
                  {service.description && <p style={muted} className="mt-1 text-sm">{service.description}</p>}
                </div>
                {service.price && (
                  <span style={{ color: darkMode ? "#ff8080" : theme.accent }} className="font-semibold text-sm">
                    {service.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case "pills":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            Nossos serviços
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center"
                style={{ borderColor, minWidth: "120px" }}
              >
                <h3 className="font-semibold text-sm">{service.title || "Serviço"}</h3>
                {service.price && (
                  <span style={{ color: darkMode ? "#ff8080" : theme.accent }} className="text-xs font-medium">
                    {service.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case "products":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            Produtos em destaque
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article key={index} className="overflow-hidden rounded-3xl border bg-card shadow-card" style={{ borderColor }}>
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title || "Produto"}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-48 w-full items-center justify-center bg-soft text-muted-foreground"
                    style={{ borderColor }}
                  >
                    <span className="text-xs">{service.title || "Produto"}</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-base">{service.title || "Produto"}</h3>
                  {service.description && <p style={muted} className="mt-1 text-sm">{service.description}</p>}
                  {service.price && <p style={accentStyle} className="mt-2 text-sm font-semibold">{service.price}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      );

    case "menu":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            {services[0]?.title || "Cardápio"}
          </h2>
          <div className="mt-8 max-w-2xl">
            {services.map((service, index) => (
              <div key={index} className="mb-4 border-b pb-4" style={{ borderColor }}>
                <h3 className="font-semibold text-base">{service.title || "Item"}</h3>
                {service.description && <p style={muted} className="mt-1 text-sm">{service.description}</p>}
                {service.price && (
                  <p style={accentStyle} className="mt-2 text-sm font-semibold">
                    {service.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case "cards":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            O que oferecemos
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article key={index} className="rounded-2xl border bg-card p-4" style={{ borderColor }}>
                <h3 className="font-semibold text-base">{service.title || "Serviço"}</h3>
                {service.description && <p style={muted} className="mt-2 text-sm">{service.description}</p>}
                {service.price && (
                  <p style={accentStyle} className="mt-2 text-sm font-semibold">
                    {service.price}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      );

    case "notes":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            Detalhes importantes
          </h2>
          <div className="mt-12 max-w-2xl">
            {services.map((service, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-semibold text-base">{service.title || "Item"}</h3>
                {service.description && <p style={muted} className="mt-2 text-sm">{service.description}</p>}
              </div>
            ))}
          </div>
        </section>
      );

    case "steps":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            Como trabalhamos
          </h2>
          <div className="mt-12">
            {services.map((service, index) => (
              <div key={index} className="mb-6 flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: accentStyle.color, color: "#fff" }}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-base">{service.title || "Passo"}</h3>
                  {service.description && <p style={muted} className="mt-1 text-sm">{service.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case "board":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            Tabela de preços
          </h2>
          <div className="mt-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor }}>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: darkMode ? "#a0a0a0" : muted.color }}>
                    Serviço
                  </th>
                  <th className="px-4 py-3 text-right font-medium" style={{ color: darkMode ? "#a0a0a0" : muted.color }}>
                    Preço
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-b" style={{ borderColor }}>
                    <td className="px-4 py-3">{service.title || "Serviço"}</td>
                    <td className="px-4 py-3 text-right" style={{ color: darkMode ? "#ff8080" : accentStyle.color }}>
                      {service.price || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );

    case "packages":
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl text-center">
            Pacotes disponíveis
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article key={index} className="rounded-3xl border bg-card p-6" style={{ borderColor }}>
                <h3 className="font-semibold text-xl">{service.title || "Pacote"}</h3>
                {service.description && <p style={muted} className="mt-2 text-sm">{service.description}</p>}
                {service.price && (
                  <p style={accentStyle} className="mt-4 text-lg font-semibold">
                    {service.price}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      );

    default:
      return (
        <section className="px-5 py-14 sm:py-20">
          <h2 style={{ fontFamily: theme.display }} className="text-3xl font-semibold sm:text-4xl">
            Serviços
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article key={index} className="rounded-2xl border bg-card p-4" style={{ borderColor }}>
                <h3 className="font-semibold text-base">{service.title || "Serviço"}</h3>
                {service.description && <p style={muted} className="mt-1 text-sm">{service.description}</p>}
                {service.price && (
                  <p style={accentStyle} className="mt-2 text-sm font-semibold">
                    {service.price}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      );
  }
}