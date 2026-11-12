/** Números de WhatsApp da Meell Criativa (formato internacional, só dígitos). */
export const WHATSAPP_CADASTRO = "5551985839571";
export const WHATSAPP_SITE_PERSONALIZADO = "5551985165608";

/** Mensagem já preenchida quando a pessoa abre a conversa. */
export const MENSAGEM_SITE_PERSONALIZADO = "Oii, quero meu site personalizado pela Web Criativa!";

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Link para pedir o cadastro (a plataforma é por convite). */
export const linkPedirCadastro = whatsappUrl(WHATSAPP_CADASTRO, MENSAGEM_SITE_PERSONALIZADO);

/** Link para pedir um site personalizado feito pela Meell Criativa. */
export const linkSitePersonalizado = whatsappUrl(
  WHATSAPP_SITE_PERSONALIZADO,
  MENSAGEM_SITE_PERSONALIZADO,
);
