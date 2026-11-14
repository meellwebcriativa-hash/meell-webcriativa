import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, redirect, useParams } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  ImagePlus,
  Loader2,
  Plus,
  Rocket,
  Save,
  Sparkles,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { SegmentPicker } from "@/components/app/SegmentPicker";
import { ProjectStatusBadge } from "@/components/app/StatusBadge";
import { SitePreviewCard, SiteRenderer } from "@/components/site/SiteRenderer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_STATUS, SITE_STYLES, segmentLabel, type ProjectStatus } from "@/lib/constants";
import { publishProject, setProjectStatus } from "@/lib/projects";
import { meQuery, projectQuery, type Me } from "@/lib/queries";
import { parseSiteContent, storagePathsOf, type SiteContent } from "@/lib/site-content";
import { designForSegment } from "@/lib/site-designs";
import { hasCustomContent, templateForSegment, withSegmentTemplate } from "@/lib/site-templates";
import { MAX_PHOTOS, signedUrls, uploadUserFiles } from "@/lib/uploads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/painel/projeto/$id")({
  head: () => ({
    meta: [
      { title: "Editar site — Web Criativa" },
      { name: "description", content: "Personalize seu site e veja a prévia mudar na hora." },
      { property: "og:title", content: "Editar site — Web Criativa" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params, context }) => {
    const me = await context.queryClient.ensureQueryData(meQuery);
    const project = await context.queryClient.ensureQueryData(projectQuery(params.id));

    if (!project) throw notFound();
    if (!me?.isAdmin && me?.id !== project.owner_id) throw redirect({ to: "/painel" });
  },
  component: ProjectEditor,
});

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card sm:p-8">
      <h2 className="text-xl font-semibold text-plum">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

type EditorProject = NonNullable<
  Awaited<ReturnType<NonNullable<ReturnType<typeof projectQuery>["queryFn"]>>>
>;

function ProjectEditor() {
  const { id } = useParams({ from: "/_authenticated/painel/projeto/$id" });
  const { data: me } = useSuspenseQuery(meQuery);
  const { data: project } = useSuspenseQuery(projectQuery(id));

  if (!project) return null;

  return <ProjectEditorForm key={project.id} project={project} me={me} />;
}

function ProjectEditorForm({ project, me }: { project: EditorProject; me: Me | null }) {
  const queryClient = useQueryClient();

  const isAdmin = !!me?.isAdmin;
  const canEdit = isAdmin || project.status !== "em_producao";

  const initial = useMemo(() => parseSiteContent(project.content), [project.content]);

  const [name, setName] = useState(project.name);
  const [segment, setSegment] = useState(project.segment || "outro");
  const [template, setTemplate] = useState(project.template || "elegante");
  const [content, setContent] = useState<SiteContent>(initial);
  const [slug, setSlug] = useState(project.slug ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project.status);

  const [galleryUrls, setGalleryUrls] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [applyTemplateOpen, setApplyTemplateOpen] = useState(false);

  const heroInputRef = useRef<HTMLInputElement>(null);
  // Gallery, service photos and the main photo are all private files: sign every one.
  const storagePaths = storagePathsOf(content);
  const galleryKey = storagePaths.join("|");

  useEffect(() => {
    if (storagePaths.length === 0) return;
    let active = true;
    signedUrls(storagePaths)
      .then((map) => {
        if (active) setGalleryUrls((current) => ({ ...current, ...map }));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryKey]);

  const patch = (values: Partial<SiteContent>) =>
    setContent((current) => ({ ...current, ...values }));

  // Site ainda em branco? O modelo do nicho entra sozinho ao trocar o segmento.
  function handleSegmentChange(value: string) {
    setSegment(value);
    if (value === "outro") return;
    setContent((current) => (hasCustomContent(current) ? current : withSegmentTemplate(current, value)));
  }

  function applySegmentTemplate() {
    setContent((current) => withSegmentTemplate(current, segment, current.segmentOther));
    setApplyTemplateOpen(false);
    toast.success(
      `Modelo de ${segmentLabel(segment)} aplicado. Clique em Salvar para guardar as alterações.`,
    );
  }

  const preview = useMemo<SiteContent>(
    () => ({ ...content, segmentOther: segment === "outro" ? content.segmentOther : "" }),
    [content, segment],
  );

  const contentIsBlank = !hasCustomContent(content);

  const publicUrl =
    slug && typeof window !== "undefined" ? `${window.location.origin}/s/${slug}` : "";

  async function persist(): Promise<boolean> {
    if (name.trim().length < 2) {
      toast.error("Dê um nome ao seu site.");
      return false;
    }
    if (segment === "outro" && !content.segmentOther.trim()) {
      toast.error("Conte qual é o seu tipo de negócio.");
      return false;
    }
    const payload = {
      name: name.trim(),
      segment,
      template,
      content: {
        ...content,
        segmentOther: segment === "outro" ? content.segmentOther.trim() : "",
        services: content.services.filter(
          (service) => service.title.trim() || service.description.trim(),
        ),
      } as unknown as Json,
    };
    const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
    if (error) {
      console.error("saveProject", error);
      toast.error("Não foi possível salvar agora.");
      return false;
    }
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
    return true;
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (await persist()) toast.success("Alterações salvas.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      if (!(await persist())) return;
      const reserved = await publishProject(project.id, name);
      setSlug(reserved);
      setStatus("publicado");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Site publicado! Já está no ar.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível publicar agora.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleUnpublish() {
    setPublishing(true);
    try {
      await setProjectStatus(project.id, "liberado");
      setStatus("liberado");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Site saiu do ar. Você pode publicar de novo quando quiser.");
    } catch {
      toast.error("Não foi possível despublicar agora.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length || !me) return;
    const room = MAX_PHOTOS - content.gallery.length;
    if (room <= 0) {
      toast.info(`Você pode ter até ${MAX_PHOTOS} fotos na galeria.`);
      return;
    }
    setUploading(true);
    try {
      const paths = await uploadUserFiles(me.id, "projects", Array.from(files).slice(0, room));
      const urls = await signedUrls(paths);
      setGalleryUrls((current) => ({ ...current, ...urls }));
      setContent((current) => ({ ...current, gallery: [...current.gallery, ...paths] }));
      toast.success(paths.length === 1 ? "Foto adicionada." : "Fotos adicionadas.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  async function handleHeroUpload(file: File | undefined) {
    if (!file || !me) return;
    setUploading(true);
    try {
      const [path] = await uploadUserFiles(me.id, "projects", [file]);
      if (!path) throw new Error("Não foi possível enviar a foto.");
      const urls = await signedUrls([path]);
      setGalleryUrls((current) => ({ ...current, ...urls }));
      patch({ heroImage: path });
      toast.success("Foto principal trocada. Clique em Salvar para guardar.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(path: string) {
    setContent((current) => ({
      ...current,
      gallery: current.gallery.filter((item) => item !== path),
    }));
    void supabase.storage.from("uploads").remove([path]);
  }

  async function copyPublicUrl() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Link copiado!");
  }

  return (
    <AppShell>
      <Link
        to="/painel"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar ao painel
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <PageTitle eyebrow="Editor do site" title={name || "Meu site"}>
            Personalize e veja a prévia mudar na hora.
          </PageTitle>
          <div className="-mt-4 flex flex-wrap items-center gap-3">
            <ProjectStatusBadge status={status} />
            <span className="text-sm text-muted-foreground">{PROJECT_STATUS[status].hint}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {publicUrl ? (
            <>
              <Button asChild variant="outline">
                <a href={publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink /> Ver site
                </a>
              </Button>
              <Button variant="ghost" onClick={copyPublicUrl} aria-label="Copiar link do site">
                <Copy />
              </Button>
            </>
          ) : null}
          <Button variant="brand" onClick={handleSave} disabled={saving || !canEdit}>
            {saving ? <Loader2 className="animate-spin" /> : <Save />} Salvar
          </Button>
        </div>
      </div>

      {!canEdit ? (
        <div className="mb-6 rounded-2xl bg-lilac-soft px-5 py-4 text-sm text-secondary-foreground">
          A administradora está criando este site. Assim que ele for liberado, você poderá editar
          tudo por aqui.
        </div>
      ) : null}

      {publicUrl ? (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border bg-soft px-5 py-4 text-sm">
          <Globe className="size-4 text-lilac" />
          <span className="text-muted-foreground">Endereço do seu site:</span>
          <code className="rounded-lg bg-card px-2 py-1 text-secondary-foreground">
            {publicUrl}
          </code>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-6">
          <fieldset disabled={!canEdit} className="space-y-6">
            <Card title="Identidade" hint="O nome e o segmento do seu negócio.">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nome do site</Label>
                <Input
                  id="site-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Foto principal</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => heroInputRef.current?.click()}
                    className="relative h-20 w-32 overflow-hidden rounded-xl border bg-soft hover:border-ring"
                    aria-label="Trocar a foto principal do site"
                  >
                    {content.heroImage && galleryUrls[content.heroImage] ? (
                      <img src={galleryUrls[content.heroImage]} alt="Foto principal atual" className="h-full w-full object-cover" />
                    ) : uploading || content.heroImage ? (
                      <span className="flex h-full w-full items-center justify-center">
                        <Loader2 className="size-5 animate-spin text-lilac" />
                      </span>
                    ) : (
                      <img src={designForSegment(segment).image} alt="Foto do modelo" className="h-full w-full object-cover" />
                    )}
                  </button>
                  <div className="space-y-1 text-sm">
                    <Button type="button" variant="outline" size="sm" onClick={() => heroInputRef.current?.click()} disabled={uploading}>
                      <ImagePlus /> {content.heroImage ? "Trocar foto" : "Enviar minha foto"}
                    </Button>
                    {content.heroImage ? (
                      <button type="button" onClick={() => patch({ heroImage: "" })} className="block text-xs text-muted-foreground underline-offset-4 hover:underline">
                        Voltar para a foto do modelo
                      </button>
                    ) : (
                      <p className="text-xs text-muted-foreground">Ou clique na foto grande da prévia.</p>
                    )}
                  </div>
                </div>
                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(event) => {
                    void handleHeroUpload(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </div>
              <div className="space-y-3">
                <Label>Segmento</Label>
                <SegmentPicker
                  value={segment}
                  other={content.segmentOther}
                  onChange={handleSegmentChange}
                  onOtherChange={(value) => patch({ segmentOther: value })}
                />
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm",
                    contentIsBlank ? "bg-lilac-soft" : "bg-soft",
                  )}
                >
                  <p className="inline-flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="size-4 shrink-0 text-pink" />
                    {contentIsBlank
                      ? `Este site ainda está em branco. Use o modelo pronto de ${segmentLabel(segment, content.segmentOther)}.`
                      : `Modelo pronto de ${segmentLabel(segment, content.segmentOther)}: textos, serviços e horários de exemplo.`}
                  </p>
                  <Button
                    type="button"
                    variant={contentIsBlank ? "brand" : "outline"}
                    size="sm"
                    onClick={() => setApplyTemplateOpen(true)}
                  >
                    Usar modelo pronto
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Estilo</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SITE_STYLES.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setTemplate(style.value)}
                      aria-pressed={template === style.value}
                      className={cn(
                        "rounded-2xl border bg-card px-4 py-3 text-left text-sm transition-all hover:border-ring",
                        template === style.value &&
                          "border-transparent bg-soft shadow-candy ring-2 ring-ring",
                      )}
                    >
                      <span className="block font-medium text-plum">{style.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {style.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <AlertDialog open={applyTemplateOpen} onOpenChange={setApplyTemplateOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Aplicar o modelo de {segmentLabel(segment, content.segmentOther)}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Vamos substituir a frase de destaque, o texto "sobre", os serviços e o horário de
                    atendimento pelos exemplos deste nicho. Suas fotos e contatos continuam como estão.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={applySegmentTemplate}>
                    Aplicar modelo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Card title="Chamada principal" hint="A primeira frase que a visitante lê.">
              <div className="space-y-2">
                <Label htmlFor="tagline">Frase de destaque</Label>
                <Input
                  id="tagline"
                  value={content.tagline}
                  onChange={(event) => patch({ tagline: event.target.value })}
                  placeholder="Ex.: Bolos artesanais feitos com carinho para os seus melhores momentos."
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">Sobre o negócio</Label>
                <Textarea
                  id="about"
                  rows={6}
                  value={content.about}
                  onChange={(event) => patch({ about: event.target.value })}
                  placeholder="Conte sua história, o que você faz e o que te diferencia. Separe em parágrafos com uma linha em branco."
                  className="rounded-xl"
                />
              </div>
            </Card>

            <Card
              title="Serviços e produtos"
              hint="Mostre o que você oferece, com preço, foto e edição completa."
            >
              <div className="space-y-3">
                {content.services.map((service, index) => (
                  <div key={index} className="rounded-2xl border bg-soft p-4">
                    <div className="flex items-start gap-4">
                      <label
                        htmlFor={`service-image-${index}`}
                        className="relative flex size-16 cursor-pointer items-center justify-center rounded-xl border transition-all hover:border-ring"
                        style={{
                          borderColor: service.image ? "transparent" : "var(--border)",
                          background: service.image ? "transparent" : "var(--background)",
                          overflow: "hidden",
                        }}
                      >
                        {service.image ? (
                          <img
                            src={galleryUrls[service.image] || service.image}
                            alt={`${service.title || "Produto"} - clique para mudar`}
                            className="h-full w-full object-cover transition-all"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <ImagePlus className="size-5 text-lilac" />
                            <span className="text-xs text-muted-foreground">Foto</span>
                          </div>
                        )}
                        <input
                          id={`service-image-${index}`}
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 cursor-pointer opacity-0"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            setUploading(true);
                            try {
                              const paths = await uploadUserFiles(me!.id, "projects", [file]);
                              const urls = await signedUrls(paths);
                              setGalleryUrls((current) => ({ ...current, ...urls }));
                              const services = [...content.services];
                              services[index] = { ...service, image: paths[0] };
                              patch({ services });
                            } catch (error) {
                              toast.error("Erro ao enviar a foto.");
                            } finally {
                              setUploading(false);
                            }
                          }}
                        />
                      </label>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={service.title}
                          onChange={(event) => {
                            const services = [...content.services];
                            services[index] = { ...service, title: event.target.value };
                            patch({ services });
                          }}
                          placeholder="Nome do serviço"
                          className="rounded-xl bg-card"
                          aria-label={`Nome do serviço ${index + 1}`}
                        />
                        <Textarea
                          rows={2}
                          value={service.description}
                          onChange={(event) => {
                            const services = [...content.services];
                            services[index] = { ...service, description: event.target.value };
                            patch({ services });
                          }}
                          placeholder="Descrição curta"
                          className="rounded-xl bg-card"
                          aria-label={`Descrição do serviço ${index + 1}`}
                        />
                        <Input
                          value={service.price}
                          onChange={(event) => {
                            const services = [...content.services];
                            services[index] = { ...service, price: event.target.value };
                            patch({ services });
                          }}
                          placeholder="Preço (ex.: a partir de R$ 90)"
                          className="rounded-xl bg-card"
                          aria-label={`Preço do serviço ${index + 1}`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover serviço ${index + 1}`}
                        onClick={() =>
                          patch({
                            services: content.services.filter((_, position) => position !== index),
                          })
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    patch({
                      services: [...content.services, { title: "", description: "", price: "" }],
                    })
                  }
                >
                  <Plus /> Adicionar serviço
                </Button>
                <p className="text-xs text-muted-foreground">
                  {uploading ? "Enviando foto..." : "Clique na caixa de foto para adicionar ou mudar a imagem de cada serviço."}
                </p>
              </div>
            </Card>

            <Card title="Galeria" hint={`Até ${MAX_PHOTOS} fotos do seu trabalho.`}>
              <div className="flex flex-wrap gap-3">
                {content.gallery.map((path, index) => (
                  <div key={path} className="relative">
                    {galleryUrls[path] ? (
                      <img
                        src={galleryUrls[path]}
                        alt={`Foto ${index + 1} da galeria`}
                        className="size-24 rounded-2xl border object-cover"
                      />
                    ) : (
                      <div className="flex size-24 items-center justify-center rounded-2xl border bg-soft text-xs text-muted-foreground">
                        Foto {index + 1}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(path)}
                      aria-label={`Remover foto ${index + 1}`}
                      className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-card shadow-card"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
                {content.gallery.length < MAX_PHOTOS ? (
                  <label
                    htmlFor="gallery-input"
                    className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed bg-soft text-xs text-muted-foreground hover:border-ring"
                  >
                    {uploading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <ImagePlus className="size-5 text-lilac" />
                    )}
                    {uploading ? "Enviando" : "Adicionar"}
                  </label>
                ) : null}
                <input
                  id="gallery-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    void handleUpload(event.target.files);
                    event.target.value = "";
                  }}
                />
              </div>
            </Card>

            <Card title="Contato" hint="Aparece no fim do site, com botões prontos.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={content.whatsapp}
                    onChange={(event) => patch({ whatsapp: event.target.value })}
                    placeholder="(11) 90000-0000"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={content.instagram}
                    onChange={(event) => patch({ instagram: event.target.value })}
                    placeholder="@seunegocio"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={content.email}
                    onChange={(event) => patch({ email: event.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Horário de atendimento</Label>
                  <Input
                    id="hours"
                    value={content.hours}
                    onChange={(event) => patch({ hours: event.target.value })}
                    placeholder="Seg a sex, 9h às 18h"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={content.address}
                    onChange={(event) => patch({ address: event.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </Card>
          </fieldset>

          {isAdmin ? (
            <Card title="Publicação" hint="Ações da administração.">
              <div className="flex flex-wrap gap-2">
                <Button variant="brand" onClick={handlePublish} disabled={publishing}>
                  {publishing ? <Loader2 className="animate-spin" /> : <Rocket />} Publicar
                </Button>
                {status === "publicado" ? (
                  <Button variant="outline" onClick={handleUnpublish} disabled={publishing}>
                    <Undo2 /> Despublicar
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link to="/admin/projetos">
                    <Globe /> Ver todos os projetos
                  </Link>
                </Button>
              </div>
            </Card>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24">
          <SitePreviewCard>
            <div onClickCapture={(event) => event.preventDefault()}>
              <SiteRenderer
                name={name}
                segment={segment}
                template={template}
                content={preview}
                urls={galleryUrls}
                preview
                onEditHeroImage={canEdit ? () => heroInputRef.current?.click() : undefined}
              />
            </div>
          </SitePreviewCard>
          <div className="mt-4 flex flex-wrap gap-2">
            {status === "publicado" ? (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleUnpublish}
                disabled={publishing}
              >
                <Undo2 /> Despublicar
              </Button>
            ) : (
              <Button
                variant="brand"
                className="flex-1"
                onClick={handlePublish}
                disabled={publishing || !canEdit}
              >
                {publishing ? <Loader2 className="animate-spin" /> : <Rocket />}
                {slug ? "Republicar site" : "Publicar meu site"}
              </Button>
            )}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            A prévia muda enquanto você digita.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
