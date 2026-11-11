/** Translate auth error messages into friendly Portuguese. */
export function friendlyAuthError(message: string | undefined | null): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("banned")) return "Seu acesso está bloqueado. Fale com a administradora.";
  if (m.includes("already been registered") || m.includes("already registered") || m.includes("already exists"))
    return "Já existe uma conta com esse e-mail.";
  if (m.includes("pwned") || m.includes("weak") || m.includes("known to be"))
    return "Essa senha é muito comum ou já apareceu em vazamentos. Escolha outra.";
  if (m.includes("current password") || m.includes("reauthentication"))
    return "A senha atual está incorreta.";
  if (m.includes("same") && m.includes("password")) return "A nova senha precisa ser diferente da atual.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas. Aguarde alguns minutos.";
  if (m.includes("email not confirmed")) return "Seu e-mail ainda não foi confirmado.";
  if (m.includes("password")) return "Senha inválida. Use pelo menos 8 caracteres.";
  return "Algo não deu certo. Tente novamente em instantes.";
}
