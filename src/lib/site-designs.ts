import type { SegmentValue } from "@/lib/constants";
import salaoImg from "@/assets/templates/salao.jpg";
import manicureImg from "@/assets/templates/manicure.jpg";
import lojaImg from "@/assets/templates/loja.jpg";
import papelariaImg from "@/assets/templates/papelaria.jpg";
import confeitariaImg from "@/assets/templates/confeitaria.jpg";
import restauranteImg from "@/assets/templates/restaurante.jpg";
import barbeariaImg from "@/assets/templates/barbearia.jpg";
import fotografiaImg from "@/assets/templates/fotografia.jpg";
import servicosImg from "@/assets/templates/servicos.jpg";
import outroImg from "@/assets/templates/outro.jpg";

/**
 * Design pronto de cada nicho: montagem do topo, jeito de mostrar os serviços,
 * letras, foto de exemplo e nomes das seções. As cores vêm do estilo escolhido.
 */
export type HeroLayout = "arch" | "split" | "banner" | "polaroid" | "circle" | "bold" | "editorial";
export type ServicesLayout = "pricelist" | "pills" | "products" | "notes" | "menu" | "board" | "packages" | "steps" | "cards";

export type SiteDesign = {
  hero: HeroLayout;
  services: ServicesLayout;
  /** Fonte dos títulos. */
  display: string;
  /** Títulos em caixa alta (ex.: barbearia). */
  uppercase?: boolean;
  /** Fonte manuscrita para pequenos detalhes. */
  script?: string;
  /** Nome de exemplo usado nas miniaturas. */
  sampleName: string;
  image: string;
  imageAlt: string;
  highlights: [string, string, string];
  labels: {
    about: string;
    services: string;
    servicesIntro: string;
    contactTitle: string;
    contactText: string;
    cta: string;
  };
};

const SERIF = "'Fraunces', Georgia, serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";
const PLAYFAIR = "'Playfair Display', Georgia, serif";
const DM_SERIF = "'DM Serif Display', Georgia, serif";
const BEBAS = "'Bebas Neue', Impact, sans-serif";
const GROTESK = "'Space Grotesk', system-ui, sans-serif";
const DANCING = "'Dancing Script', cursive";
const CAVEAT = "'Caveat', cursive";

/** Fontes extras usadas pelos modelos (carregadas só nas páginas que mostram sites). */
export const SITE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@500;700&family=Cormorant+Garamond:wght@500;600;700&family=DM+Serif+Display&family=Dancing+Script:wght@600;700&family=Playfair+Display:wght@500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap";

export const siteFontLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  { rel: "stylesheet", href: SITE_FONTS_HREF },
];

export const SITE_DESIGNS: Record<SegmentValue, SiteDesign> = {
  salao: {
    hero: "arch",
    services: "pricelist",
    display: CORMORANT,
    sampleName: "Studio Bella",
    image: salaoImg,
    imageAlt: "Ambiente do salão com cadeira e espelho iluminado",
    highlights: ["Produtos profissionais", "Avaliação do fio", "Horário marcado"],
    labels: {
      about: "Nosso jeito de cuidar",
      services: "Tabela de serviços",
      servicesIntro: "Valores de referência — o orçamento final é feito na avaliação.",
      contactTitle: "Agende o seu horário",
      contactText: "Escolha o melhor dia e fale com a gente pelo WhatsApp.",
      cta: "Agendar horário",
    },
  },
  manicure: {
    hero: "split",
    services: "pills",
    display: PLAYFAIR,
    script: DANCING,
    sampleName: "Esmalteria Rosé",
    image: manicureImg,
    imageAlt: "Mãos com unhas em gel rosa sobre tecido lilás",
    highlights: ["Material esterilizado", "Esmaltes importados", "Atendimento sem pressa"],
    labels: {
      about: "Cuidado em cada detalhe",
      services: "Serviços & valores",
      servicesIntro: "Escolha o seu cuidado e reserve pelo WhatsApp.",
      contactTitle: "Reserve o seu momento",
      contactText: "Os horários são limitados — garanta o seu.",
      cta: "Reservar horário",
    },
  },
  loja: {
    hero: "banner",
    services: "products",
    display: DM_SERIF,
    sampleName: "Casa Aurora",
    image: lojaImg,
    imageAlt: "Vitrine da loja com roupas dobradas e acessórios",
    highlights: ["Entrega na região", "Troca facilitada", "Pagamento no Pix"],
    labels: {
      about: "Sobre a loja",
      services: "Destaques da vitrine",
      servicesIntro: "Gostou? Chame no WhatsApp e separamos para você.",
      contactTitle: "Compre pelo WhatsApp",
      contactText: "Tire dúvidas de tamanho, cor e entrega com a gente.",
      cta: "Comprar no WhatsApp",
    },
  },
  papelaria: {
    hero: "polaroid",
    services: "notes",
    display: SERIF,
    script: CAVEAT,
    sampleName: "Ateliê Papel & Afeto",
    image: papelariaImg,
    imageAlt: "Convites, planners e fitas sobre mesa rosa",
    highlights: ["Arte aprovada antes", "Papel de qualidade", "Embalagem com carinho"],
    labels: {
      about: "Feito à mão, com afeto",
      services: "O que criamos",
      servicesIntro: "Tudo personalizado com o seu tema, as suas cores e o seu nome.",
      contactTitle: "Vamos criar juntas?",
      contactText: "Conte a data e o tema que preparamos um orçamento.",
      cta: "Pedir orçamento",
    },
  },
  confeitaria: {
    hero: "circle",
    services: "menu",
    display: DANCING,
    sampleName: "Doce Encanto",
    image: confeitariaImg,
    imageAlt: "Bolo rosa decorado com flores e brigadeiros",
    highlights: ["Receitas artesanais", "Encomendas sob medida", "Feito no dia"],
    labels: {
      about: "Nossa cozinha",
      services: "Cardápio de doces",
      servicesIntro: "Encomendas com antecedência — sabores e decoração à sua escolha.",
      contactTitle: "Faça sua encomenda",
      contactText: "Conte a data e o número de convidados pelo WhatsApp.",
      cta: "Encomendar",
    },
  },
  restaurante: {
    hero: "banner",
    services: "menu",
    display: PLAYFAIR,
    sampleName: "Cantina da Vila",
    image: restauranteImg,
    imageAlt: "Prato de massa servido à luz de velas",
    highlights: ["Ingredientes frescos", "Delivery na região", "Reservas pelo WhatsApp"],
    labels: {
      about: "A casa",
      services: "Cardápio",
      servicesIntro: "Pratos preparados na hora. Pergunte pelo prato do dia.",
      contactTitle: "Reserve sua mesa",
      contactText: "Reservas e pedidos de delivery pelo WhatsApp.",
      cta: "Reservar mesa",
    },
  },
  barbearia: {
    hero: "bold",
    services: "board",
    display: BEBAS,
    uppercase: true,
    sampleName: "Navalha Club",
    image: barbeariaImg,
    imageAlt: "Cadeira de barbeiro de couro e navalha sobre o balcão",
    highlights: ["Toalha quente", "Navalha descartável", "Hora marcada"],
    labels: {
      about: "A barbearia",
      services: "Tabela de preços",
      servicesIntro: "Corte, barba e acabamento no capricho.",
      contactTitle: "Marque seu horário",
      contactText: "Chegue no horário e saia alinhado.",
      cta: "Marcar horário",
    },
  },
  fotografia: {
    hero: "editorial",
    services: "packages",
    display: CORMORANT,
    sampleName: "Luz & Memória",
    image: fotografiaImg,
    imageAlt: "Mulher de vestido branco caminhando em campo ao pôr do sol",
    highlights: ["Galeria online", "Direção leve", "Fotos em alta resolução"],
    labels: {
      about: "Sobre o meu olhar",
      services: "Pacotes",
      servicesIntro: "Cada ensaio é pensado com você, do roteiro à entrega.",
      contactTitle: "Vamos marcar o seu ensaio?",
      contactText: "Me conte a sua ideia e a data que você imagina.",
      cta: "Quero um ensaio",
    },
  },
  servicos: {
    hero: "split",
    services: "steps",
    display: GROTESK,
    sampleName: "Prática Soluções",
    image: servicosImg,
    imageAlt: "Mesa de trabalho com notebook, caderno e café",
    highlights: ["Orçamento sem compromisso", "Prazos claros", "Suporte no WhatsApp"],
    labels: {
      about: "Como trabalhamos",
      services: "Como podemos ajudar",
      servicesIntro: "Do primeiro contato à entrega, tudo combinado com clareza.",
      contactTitle: "Peça seu orçamento",
      contactText: "Responda em poucos minutos e receba uma proposta.",
      cta: "Pedir orçamento",
    },
  },
  outro: {
    hero: "split",
    services: "cards",
    display: SERIF,
    sampleName: "Seu Negócio",
    image: outroImg,
    imageAlt: "Ateliê com produtos artesanais e flores",
    highlights: ["Atendimento personalizado", "Feito com carinho", "Fale pelo WhatsApp"],
    labels: {
      about: "Sobre",
      services: "O que oferecemos",
      servicesIntro: "Conheça o que preparamos para você.",
      contactTitle: "Vamos conversar?",
      contactText: "Fale com a gente pelos canais abaixo — respondemos com todo carinho.",
      cta: "Falar no WhatsApp",
    },
  },
};

export function designForSegment(segment: string): SiteDesign {
  return SITE_DESIGNS[segment as SegmentValue] ?? SITE_DESIGNS.outro;
}
