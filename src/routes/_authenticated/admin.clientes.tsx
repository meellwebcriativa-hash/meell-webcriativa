import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Ban, Check, Copy, KeyRound, Loader2, RefreshCw, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientAccount, setClientBlocked, setClientPassword } from "@/lib/admin.functions";
import { generatePassword } from "@/lib/password";
import { adminClientsQuery } from "@/lib/queries";
import { clientAccountSchema, firstError, passwordSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/admin/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — Web Criativa" },
      { name: "description", content: "Cadastre, bloqueie e gerencie as clientes da Web Criativa." },
      { property: "og:title", content: "Clientes — Web Criativa" },
      { property: "og:description", content: "Cadastre, bloqueie e gerencie as clientes da Web Criativa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminClientsQuery),
  component: ClientsPage,
});

type Credentials = { name: string; email: string; password: string };

function credentialsText(c: Credentials) {
  const url = typeof window === "undefined" ? "" : `${window.location.origin}/auth`;
  return `Olá, ${c.name.split(" ")[0]}! Seu acesso à Web Criativa está pronto.\n\nAcesse: ${url}\nE-mail: ${c.email}\nSenha: ${c.password}\n\nDepois de entrar, você pode trocar a senha em "Minha conta".`;
}

function ClientsPage() {
  const { data: clients } = useSuspenseQuery(adminClientsQuery);
  const queryClient = useQueryClient();
  const createFn = useServerFn(createClientAccount);
  const blockFn = useServerFn(setClientBlocked);
  const passwordFn = useServerFn(setClientPassword);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", businessName: "", password: generatePassword() });
  const [saving, setSaving] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [pwTarget, setPwTarget] = useState<{ id: string; name: string; email: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: adminClientsQuery.queryKey });

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const parsed = clientAccountSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(firstError(parsed.error));
      return;
    }
    setSaving(true);
    try {
      const res = await createFn({ data: parsed.data });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Cliente cadastrada!");
      setCreateOpen(false);
      setCredentials({ name: parsed.data.fullName, email: parsed.data.email, password: parsed.data.password });
      setForm({ fullName: "", email: "", phone: "", businessName: "", password: generatePassword() });
      await refresh();
    } catch {
      toast.error("Não foi possível cadastrar agora.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleBlock(id: string, blocked: boolean) {
    setBusyId(id);
    try {
      const res = await blockFn({ data: { userId: id, blocked } });
      if (!res.ok) toast.error(res.error);
      else toast.success(blocked ? "Acesso bloqueado." : "Acesso liberado.");
      await refresh();
    } catch {
      toast.error("Não foi possível alterar o acesso.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleNewPassword(e: FormEvent) {
    e.preventDefault();
    if (!pwTarget) return;
    const parsed = passwordSchema.safeParse(newPassword);
    if (!parsed.success) {
      toast.error(firstError(parsed.error));
      return;
    }
    setSaving(true);
    try {
      const res = await passwordFn({ data: { userId: pwTarget.id, password: newPassword } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setCredentials({ name: pwTarget.name, email: pwTarget.email, password: newPassword });
      setPwTarget(null);
      toast.success("Nova senha definida.");
    } catch {
      toast.error("Não foi possível trocar a senha.");
    } finally {
      setSaving(false);
    }
  }

  async function copyCredentials() {
    if (!credentials) return;
    await navigator.clipboard.writeText(credentialsText(credentials));
    toast.success("Mensagem copiada! É só colar no WhatsApp ou e-mail da cliente.");
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow="Administração" title="Clientes">
          Cadastre o acesso da cliente e envie os dados de entrada para ela.
        </PageTitle>
        <Button variant="brand" className="mb-8" onClick={() => setCreateOpen(true)}>
          <UserPlus /> Nova cliente
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState icon={<Users />} title="Nenhuma cliente cadastrada">Clique em "Nova cliente" para criar o primeiro acesso.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {clients.map((c) => (
            <div key={c.id} className="rounded-3xl border bg-card p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-plum">{c.full_name || "Sem nome"}</p>
                  <p className="text-sm text-muted-foreground">{c.email}</p>
                  {c.business_name || c.phone ? (
                    <p className="mt-1 text-sm text-secondary-foreground">{[c.business_name, c.phone].filter(Boolean).join(" · ")}</p>
                  ) : null}
                </div>
                {c.blocked ? <Badge variant="muted">Bloqueada</Badge> : <Badge variant="success">Ativa</Badge>}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="soft" size="sm" onClick={() => { setPwTarget({ id: c.id, name: c.full_name, email: c.email }); setNewPassword(generatePassword()); }}>
                  <KeyRound /> Nova senha
                </Button>
                <Button variant="outline" size="sm" disabled={busyId === c.id} onClick={() => toggleBlock(c.id, !c.blocked)}>
                  {busyId === c.id ? <Loader2 className="animate-spin" /> : c.blocked ? <Check /> : <Ban />}
                  {c.blocked ? "Desbloquear" : "Bloquear"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-plum">Nova cliente</DialogTitle>
            <DialogDescription>A conta já fica pronta para uso. Depois é só enviar os dados para ela.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="c-name">Nome</Label>
              <Input id="c-name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-email">E-mail</Label>
              <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-phone">WhatsApp</Label>
                <Input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-business">Negócio</Label>
                <Input id="c-business" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-password">Senha inicial</Label>
              <div className="flex gap-2">
                <Input id="c-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl font-mono" />
                <Button type="button" variant="outline" size="icon" aria-label="Gerar outra senha" onClick={() => setForm({ ...form, password: generatePassword() })}>
                  <RefreshCw />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant="brand" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <UserPlus />} Cadastrar cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pwTarget} onOpenChange={(o) => !o && setPwTarget(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-plum">Nova senha</DialogTitle>
            <DialogDescription>Defina uma nova senha para {pwTarget?.name || pwTarget?.email}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewPassword} className="space-y-4">
            <div className="flex gap-2">
              <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-xl font-mono" aria-label="Nova senha" />
              <Button type="button" variant="outline" size="icon" aria-label="Gerar outra senha" onClick={() => setNewPassword(generatePassword())}>
                <RefreshCw />
              </Button>
            </div>
            <DialogFooter>
              <Button type="submit" variant="brand" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <KeyRound />} Salvar senha
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!credentials} onOpenChange={(o) => !o && setCredentials(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-plum">Dados de acesso</DialogTitle>
            <DialogDescription>Copie a mensagem e envie para a cliente. Por segurança, a senha não fica salva para consulta.</DialogDescription>
          </DialogHeader>
          {credentials ? (
            <pre className="rounded-2xl bg-soft p-4 text-sm whitespace-pre-wrap text-secondary-foreground">{credentialsText(credentials)}</pre>
          ) : null}
          <DialogFooter>
            <Button variant="brand" onClick={copyCredentials}>
              <Copy /> Copiar mensagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
