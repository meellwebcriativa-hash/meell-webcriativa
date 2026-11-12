import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, FolderHeart, Inbox, Users } from "lucide-react";
import { PageTitle } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/EmptyState";
import { RequestStatusBadge } from "@/components/app/StatusBadge";
import { adminClientsQuery, adminProjectsQuery, adminRequestsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Administração — Web Criativa" },
      { name: "description", content: "Visão geral de clientes, solicitações e projetos da Web Criativa." },
      { property: "og:title", content: "Administração — Web Criativa" },
      { property: "og:description", content: "Visão geral de clientes, solicitações e projetos da Web Criativa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminClientsQuery),
      context.queryClient.ensureQueryData(adminRequestsQuery),
      context.queryClient.ensureQueryData(adminProjectsQuery),
    ]),
  component: AdminHome,
});

function AdminHome() {
  const { data: clients } = useSuspenseQuery(adminClientsQuery);
  const { data: requests } = useSuspenseQuery(adminRequestsQuery);
  const { data: projects } = useSuspenseQuery(adminProjectsQuery);
  const newRequests = requests.filter((r) => r.status === "nova");
  const inProduction = projects.filter((p) => p.status === "em_producao").length;

  const stats = [
    { label: "Clientes ativas", value: clients.filter((c) => !c.blocked).length, icon: Users, to: "/admin/clientes" as const },
    { label: "Pedidos novos", value: newRequests.length, icon: Inbox, to: "/admin/solicitacoes" as const },
    { label: "Sites em produção", value: inProduction, icon: FolderHeart, to: "/admin/projetos" as const },
  ];

  return (
    <>
      <PageTitle eyebrow="Administração" title="Visão geral">
        Acompanhe suas clientes, os pedidos de site e o andamento dos projetos.
      </PageTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group rounded-3xl border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-candy">
            <s.icon className="size-5 text-lilac" />
            <p className="mt-4 font-display text-4xl text-plum">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-plum">Pedidos aguardando você</h2>
          <Link to="/admin/solicitacoes" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>
        {newRequests.length === 0 ? (
          <EmptyState icon={<Inbox />} title="Nenhum pedido novo">Quando uma cliente pedir um site personalizado, ele aparece aqui.</EmptyState>
        ) : (
          <div className="divide-y rounded-3xl border bg-card shadow-card">
            {newRequests.slice(0, 5).map((r) => (
              <Link key={r.id} to="/admin/solicitacoes" className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-muted/50">
                <div>
                  <p className="font-medium text-plum">{r.business_name}</p>
                  <p className="text-xs text-muted-foreground">{r.profiles?.full_name || r.profiles?.email}</p>
                </div>
                <RequestStatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
