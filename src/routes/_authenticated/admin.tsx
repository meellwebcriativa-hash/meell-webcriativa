import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { meQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQuery);
    if (!me?.isAdmin) throw redirect({ to: "/painel" });
  },
  component: AdminLayout,
});

const tab =
  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground";
const tabActive = "bg-brand text-primary-foreground shadow-candy hover:bg-brand hover:text-primary-foreground";

function AdminLayout() {
  return (
    <AppShell>
      <div className="mb-8 flex gap-2 overflow-x-auto rounded-full border bg-card p-1.5 shadow-card sm:w-fit">
        <Link to="/admin" activeOptions={{ exact: true }} className={tab} activeProps={{ className: tabActive }}>
          Visão geral
        </Link>
        <Link to="/admin/clientes" className={tab} activeProps={{ className: tabActive }}>
          Clientes
        </Link>
        <Link to="/admin/solicitacoes" className={tab} activeProps={{ className: tabActive }}>
          Solicitações
        </Link>
        <Link to="/admin/projetos" className={tab} activeProps={{ className: tabActive }}>
          Projetos
        </Link>
      </div>
      <Outlet />
    </AppShell>
  );
}
