import { emptySiteContent, type SiteContent, type SiteService } from "@/lib/site-content";
import type { SegmentValue, SiteStyleValue } from "@/lib/constants";

/**
 * Modelos prontos por nicho.
 *
 * Cada segmento tem um site já montado: frase de destaque, texto "sobre",
 * serviços com preços de exemplo e horário de atendimento. A cliente só troca
 * o que quiser — nada começa em branco.
 */
export type SegmentTemplate = {
  /** Frase curta usada na tela de escolha do segmento. */
  summary: string;
  /** Estilo sugerido para este nicho. */
  style: SiteStyleValue;
  tagline: string;
  about: string;
  services: SiteService[];
  hours: string;
};

export const SEGMENT_TEMPLATES: Record<SegmentValue, SegmentTemplate> = {
  salao: {
    summary: "Cabelo, cor e cuidado, com serviços e preços já prontos.",
    style: "delicado",
    tagline: "Cabelo, cor e cuidado em um só lugar — para você sair daqui se sentindo renovada.",
    about:
      "Cada atendimento começa com uma conversa: entendemos o seu cabelo, a sua rotina e o resultado que você quer alcançar antes de tocar na tesoura.\n\nTrabalhamos com produtos de qualidade, técnicas atuais e um ambiente tranquilo, para que o seu momento no salão seja também um momento de pausa.",
    services: [
      {
        title: "Corte e finalização",
        description:
          "Corte personalizado para o seu tipo de cabelo, com escova ou finalização natural.",
        price: "a partir de R$ 80",
      },
      {
        title: "Coloração e mechas",
        description:
          "Coloração, iluminado e mechas com avaliação prévia e cuidado com a saúde do fio.",
        price: "a partir de R$ 180",
      },
      {
        title: "Tratamentos capilares",
        description:
          "Hidratação, reconstrução e cronograma capilar indicados para a sua necessidade.",
        price: "a partir de R$ 120",
      },
      {
        title: "Escova e penteados",
        description: "Escova modelada e penteados para festas, formaturas e casamentos.",
        price: "a partir de R$ 70",
      },
    ],
    hours: "Ter a sáb, 9h às 19h · atendimento com horário marcado",
  },

  manicure: {
    summary: "Mão, pé e alongamentos, com tabela de serviços pronta.",
    style: "delicado",
    tagline: "Unhas impecáveis, com cuidado de verdade em cada detalhe.",
    about:
      "Do clássico ao alongamento, o atendimento é feito com calma, material esterilizado e todo o cuidado com a saúde das suas unhas.\n\nCada esmalte, formato e acabamento é escolhido com você — o resultado é uma unha bonita que combina com a sua rotina.",
    services: [
      {
        title: "Mão simples",
        description: "Cutilagem, lixamento e esmaltação tradicional ou em gel.",
        price: "R$ 45",
      },
      {
        title: "Pé simples",
        description: "Cuidado completo com cutículas, lixamento e esmaltação.",
        price: "R$ 50",
      },
      {
        title: "Alongamento em gel",
        description: "Alongamento ou manutenção, com formato e cor escolhidos por você.",
        price: "a partir de R$ 160",
      },
      {
        title: "Spa dos pés",
        description: "Esfoliação, hidratação e massagem relaxante para os pés.",
        price: "R$ 80",
      },
    ],
    hours: "Seg a sáb, 9h às 18h · atendimento com horário marcado",
  },

  loja: {
    summary: "Vitrine com produtos, kits e formas de entrega.",
    style: "moderno",
    tagline: "Peças escolhidas a dedo para deixar o seu dia a dia com a sua cara.",
    about:
      "Aqui cada peça é escolhida pensando em quem vai usar: qualidade, conforto e aquele detalhe que faz diferença.\n\nCompre pelo WhatsApp e combine retirada ou entrega — separamos tudo com carinho antes de enviar.",
    services: [
      {
        title: "Novidades da semana",
        description: "Peças recém-chegadas, com poucas unidades de cada modelo.",
        price: "a partir de R$ 59",
      },
      {
        title: "Kits e presentes",
        description: "Combinações prontas para presentear, com embalagem especial.",
        price: "a partir de R$ 89",
      },
      {
        title: "Peças sob encomenda",
        description: "Escolha modelo, tamanho e cor e receba em casa.",
        price: "sob orçamento",
      },
      {
        title: "Entrega e retirada",
        description: "Entrega na sua região e retirada combinada pelo WhatsApp.",
        price: "combinado no pedido",
      },
    ],
    hours: "Seg a sex, 10h às 19h · Sáb, 9h às 13h",
  },

  papelaria: {
    summary: "Convites, planners e lembranças com serviços e preços prontos.",
    style: "delicado",
    tagline: "Convites, planners e lembranças personalizadas para os seus momentos especiais.",
    about:
      "Criamos papelaria afetiva sob medida: convites, planners, cadernos, lembrancinhas e kits que contam a história da sua festa, do seu negócio ou do seu dia a dia.\n\nCada projeto começa com uma conversa para entender o tema, as cores e o prazo. Você aprova o layout antes da impressão — e recebe tudo embalado com cuidado.",
    services: [
      {
        title: "Convites personalizados",
        description: "Convites de casamento, aniversário e chá de bebê com design exclusivo.",
        price: "a partir de R$ 6,90 cada",
      },
      {
        title: "Planners, cadernos e agendas",
        description: "Planners e cadernos com capa personalizada, miolo escolhido por você.",
        price: "a partir de R$ 69",
      },
      {
        title: "Lembranças e kits de festa",
        description: "Caixinhas, tags e lembrancinhas combinando com o tema da comemoração.",
        price: "a partir de R$ 4,50 cada",
      },
      {
        title: "Papelaria para empresas",
        description: "Cartões de visita, etiquetas e papelaria de marca para o seu negócio.",
        price: "a partir de R$ 89",
      },
    ],
    hours: "Seg a sex, 9h às 18h · Sáb, 9h às 13h",
  },

  confeitaria: {
    summary: "Bolos, doces e encomendas com cardápio e preços de exemplo.",
    style: "delicado",
    tagline: "Bolos e doces artesanais feitos com carinho para adoçar o seu dia.",
    about:
      "Tudo é feito na medida do seu evento: receitas artesanais, ingredientes selecionados e recheios escolhidos junto com você.\n\nTrabalhamos com encomendas para aniversários, casamentos e datas especiais. Conte a data e o número de convidados pelo WhatsApp que montamos a proposta.",
    services: [
      {
        title: "Bolos de aniversário",
        description: "Bolos decorados, com recheios à sua escolha e tema personalizado.",
        price: "a partir de R$ 120",
      },
      {
        title: "Doces e brigadeiros",
        description: "Brigadeiros gourmet, docinhos de festa e bem-casados.",
        price: "a partir de R$ 3,50 cada",
      },
      {
        title: "Salgados para festa",
        description: "Salgados fritos e assados, feitos no dia da entrega.",
        price: "a partir de R$ 2,50 cada",
      },
      {
        title: "Mesa de doces completa",
        description: "Montagem de mesa com doces, bolo e detalhes decorativos.",
        price: "sob orçamento",
      },
    ],
    hours: "Seg a sáb, 8h às 18h · encomendas com 5 dias de antecedência",
  },

  restaurante: {
    summary: "Menu, pratos e delivery prontos para receber pedidos.",
    style: "elegante",
    tagline: "Comida fresca, feita na hora, com o tempero de casa.",
    about:
      "Nosso menu muda conforme a estação e o que chega fresquinho na cozinha. Pratos preparados na hora, porções generosas e aquele tempero que lembra comida de família.\n\nAtendemos no salão, por reserva e também em delivery na região. Fale com a gente pelo WhatsApp para reservar sua mesa.",
    services: [
      {
        title: "Almoço executivo",
        description: "Prato do dia, acompanhamentos e sobremesa.",
        price: "R$ 32",
      },
      {
        title: "Pratos à la carte",
        description: "Opções de carnes, massas e pratos vegetarianos.",
        price: "a partir de R$ 45",
      },
      {
        title: "Porções para dividir",
        description: "Petiscos e entradas para compartilhar na mesa.",
        price: "a partir de R$ 38",
      },
      {
        title: "Delivery e reservas",
        description: "Entrega na região e reserva de mesa pelo WhatsApp.",
        price: "combinado no pedido",
      },
    ],
    hours: "Ter a dom, 11h30 às 22h",
  },

  barbearia: {
    summary: "Corte, barba e combos com preços já preenchidos.",
    style: "moderno",
    tagline: "Corte, barba e aquele acabamento que faz a diferença.",
    about:
      "Um espaço pensado para o homem que gosta de sair com o visual alinhado e o atendimento no capricho. Trabalhamos com máquina, tesoura e navalha, respeitando o seu estilo.\n\nAtendemos por ordem de chegada e também com horário marcado pelo WhatsApp.",
    services: [
      {
        title: "Corte masculino",
        description: "Corte na tesoura ou máquina, com acabamento e finalização.",
        price: "R$ 50",
      },
      {
        title: "Barba na navalha",
        description: "Barba desenhada, toalha quente e hidratação.",
        price: "R$ 40",
      },
      {
        title: "Combo corte + barba",
        description: "O pacote completo para sair impecável.",
        price: "R$ 80",
      },
      {
        title: "Pigmentação e acabamento",
        description: "Preenchimento de falhas e desenho de barba.",
        price: "a partir de R$ 35",
      },
    ],
    hours: "Ter a sáb, 9h às 20h",
  },

  fotografia: {
    summary: "Ensaios e eventos com pacotes e valores de referência.",
    style: "minimalista",
    tagline: "Histórias reais registradas com luz, sensibilidade e olhar atento.",
    about:
      "Fotografar é observar com calma: a luz, o jeito de olhar, o detalhe que ninguém viu. Cada ensaio é conduzido sem poses forçadas, para que as fotos tenham a sua cara.\n\nAtendo ensaios, casamentos e marcas, com entrega de galeria online em alta resolução e possibilidade de álbum impresso.",
    services: [
      {
        title: "Ensaio individual",
        description: "1 hora de ensaio, 20 fotos tratadas e galeria online.",
        price: "a partir de R$ 350",
      },
      {
        title: "Ensaio de casal e família",
        description: "Ensaio externo com direção leve e fotos tratadas.",
        price: "a partir de R$ 450",
      },
      {
        title: "Fotos para marcas e produtos",
        description: "Fotos de produto e lifestyle para redes sociais e catálogo.",
        price: "a partir de R$ 400",
      },
      {
        title: "Casamentos e eventos",
        description: "Cobertura completa, com prévia das fotos em até 7 dias.",
        price: "sob orçamento",
      },
    ],
    hours: "Atendimento com horário marcado · ensaios externos aos fins de semana",
  },

  servicos: {
    summary: "Atendimento, orçamento e pacotes prontos para explicar o serviço.",
    style: "moderno",
    tagline: "Soluções práticas para o seu dia a dia, com orçamento sem compromisso.",
    about:
      "Atendimento próximo, prazos combinados com clareza e um serviço feito para resolver o seu problema de verdade.\n\nComeçamos com uma conversa para entender o que você precisa e apresentamos a melhor opção — sem enrolação e sem surpresa no valor final.",
    services: [
      {
        title: "Avaliação inicial",
        description: "Conversamos sobre a sua necessidade e indicamos o melhor caminho.",
        price: "grátis",
      },
      {
        title: "Serviço avulso",
        description: "Atendimento pontual para resolver o que você precisa.",
        price: "a partir de R$ 120",
      },
      {
        title: "Pacote mensal",
        description: "Acompanhamento contínuo, com prioridade no atendimento.",
        price: "a partir de R$ 390",
      },
      {
        title: "Suporte e dúvidas",
        description: "Atendimento por WhatsApp durante todo o período do serviço.",
        price: "incluso",
      },
    ],
    hours: "Seg a sex, 8h às 18h",
  },

  outro: {
    summary: "Um modelo neutro, pronto para receber o seu negócio.",
    style: "elegante",
    tagline: "Um site feito sob medida para mostrar o seu trabalho do jeito que ele merece.",
    about:
      "Conte aqui a história do seu negócio: como tudo começou, o que você faz e o que torna o seu atendimento especial.\n\nUse este espaço para falar também do que você mais gosta no seu trabalho — as pessoas compram de quem elas conhecem.",
    services: [
      {
        title: "Conheça nosso trabalho",
        description: "Apresente aqui o seu principal produto ou serviço.",
        price: "a partir de R$ 99",
      },
      {
        title: "Atendimento personalizado",
        description: "Explique como funciona o atendimento e o que está incluso.",
        price: "sob orçamento",
      },
      {
        title: "Encomendas sob medida",
        description: "Mostre que você adapta o serviço ao que a cliente precisa.",
        price: "combinado no pedido",
      },
    ],
    hours: "Atendimento com horário marcado",
  },
};

/** Sempre devolve um modelo utilizável, mesmo para valores desconhecidos. */
export function templateForSegment(segment: string): SegmentTemplate {
  return SEGMENT_TEMPLATES[segment as SegmentValue] ?? SEGMENT_TEMPLATES.outro;
}

/** Content completo de um site novo, já direcionado para o nicho escolhido. */
export function starterContentFor(segment: string, segmentOther = ""): SiteContent {
  const template = templateForSegment(segment);
  return {
    ...emptySiteContent,
    segmentOther: segment === "outro" ? segmentOther.trim() : "",
    tagline: template.tagline,
    about: template.about,
    hours: template.hours,
    services: template.services.map((service) => ({ ...service })),
  };
}

/** A cliente já mexeu nos textos, serviços ou horários deste projeto? */
export function hasCustomContent(content: SiteContent): boolean {
  return Boolean(
    content.tagline.trim() ||
    content.about.trim() ||
    content.hours.trim() ||
    content.services.some((service) => service.title.trim() || service.description.trim()),
  );
}

/**
 * Troca apenas os textos e serviços pelo modelo do nicho, mantendo fotos,
 * contatos e qualquer outro dado que a cliente já tenha preenchido.
 */
export function withSegmentTemplate(
  content: SiteContent,
  segment: string,
  segmentOther = "",
): SiteContent {
  const starter = starterContentFor(segment, segmentOther);
  return {
    ...content,
    segmentOther: starter.segmentOther,
    tagline: starter.tagline,
    about: starter.about,
    hours: starter.hours,
    services: starter.services,
  };
}
