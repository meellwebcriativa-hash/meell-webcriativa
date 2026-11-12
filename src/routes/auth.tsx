import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { friendlyAuthError } from "@/lib/auth-errors";
import { meQuery } from "@/lib/queries";
import { safeRedirectPath } from "@/lib/schemas";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const redirect = safeRedirectPath(search["redirect"]);
    return redirect ? { redirect } : {};
  },
  head: () => ({
    meta: [
      { title: "Entrar — Web Criativa" },
      { name: "description", content: "Acesse sua conta da Web Criativa para criar e acompanhar seu site." },
      { property: "og:title", content: "Entrar — Web Criativa" },
      { property: "og:description", content: "Acesse sua conta da Web Criativa para criar e acompanhar seu site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function goToHome() {
    const me = await queryClient.fetchQuery(meQuery);
    if (!me) return;
    if (redirect) navigate({ to: redirect, replace: true });
    else navigate({ to: me.isAdmin ? "/admin" : "/painel", replace: true });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void goToHome();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      toast.error(friendlyAuthError(error.message));
      return;
    }
    await queryClient.invalidateQueries({ queryKey: meQuery.queryKey });
    await goToHome();
    setLoading(false);
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(friendlyAuthError(error.message));
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link to="/" aria-label="Voltar ao início">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-[2rem] border bg-card p-8 shadow-candy sm:p-10">
          {mode === "login" ? (
            <>
              <h1 className="text-3xl font-semibold text-plum">Que bom ter você aqui</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Entre com o e-mail e a senha que você recebeu da Meell Criativa.
              </p>
              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <button type="button" onClick={() => { setMode("forgot"); setSent(false); }} className="text-xs font-medium text-primary hover:underline">
                      Esqueci minha senha
                    </button>
                  </div>
                  <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" />
                </div>
                <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <Lock />} Entrar
                </Button>
              </form>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                A plataforma é exclusiva para convidadas. Ainda não tem acesso? Fale com a Meell Criativa.
              </p>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setMode("login")} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Voltar
              </button>
              <h1 className="text-3xl font-semibold text-plum">Redefinir senha</h1>
              {sent ? (
                <div className="mt-6 rounded-2xl bg-soft p-5 text-sm text-secondary-foreground">
                  <Mail className="mb-2 size-5 text-lilac" />
                  Se esse e-mail tiver uma conta, enviamos um link para você criar uma nova senha. Confira também a caixa de spam.
                </div>
              ) : (
                <form onSubmit={handleForgot} className="mt-6 space-y-5">
                  <p className="text-sm text-muted-foreground">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">E-mail</Label>
                    <Input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Mail />} Enviar link
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
