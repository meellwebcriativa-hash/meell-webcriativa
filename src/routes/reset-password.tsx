import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { PageBackdrop } from "@/components/brand/PageBackdrop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { friendlyAuthError } from "@/lib/auth-errors";
import { firstError, passwordSchema } from "@/lib/schemas";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Criar nova senha — Web Criativa" },
      { name: "description", content: "Crie uma nova senha para acessar a Web Criativa." },
      { property: "og:title", content: "Criar nova senha — Web Criativa" },
      { property: "og:description", content: "Crie uma nova senha para acessar a Web Criativa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      toast.error(firstError(parsed.error));
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não são iguais.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(friendlyAuthError(error.message));
      return;
    }
    toast.success("Senha criada! Bem-vinda de volta.");
    navigate({ to: "/painel", replace: true });
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <PageBackdrop />
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link to="/"><Logo /></Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-[2rem] border bg-card p-8 shadow-candy sm:p-10">
          <h1 className="text-3xl font-semibold text-plum">Criar nova senha</h1>
          {ready ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Repita a nova senha</Label>
                <Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <KeyRound />} Salvar nova senha
              </Button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Abra esta página pelo link enviado ao seu e-mail. Se o link expirou,{" "}
              <Link to="/auth" className="font-medium text-primary hover:underline">peça um novo</Link>.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
