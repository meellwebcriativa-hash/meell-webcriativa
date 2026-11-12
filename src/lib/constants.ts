export const SEGMENTS = [
  { value: "salao", label: "Salão de beleza", emoji: "💇‍♀️" },
  { value: "manicure", label: "Manicure", emoji: "💅" },
  { value: "loja", label: "Loja", emoji: "🛍️" },
  { value: "papelaria", label: "Papelaria", emoji: "✏️" },
  { value: "confeitaria", label: "Confeitaria", emoji: "🧁" },
  { value: "restaurante", label: "Restaurante", emoji: "🍽️" },
  { value: "barbearia", label: "Barbearia", emoji: "💈" },
  { value: "fotografia", label: "Fotografia", emoji: "📷" },
  { value: "servicos", label: "Serviços", emoji: "🧰" },
  { value: "outro", label: "Meu negócio é outro", emoji: "✨" },
] as const;

export type SegmentValue = (typeof SEGMENTS)[number]["value"];

export const SITE_STYLES = [
  { value: "elegante", label: "Elegante", description: "Sofisticado, com tipografia refinada e detalhes nobres." },
  { value: "moderno", label: "Moderno", description: "Formas marcantes, cores vivas e visual atual." },
  { value: "delicado", label: "Delicado", description: "Tons suaves, curvas e um ar leve e acolhedor." },
  { value: "minimalista", label: "Minimalista", description: "Muito respiro, poucas cores e foco no essencial." },
] as const;

export type SiteStyleValue = (typeof SITE_STYLES)[number]["value"];

export const SITE_PAGES = [
  "Início",
  "Sobre nós",
  "Serviços",
  "Produtos e preços",
  "Galeria",
  "Depoimentos",
  "Contato",
  "WhatsApp",
  "Instagram",
  "Endereço",
] as const;

export const REQUEST_STATUS = {
  nova: { label: "Nova", variant: "pink" },
  em_andamento: { label: "Em andamento", variant: "lilac" },
  concluida: { label: "Concluída", variant: "success" },
  cancelada: { label: "Cancelada", variant: "muted" },
} as const;

export const PROJECT_STATUS = {
  rascunho: { label: "Rascunho", variant: "muted", hint: "Você ainda está montando." },
  em_producao: { label: "Em produção", variant: "lilac", hint: "A administradora está criando seu site." },
  liberado: { label: "Liberado para você", variant: "pink", hint: "Pronto para você ver e continuar editando." },
  publicado: { label: "Publicado", variant: "success", hint: "No ar para todo mundo ver." },
} as const;

export type RequestStatus = keyof typeof REQUEST_STATUS;
export type ProjectStatus = keyof typeof PROJECT_STATUS;

export function segmentLabel(value: string, other?: string | null) {
  if (value === "outro") return other?.trim() || "Outro";
  return SEGMENTS.find((s) => s.value === value)?.label ?? value;
}

export function styleLabel(value: string) {
  return SITE_STYLES.find((s) => s.value === value)?.label ?? value;
}
