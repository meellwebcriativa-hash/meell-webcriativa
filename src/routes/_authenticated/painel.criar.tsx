import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { SegmentPicker } from "@/components/app/SegmentPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SITE_STYLES } from "@/lib/constants";
import { meQuery } from "@/lib/queries";
import { firstError, projectStartSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/painel/criar")({
  head: () => ({
    meta: [
      { title: "Criar meu site — Web Criativa" },
      { name: "description", content: "Comece seu site escolhendo o segmento e o estilo do seu negócio." },
      { property: "og:title", content: "Criar meu site — Web Criativa" },
      { property: "og:description", content: "Comece seu site escolhendo o segmento e o estilo do seu negócio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(meQuery),
  component: CreateSite,
});

const styleSwatches: Record<string, string> = {
  elegante: "bg-plum",
  moderno: "bg-brand",
  delicado: "bg-pink-soft",
  minimalista: "bg-muted",
};

function CreateSite() {
  const { data: me } = useSuspenseQuery(meQuery);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(me?.businessName ?? "");
  const [segment, setSegment] = useState("");
  const [segmentOther, setSegmentOther] = useState("");
  const [style, setStyle] = useState("");
  const [saving, setSaving] = useState(false);

  function nextFromStep1() {
    const parsed = projectStartSchema.safeParse({ name, segment, segmentOther, style: "elegante" });
    if (!parsed.success) {
      toast.error(firstError(parsed.error));
      return;
    }
    setStep(2);
  }

  async function save() {
    const parsed = projectStartSchema.safeParse({ name, segment, segmentOther, style });
    if (!parsed.success) {
      toast.error(firstError(parsed.error));
      return;
    }
    if (!me) return;
    setSaving(true);
    const { error } = await supabase.from("projects").insert({
      owner_id: me.id,
      created_by: me.id,
      name: parsed.data.name,
      segment: parsed.data.segment,
      template: parsed.data.style,
      status: "rascunho",
      content: { segmentOther: parsed.data.segmentOther },
    });
    setSaving(false);
    if (error) {
      toast.error("Não foi possível salvar agora. Tente de novo.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
    toast.success("Projeto salvo! A personalização com prévia ao vivo chega na próxima etapa da plataforma.");
    navigate({ to: "/painel" });
  }

  return (
    <AppShell>
      <Link to="/painel" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar ao painel
      </Link>
      <PageTitle eyebrow={`Etapa ${step} de 2`} title={step === 1 ? "Sobre o seu negócio" : "Escolha o estilo"}>
        {step === 1 ? "Comece pelo nome e pelo tipo do seu negócio." : "Qual jeito combina mais com a sua marca?"}
      </PageTitle>

      <div className="mb-8 flex gap-2" aria-hidden>
        {[1, 2].map((n) => (
          <div key={n} className={cn("h-1.5 flex-1 rounded-full bg-muted", n <= step && "bg-brand")} />
        ))}
      </div>

      <div className="rounded-[2rem] border bg-card p-6 shadow-card sm:p-8">
        {step === 1 ? (
          <div className="space-y-8">
            <div className="max-w-md space-y-2">
              <Label htmlFor="site-name">Nome do seu negócio</Label>
              <Input id="site-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ateliê da Ana" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label>Segmento</Label>
              <SegmentPicker value={segment} other={segmentOther} onChange={setSegment} onOtherChange={setSegmentOther} />
            </div>
            <div className="flex justify-end">
              <Button variant="brand" size="lg" onClick={nextFromStep1}>
                Continuar <ArrowRight />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {SITE_STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStyle(s.value)}
                  aria-pressed={style === s.value}
                  className={cn(
                    "relative flex items-start gap-4 rounded-3xl border bg-card p-5 text-left transition-all hover:border-ring",
                    style === s.value && "border-transparent bg-soft shadow-candy ring-2 ring-ring",
                  )}
                >
                  <span className={cn("size-14 shrink-0 rounded-2xl border", styleSwatches[s.value])} aria-hidden />
                  <span>
                    <span className="block font-display text-lg text-plum">{s.label}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{s.description}</span>
                  </span>
                  {style === s.value ? (
                    <span className="absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-brand text-primary-foreground">
                      <Check className="size-3.5" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-between gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                <ArrowLeft /> Voltar
              </Button>
              <Button variant="brand" size="lg" onClick={save} disabled={saving || !style}>
                {saving ? <Loader2 className="animate-spin" /> : <Check />} Salvar meu projeto
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
