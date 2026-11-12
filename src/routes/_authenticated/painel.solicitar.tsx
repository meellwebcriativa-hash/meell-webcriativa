import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { SegmentPicker } from "@/components/app/SegmentPicker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SITE_PAGES, SITE_STYLES } from "@/lib/constants";
import { meQuery } from "@/lib/queries";
import { firstError, siteRequestSchema } from "@/lib/schemas";
import { MAX_PHOTOS, uploadUserFiles } from "@/lib/uploads";

export const Route = createFileRoute("/_authenticated/painel/solicitar")({
  head: () => ({
    meta: [
      { title: "Pedir site personalizado — Web Criativa" },
      { name: "description", content: "Conte sobre o seu negócio e a Meell Criativa cria o seu site sob medida." },
      { property: "og:title", content: "Pedir site personalizado — Web Criativa" },
      { property: "og:description", content: "Conte sobre o seu negócio e a Meell Criativa cria o seu site sob medida." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(meQuery),
  component: RequestSite,
});

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card sm:p-8">
      <h2 className="text-xl font-semibold text-plum">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function RequestSite() {
  const { data: me } = useSuspenseQuery(meQuery);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    businessName: me?.businessName ?? "",
    segment: "",
    segmentOther: "",
    description: "",
    colors: "",
    style: "",
    pages: ["Início", "Sobre nós", "Serviços", "Contato", "WhatsApp"] as string[],
    contactWhatsapp: me?.phone ?? "",
    contactInstagram: "",
    contactEmail: me?.email ?? "",
    contactAddress: "",
    referencesText: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  function togglePage(page: string) {
    set("pages", form.pages.includes(page) ? form.pages.filter((p) => p !== page) : [...form.pages, page]);
  }

  function addPhotos(list: FileList | null) {
    if (!list) return;
    const next = [...photos, ...Array.from(list)].slice(0, MAX_PHOTOS);
    if (photos.length + list.length > MAX_PHOTOS) toast.info(`Você pode enviar até ${MAX_PHOTOS} fotos.`);
    setPhotos(next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = siteRequestSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(firstError(parsed.error));
      return;
    }
    if (!me) return;
    setSending(true);
    try {
      const folder = `requests/${crypto.randomUUID()}`;
      const [logoPath] = logo ? await uploadUserFiles(me.id, folder, [logo]) : [null];
      const photoPaths = await uploadUserFiles(me.id, folder, photos);
      const d = parsed.data;
      const { error } = await supabase.from("site_requests").insert({
        client_id: me.id,
        business_name: d.businessName,
        segment: d.segment === "outro" ? `outro:${d.segmentOther}` : d.segment,
        description: d.description,
        colors: d.colors,
        style: d.style,
        pages: d.pages,
        contact_whatsapp: d.contactWhatsapp,
        contact_instagram: d.contactInstagram,
        contact_email: d.contactEmail,
        contact_address: d.contactAddress,
        references_text: d.referencesText,
        logo_path: logoPath,
        photo_paths: photoPaths,
      });
      if (error) throw new Error("Não foi possível enviar seu pedido agora.");
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Pedido enviado! A Meell Criativa já recebeu e vai começar a criar seu site.");
      navigate({ to: "/painel" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo não deu certo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell>
      <Link to="/painel" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar ao painel
      </Link>
      <PageTitle eyebrow="Site personalizado" title="Conte sobre o seu negócio">
        Quanto mais detalhes, mais a cara da sua marca o site vai ficar.
      </PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Seu negócio">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nome do negócio</Label>
            <Input id="businessName" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-3">
            <Label>Segmento</Label>
            <SegmentPicker value={form.segment} other={form.segmentOther} onChange={(v) => set("segment", v)} onOtherChange={(v) => set("segmentOther", v)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição do negócio</Label>
            <Textarea id="description" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="O que você faz, para quem, o que te diferencia..." className="rounded-xl" />
          </div>
        </Section>

        <Section title="Visual" hint="Pode deixar em branco o que ainda não souber.">
          <div className="space-y-2">
            <Label htmlFor="colors">Cores desejadas</Label>
            <Input id="colors" value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Ex.: rosa claro, dourado e branco" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-3">
            <Label>Estilo preferido</Label>
            <div className="flex flex-wrap gap-2">
              {SITE_STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("style", form.style === s.value ? "" : s.value)}
                  aria-pressed={form.style === s.value}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:border-ring",
                    form.style === s.value && "border-transparent bg-brand text-primary-foreground shadow-candy",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label>Páginas desejadas</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {SITE_PAGES.map((page) => (
                <label key={page} className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm hover:border-ring">
                  <Checkbox checked={form.pages.includes(page)} onCheckedChange={() => togglePage(page)} />
                  {page}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Contato" hint="Informe pelo menos um: WhatsApp, Instagram ou e-mail.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wa">WhatsApp</Label>
              <Input id="wa" value={form.contactWhatsapp} onChange={(e) => set("contactWhatsapp", e.target.value)} placeholder="(11) 90000-0000" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig">Instagram</Label>
              <Input id="ig" value={form.contactInstagram} onChange={(e) => set("contactInstagram", e.target.value)} placeholder="@seunegocio" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="em">E-mail</Label>
              <Input id="em" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr">Endereço</Label>
              <Input id="addr" value={form.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} className="h-11 rounded-xl" />
            </div>
          </div>
        </Section>

        <Section title="Logotipo, fotos e referências">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logo">Logotipo</Label>
              <label htmlFor="logo" className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed bg-soft px-4 py-5 text-sm text-secondary-foreground hover:border-ring">
                <ImagePlus className="size-5 text-lilac" />
                {logo ? logo.name : "Escolher arquivo do logotipo"}
              </label>
              <input id="logo" type="file" accept="image/*,.pdf,.svg" className="sr-only" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photos">Fotografias (até {MAX_PHOTOS})</Label>
              <label htmlFor="photos" className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed bg-soft px-4 py-5 text-sm text-secondary-foreground hover:border-ring">
                <ImagePlus className="size-5 text-lilac" />
                Adicionar fotos
              </label>
              <input id="photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
            </div>
          </div>
          {photos.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <span key={`${p.name}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  {p.name}
                  <button type="button" aria-label={`Remover ${p.name}`} onClick={() => setPhotos(photos.filter((_, j) => j !== i))}>
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="refs">Referências visuais (opcional)</Label>
            <Textarea id="refs" rows={3} value={form.referencesText} onChange={(e) => set("referencesText", e.target.value)} placeholder="Links de sites ou perfis que você admira" className="rounded-xl" />
          </div>
        </Section>

        <div className="flex justify-end">
          <Button type="submit" variant="brand" size="lg" disabled={sending}>
            {sending ? <Loader2 className="animate-spin" /> : <Send />} Enviar meu pedido
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
