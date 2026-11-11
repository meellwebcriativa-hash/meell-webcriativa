import { z } from "zod";

export const PASSWORD_MIN = 8;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `A senha precisa ter pelo menos ${PASSWORD_MIN} caracteres.`)
  .max(72, "A senha pode ter no máximo 72 caracteres.");

/** Admin creates a client account and hands the credentials to her. */
export const clientAccountSchema = z.object({
  fullName: z.string().trim().min(2, "Informe o nome da cliente.").max(120),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(255),
  phone: z.string().trim().max(40).optional().default(""),
  businessName: z.string().trim().max(120).optional().default(""),
  password: passwordSchema,
});
export type ClientAccountInput = z.infer<typeof clientAccountSchema>;

const segmentFields = {
  segment: z.string().min(1, "Escolha o segmento do seu negócio."),
  segmentOther: z.string().trim().max(120).optional().default(""),
};

function requireOtherText<T extends { segment: string; segmentOther?: string }>(
  data: T,
  ctx: z.RefinementCtx,
) {
  if (data.segment === "outro" && !data.segmentOther?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["segmentOther"],
      message: "Conte qual é o seu tipo de negócio.",
    });
  }
}

/** First steps of the guided builder (stage 1 saves a draft project). */
export const projectStartSchema = z
  .object({
    name: z.string().trim().min(2, "Dê um nome ao seu site.").max(120),
    ...segmentFields,
    style: z.enum(["elegante", "moderno", "delicado", "minimalista"], {
      errorMap: () => ({ message: "Escolha um estilo." }),
    }),
  })
  .superRefine(requireOtherText);

/** "Quero um site personalizado" request form. */
export const siteRequestSchema = z
  .object({
    businessName: z.string().trim().min(2, "Informe o nome do negócio.").max(120),
    ...segmentFields,
    description: z.string().trim().min(10, "Conte um pouco mais sobre o seu negócio.").max(3000),
    colors: z.string().trim().max(300).optional().default(""),
    style: z.string().trim().max(60).optional().default(""),
    pages: z.array(z.string()).min(1, "Escolha pelo menos uma página."),
    contactWhatsapp: z.string().trim().max(40).optional().default(""),
    contactInstagram: z.string().trim().max(120).optional().default(""),
    contactEmail: z.string().trim().max(255).optional().default(""),
    contactAddress: z.string().trim().max(300).optional().default(""),
    referencesText: z.string().trim().max(2000).optional().default(""),
  })
  .superRefine(requireOtherText)
  .superRefine((data, ctx) => {
    if (!data.contactWhatsapp && !data.contactInstagram && !data.contactEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contactWhatsapp"],
        message: "Informe pelo menos um contato: WhatsApp, Instagram ou e-mail.",
      });
    }
  });

/** Only same-site paths are allowed as post-login destinations. */
export function safeRedirectPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Verifique os dados informados.";
}
