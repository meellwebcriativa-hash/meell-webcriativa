import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { KeyRound, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { friendlyAuthError } from "@/lib/auth-errors";
import { meQuery } from "@/lib/queries";
import { firstError, passwordSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Web Criativa" },
      { name: "description", content: "Atualize seus dados e sua senha na Web Criativa." },
      { property: "og:title", content: "Minha conta — Web Criativa" },
      { property: "og:description", content: "Atualize seus dados e sua senha na Web Criativa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(meQuery),
  component: AccountPage,
});

function AccountPage() {
  const { data: me } = useSuspenseQuery(meQuery);
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(me?.fullName ?? "");
  const [phone, setPhone] = useState(me?.phone ?? "");
  const [businessName, setBusinessName] = useState(me?.businessName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (!me) return;
    if (fullName.trim().length < 2) {
      toast.error("Informe seu nome.");
      return;
    }
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), phone: phone.trim() || null, business_name: businessName.trim() || null })
      .eq("id", me.id);
    setSavingProfile(false);
    if (error) {
      toast.error("Não foi possível salvar agora.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: meQuery.queryKey });
    toast.success("Dados atualizados.");
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(next);
    if (!parsed.success) {
      toast.error(firstError(parsed.error));
      return;
    }
    if (next !== confirm) {
      toast.error("As senhas novas não são iguais.");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: next, current_password: current } as {
      password: string;
    });
    setSavingPassword(false);
    if (error) {
      toast.error(friendlyAuthError(error.message));
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Senha alterada com sucesso.");
  }

  return (
    <AppShell>
      <PageTitle eyebrow="Minha conta" title="Seus dados">
        Mantenha suas informações atualizadas e troque sua senha quando quiser.
      </PageTitle>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="space-y-5 rounded-[2rem] border bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-semibold text-plum">Informações pessoais</h2>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={me?.email ?? ""} disabled className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone / WhatsApp</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business">Nome do negócio</Label>
            <Input id="business" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <Button type="submit" variant="brand" disabled={savingProfile}>
            {savingProfile ? <Loader2 className="animate-spin" /> : <Save />} Salvar dados
          </Button>
        </form>

        <form onSubmit={savePassword} className="space-y-5 rounded-[2rem] border bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-semibold text-plum">Trocar senha</h2>
          <p className="text-sm text-muted-foreground">Recebeu uma senha da administradora? Troque por uma só sua.</p>
          <div className="space-y-2">
            <Label htmlFor="current">Senha atual</Label>
            <Input id="current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next">Nova senha</Label>
            <Input id="next" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Repita a nova senha</Label>
            <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <Button type="submit" variant="brand" disabled={savingPassword || !current}>
            {savingPassword ? <Loader2 className="animate-spin" /> : <KeyRound />} Alterar senha
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
