import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ExternalLink,
  FolderHeart,
  Heart,
  Inbox,
  MessageCircle,
  PenLine,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/EmptyState";
import { ProjectStatusBadge, RequestStatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PROJECT_STATUS, segmentLabel, styleLabel } from "@/lib/constants";
import { meQuery, myProjectsQuery, myRequestsQuery } from "@/lib/queries";
import { linkSitePersonalizado } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/painel/")({
  head: () => ({
    meta: [
      { title: "Meu painel — Web Criativa" },
      { name: "description", content: "Crie seu site ou acompanhe seus projetos na Web Criativa." },
      { property: "og:title", content: "Meu painel — Web Criativa" },
      { property: "og:description", content: "Crie seu site ou acompanhe seus projetos na Web Criativa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQuery);
    if (me) {
      await Promise.all([
        context.queryClient.ensureQueryData(myProjectsQuery(me.id)),
        context.queryClient.ensureQueryData(myRequestsQuery(me.id)),
      ]);
    }
  },
  component: ClientDashboard,
});

const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function ClientDashboard() {
  const { data: me } = useSuspenseQuery(meQuery);
  const userId = me?.id ?? "";
  const { data: projects } = useSuspenseQuery(myProjectsQuery(userId));
  const { data: requests } = useSuspenseQuery(myRequestsQuery(userId));
  const queryClient = useQueryClient();
  const firstName = me?.fullName.split(" ")[0] || "por aqui";

  const deleteDraft = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Rascunho excluído.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast.error("Não foi possível excluir agora."),
  });

  return (
    <AppShell>
      <PageTitle eyebrow="Meu painel" title={`Olá, ${firstName}!`}>
        Como você quer criar o seu site hoje?
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/painel/criar"
          className="group rounded-[2rem] border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-candy"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-lilac-soft text-secondary-foreground">
            <Wand2 className="size-6" />
          </div>
          <p className="mt-6 text-xs font-medium tracking-[0.2em] text-lilac uppercase">Opção 1</p>
          <h2 className="mt-1 text-2xl font-semibold text-plum">Criar meu próprio site</h2>
          <p className="mt-2 text-muted-foreground">Você monta sozinha, seguindo etapas simples e guiadas.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Começar agora <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        <div className="flex flex-col">
          <a
            href={linkSitePersonalizado}
            target="_blank"
            rel="noreferrer"
            className="group flex-1 rounded-[2rem] bg-brand p-8 text-primary-foreground shadow-candy transition-all hover:-translate-y-1 hover:bg-brand-hover"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-card/25">
              <Heart className="size-6" />
            </div>
            <p className="mt-6 text-xs font-medium tracking-[0.2em] uppercase opacity-80">Opção 2</p>
            <h2 className="mt-1 text-2xl font-semibold">Quero um site personalizado</h2>
            <p className="mt-2 opacity-90">Fale com a Meell Criativa no WhatsApp e a gente desenvolve o site para você.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="size-4" /> Pedir pelo WhatsApp
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
          <Link
            to="/painel/solicitar"
            className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-lilac-soft"
          >
            Ou preencher o formulário aqui
          </Link>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold text-plum">Meus projetos</h2>
        {projects.length === 0 ? (
          <EmptyState icon={<FolderHeart />} title="Nenhum projeto ainda">
            Quando você começar um site ou a administradora liberar um para você, ele aparece aqui.
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const content = (p.content ?? {}) as { segmentOther?: string };
              return (
                <div key={p.id} className="flex flex-col rounded-3xl border bg-card p-6 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-plum">{p.name}</h3>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {segmentLabel(p.segment, content.segmentOther)}
                    {p.template ? ` · ${styleLabel(p.template)}` : ""}
                  </p>
                  <p className="mt-4 text-sm text-secondary-foreground">{PROJECT_STATUS[p.status].hint}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                    <Button asChild variant="soft" size="sm">
                      <Link to="/painel/projeto/$id" params={{ id: p.id }}>
                        <PenLine /> Editar
                      </Link>
                    </Button>
                    {p.slug && p.status === "publicado" ? (
                      <Button asChild variant="outline" size="sm">
                        <a href={`/s/${p.slug}`} target="_blank" rel="noreferrer">
                          <ExternalLink /> Ver site
                        </a>
                      </Button>
                    ) : null}
                    {p.status === "rascunho" ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label={`Excluir ${p.name}`}>
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir este rascunho?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O projeto "{p.name}" será apagado e não poderá ser recuperado.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteDraft.mutate(p.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                    <span className="ml-auto text-xs text-muted-foreground">
                      Atualizado em {dateFmt.format(new Date(p.updated_at))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold text-plum">Meus pedidos de site personalizado</h2>
        {requests.length === 0 ? (
          <EmptyState icon={<Inbox />} title="Nenhum pedido enviado">
            Prefere que a gente faça por você? Use a opção "Quero um site personalizado" e fale com a gente no
            WhatsApp.
          </EmptyState>
        ) : (
          <div className="divide-y rounded-3xl border bg-card shadow-card">
            {requests.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="font-medium text-plum">{r.business_name}</p>
                  <p className="text-xs text-muted-foreground">Enviado em {dateFmt.format(new Date(r.created_at))}</p>
                </div>
                <RequestStatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
