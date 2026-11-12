import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  FolderHeart,
  Globe,
  Hammer,
  Loader2,
  PenLine,
  Rocket,
  Trash2,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/EmptyState";
import { ProjectStatusBadge } from "@/components/app/StatusBadge";
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
import { Button } from "@/components/ui/button";
import { PROJECT_STATUS, segmentLabel, styleLabel } from "@/lib/constants";
import { publishProject, setProjectStatus } from "@/lib/projects";
import { adminProjectsQuery } from "@/lib/queries";
import { parseSiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos — Web Criativa" },
      { name: "description", content: "Todos os sites das clientes: em produção, liberados e publicados." },
      { property: "og:title", content: "Projetos — Web Criativa" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminProjectsQuery),
  component: ProjectsPage,
});

type AdminProject = Awaited<ReturnType<NonNullable<typeof adminProjectsQuery.queryFn>>>[number];

const FILTERS = ["todos", "rascunho", "em_producao", "liberado", "publicado"] as const;

const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function ProjectsPage() {
  const { data: projects } = useSuspenseQuery(adminProjectsQuery);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("todos");
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "todos" ? projects : projects.filter((project) => project.status === filter)),
    [projects, filter],
  );

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminProjectsQuery.queryKey }),
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "requests"] }),
    ]);
  }

  async function run(id: string, action: () => Promise<unknown>, success: string) {
    setBusyId(id);
    try {
      await action();
      await refresh();
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir agora.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageTitle eyebrow="Administração" title="Projetos">
        Acompanhe cada site, libere para a cliente e publique quando estiver pronto.
      </PageTitle>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-full border bg-card p-1.5 shadow-card sm:w-fit">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground",
              filter === value && "bg-brand text-primary-foreground shadow-candy hover:bg-brand hover:text-primary-foreground",
            )}
          >
            {value === "todos" ? "Todos" : PROJECT_STATUS[value].label}
            <span className="ml-2 text-xs opacity-70">
              {value === "todos" ? projects.length : projects.filter((project) => project.status === value).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={<FolderHeart />} title="Nenhum projeto aqui">
          Quando uma cliente criar um site ou você criar a partir de um pedido, ele aparece nesta lista.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              busy={busyId === project.id}
              onSetStatus={(status) => run(project.id, () => setProjectStatus(project.id, status), "Status atualizado.")}
              onPublish={() => run(project.id, () => publishProject(project.id, project.name), "Site publicado.")}
              onDelete={() =>
                run(
                  project.id,
                  async () => {
                    const { error } = await supabase.from("projects").delete().eq("id", project.id);
                    if (error) throw new Error(error.message);
                  },
                  "Projeto excluído.",
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

function ProjectCard({
  project,
  busy,
  onSetStatus,
  onPublish,
  onDelete,
}: {
  project: AdminProject;
  busy: boolean;
  onSetStatus: (status: "rascunho" | "em_producao" | "liberado" | "publicado") => void;
  onPublish: () => void;
  onDelete: () => void;
}) {
  const content = parseSiteContent(project.content);
  const publicUrl = project.slug && typeof window !== "undefined" ? `${window.location.origin}/s/${project.slug}` : "";

  return (
    <div className="flex flex-col rounded-3xl border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-plum">{project.name}</p>
          <p className="text-sm text-muted-foreground">
            {project.profiles?.full_name || project.profiles?.email || "Cliente"}
          </p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="mt-3 text-sm text-secondary-foreground">
        {segmentLabel(project.segment, content.segmentOther)}
        {project.template ? ` · ${styleLabel(project.template)}` : ""}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Atualizado em {dateFmt.format(new Date(project.updated_at))}</p>

      {publicUrl ? (
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 truncate text-xs text-primary hover:underline"
        >
          <Globe className="size-3.5 shrink-0" /> {publicUrl.replace(/^https?:\/\//, "")}
        </a>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild variant="soft" size="sm">
          <Link to="/painel/projeto/$id" params={{ id: project.id }}>
            <PenLine /> Editar
          </Link>
        </Button>

        {project.status !== "em_producao" ? (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => onSetStatus("em_producao")}>
            <Hammer /> Em produção
          </Button>
        ) : null}

        {project.status !== "liberado" ? (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => onSetStatus("liberado")}>
            <Undo2 /> Liberar
          </Button>
        ) : null}

        {project.status !== "publicado" ? (
          <Button variant="brand" size="sm" disabled={busy} onClick={onPublish}>
            {busy ? <Loader2 className="animate-spin" /> : <Rocket />} Publicar
          </Button>
        ) : publicUrl ? (
          <Button asChild variant="outline" size="sm">
            <a href={publicUrl} target="_blank" rel="noreferrer">
              <ExternalLink /> Ver no ar
            </a>
          </Button>
        ) : null}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" aria-label={`Excluir ${project.name}`} disabled={busy}>
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir este projeto?</AlertDialogTitle>
              <AlertDialogDescription>
                O site "{project.name}" será apagado para a cliente também. Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
