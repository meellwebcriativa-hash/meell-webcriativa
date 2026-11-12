import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ExternalLink,
  Inbox,
  Loader2,
  MessageCircle,
  Plus,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { PageTitle } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/EmptyState";
import { RequestStatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  REQUEST_STATUS,
  SITE_STYLES,
  segmentLabel,
  styleLabel,
  type RequestStatus,
} from "@/lib/constants";
import { adminRequestsQuery, meQuery } from "@/lib/queries";
import { parseRequestSegment } from "@/lib/site-content";
import { starterContentFor, templateForSegment } from "@/lib/site-templates";
import { signedUrls } from "@/lib/uploads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/solicitacoes")({
  head: () => ({
    meta: [
      { title: "Solicitações — Web Criativa" },
      { name: "description", content: "Pedidos de site personalizado enviados pelas clientes." },
      { property: "og:title", content: "Solicitações — Web Criativa" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminRequestsQuery),
  component: RequestsPage,
});

type AdminRequest = Awaited<ReturnType<NonNullable<typeof adminRequestsQuery.queryFn>>>[number];

const FILTERS = ["todas", "nova", "em_andamento", "concluida", "cancelada"] as const;

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function RequestsPage() {
  const { data: requests } = useSuspenseQuery(adminRequestsQuery);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("todas");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "todas" ? requests : requests.filter((request) => request.status === filter)),
    [requests, filter],
  );

  const selected = requests.find((request) => request.id === openId) ?? null;

  return (
    <>
      <PageTitle eyebrow="Administração" title="Solicitações">
        Pedidos de site personalizado. Abra um pedido para ver tudo o que a cliente enviou.
      </PageTitle>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-full border bg-card p-1.5 shadow-card sm:w-fit">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground",
              filter === value &&
                "bg-brand text-primary-foreground shadow-candy hover:bg-brand hover:text-primary-foreground",
            )}
          >
            {value === "todas" ? "Todas" : REQUEST_STATUS[value].label}
            <span className="ml-2 text-xs opacity-70">
              {value === "todas"
                ? requests.length
                : requests.filter((request) => request.status === value).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={<Inbox />} title="Nenhum pedido por aqui">
          Quando uma cliente pedir um site personalizado, ele aparece nesta lista.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((request) => {
            const { segment, other } = parseRequestSegment(request.segment);
            return (
              <button
                key={request.id}
                type="button"
                onClick={() => setOpenId(request.id)}
                className="rounded-3xl border bg-card p-6 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-candy"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-plum">{request.business_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.profiles?.full_name || request.profiles?.email || "Cliente"}
                    </p>
                  </div>
                  <RequestStatusBadge status={request.status} />
                </div>
                <p className="mt-3 text-sm text-secondary-foreground">
                  {segmentLabel(segment, other)}
                  {request.style ? ` · ${styleLabel(request.style)}` : ""}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {request.description}
                </p>
                <p className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />{" "}
                  {dateFmt.format(new Date(request.created_at))}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {selected ? (
        <RequestDialog key={selected.id} request={selected} onClose={() => setOpenId(null)} />
      ) : null}
    </>
  );
}

function RequestDialog({ request, onClose }: { request: AdminRequest; onClose: () => void }) {
  const { data: me } = useSuspenseQuery(meQuery);
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState(request.admin_notes ?? "");
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [projectId, setProjectId] = useState(request.project_id ?? "");

  const paths = useMemo(
    () =>
      [request.logo_path, ...(request.photo_paths ?? [])].filter((path): path is string => !!path),
    [request.logo_path, request.photo_paths],
  );

  useEffect(() => {
    if (paths.length === 0) return;
    let active = true;
    signedUrls(paths)
      .then((map) => {
        if (active) setFiles(map);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [paths]);

  const { segment, other } = parseRequestSegment(request.segment);

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminRequestsQuery.queryKey }),
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] }),
    ]);
  }

  async function save() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_requests")
        .update({ admin_notes: notes, status })
        .eq("id", request.id);
      if (error) throw error;
      await refresh();
      toast.success("Pedido atualizado.");
    } catch {
      toast.error("Não foi possível salvar agora.");
    } finally {
      setSaving(false);
    }
  }

  async function createProject() {
    if (!me) return;
    setCreating(true);
    try {
      const starter = starterContentFor(segment, other);
      const { data: created, error } = await supabase
        .from("projects")
        .insert({
          owner_id: request.client_id,
          created_by: me.id,
          request_id: request.id,
          name: request.business_name,
          segment,
          template: request.style || templateForSegment(segment).style,
          status: "em_producao",
          content: {
            ...starter,
            // O texto da cliente tem prioridade sobre o exemplo do nicho.
            about: request.description.trim() || starter.about,
            whatsapp: request.contact_whatsapp,
            instagram: request.contact_instagram,
            email: request.contact_email,
            address: request.contact_address,
            gallery: request.photo_paths ?? [],
          } as unknown as Json,
        })
        .select("id")
        .maybeSingle();

      if (error || !created) throw error ?? new Error("Projeto não criado.");

      const { error: linkError } = await supabase
        .from("site_requests")
        .update({ project_id: created.id, status: "em_andamento" })
        .eq("id", request.id);
      if (linkError) throw linkError;

      setProjectId(created.id);
      setStatus("em_andamento");
      await refresh();
      toast.success("Site criado! Agora é só montar no editor.");
    } catch (error) {
      console.error("createProject", error);
      toast.error("Não foi possível criar o site agora.");
    } finally {
      setCreating(false);
    }
  }

  const photos = (request.photo_paths ?? [])
    .map((path) => files[path])
    .filter((url): url is string => !!url);
  const logoUrl = request.logo_path ? files[request.logo_path] : "";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-plum">
            {request.business_name}
          </DialogTitle>
          <DialogDescription>
            {request.profiles?.full_name || "Cliente"}
            {request.profiles?.email ? ` · ${request.profiles.email}` : ""} ·{" "}
            {dateFmt.format(new Date(request.created_at))}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-2 rounded-2xl bg-soft p-4 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Segmento: </span>
              {segmentLabel(segment, other)}
            </p>
            <p>
              <span className="text-muted-foreground">Estilo: </span>
              {request.style ? styleLabel(request.style) : "Sem preferência"}
            </p>
            <p className="sm:col-span-2">
              <span className="text-muted-foreground">Cores: </span>
              {request.colors || "—"}
            </p>
            <p className="sm:col-span-2">
              <span className="text-muted-foreground">Páginas: </span>
              {(request.pages ?? []).join(", ") || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-plum">Sobre o negócio</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
              {request.description || "—"}
            </p>
          </div>

          <div className="grid gap-2 text-sm">
            {request.contact_whatsapp ? (
              <p className="inline-flex items-center gap-2">
                <MessageCircle className="size-4 text-lilac" /> {request.contact_whatsapp}
              </p>
            ) : null}
            {request.contact_instagram ? <p>Instagram: {request.contact_instagram}</p> : null}
            {request.contact_email ? <p>E-mail: {request.contact_email}</p> : null}
            {request.contact_address ? <p>Endereço: {request.contact_address}</p> : null}
          </div>

          {request.references_text ? (
            <div>
              <p className="text-sm font-medium text-plum">Referências</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {request.references_text}
              </p>
            </div>
          ) : null}

          {logoUrl || photos.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-plum">Arquivos enviados</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {logoUrl ? (
                  <a
                    href={logoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"
                  >
                    <ExternalLink className="size-3.5" /> Logotipo
                  </a>
                ) : null}
                {photos.map((url, index) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="size-20 rounded-xl border object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>Status do pedido</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(REQUEST_STATUS) as RequestStatus[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    status === value
                      ? "border-transparent bg-brand text-primary-foreground"
                      : "bg-card text-secondary-foreground",
                  )}
                >
                  {REQUEST_STATUS[value].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">Anotações internas</Label>
            <Textarea
              id="admin-notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Só você vê estas anotações."
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="brand" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />} Salvar
            </Button>

            {projectId ? (
              <Button asChild variant="outline">
                <Link to="/painel/projeto/$id" params={{ id: projectId }}>
                  <Wand2 /> Abrir site no editor
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={createProject} disabled={creating}>
                {creating ? <Loader2 className="animate-spin" /> : <Plus />} Criar site para a
                cliente
              </Button>
            )}
          </div>

          {projectId ? (
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-lilac" /> Este pedido já tem um site vinculado.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
