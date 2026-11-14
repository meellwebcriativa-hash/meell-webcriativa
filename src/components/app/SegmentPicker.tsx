import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEGMENTS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import salaoImg from "@/assets/templates/salao.jpg";
import manicureImg from "@/assets/templates/manicure.jpg";
import lojaImg from "@/assets/templates/loja.jpg";
import papelariaImg from "@/assets/templates/papelaria.jpg";
import confeitariaImg from "@/assets/templates/confeitaria.jpg";
import restauranteImg from "@/assets/templates/restaurante.jpg";
import barbeariaImg from "@/assets/templates/barbearia.jpg";
import fotografiaImg from "@/assets/templates/fotografia.jpg";
import servicosImg from "@/assets/templates/servicos.jpg";
import outroImg from "@/assets/templates/outro.jpg";

const SEGMENT_IMAGES: Record<string, string> = {
  salao: salaoImg,
  manicure: manicureImg,
  loja: lojaImg,
  papelaria: papelariaImg,
  confeitaria: confeitariaImg,
  restaurante: restauranteImg,
  barbearia: barbeariaImg,
  fotografia: fotografiaImg,
  servicos: servicosImg,
  outro: outroImg,
};

const SEGMENT_DESCRIPTIONS: Record<string, string> = {
  salao: "Corte, coloração, tratamentos e estética",
  manicure: "Unhas, alongamento e spa dos pés",
  loja: "Produtos, kits e novidades da semana",
  papelaria: "Convites, planners e lembrancinhas",
  confeitaria: "Bolos, doces e pratos especiais",
  restaurante: "Cardápio, pratos e delivery",
  barbearia: "Corte, barba e combos masculinos",
  fotografia: "Ensaios, casamentos e fotos de produto",
  servicos: "Consultoria e soluções sob medida",
  outro: "Seu negócio único e especial",
};

export function SegmentPicker({
  value,
  other,
  onChange,
  onOtherChange,
}: {
  value: string;
  other: string;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
}) {
  const selected = SEGMENTS.find((item) => item.value === value);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SEGMENTS.map((s) => {
          const isSelected = value === s.value;
          const img = SEGMENT_IMAGES[s.value];

          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange(s.value)}
              aria-pressed={isSelected}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border bg-card p-2 pb-3 text-sm font-medium text-secondary-foreground transition-all hover:border-ring active:scale-[0.98] group",
                isSelected && "border-transparent bg-soft shadow-xl shadow-brand/20 ring-2 ring-ring",
              )}
            >
              <div
                className={cn(
                  "aspect-[16/10] w-full overflow-hidden rounded-lg transition-all",
                  isSelected ? "bg-brand text-primary-foreground" : "bg-secondary text-secondary-foreground",
                )}
              >
                <img
                  src={img}
                  alt={`Modelo de ${s.label}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-center leading-tight max-w-full">
                <span className="block font-semibold">{s.label}</span>
                <span className="text-xs opacity-70 block mt-0.5 truncate max-w-full">
                  {SEGMENT_DESCRIPTIONS[s.value] || ""}
                </span>
              </span>
              {isSelected ? (
                <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-md">
                  <Check className="size-3" aria-hidden />
                </span>
              ) : (
                <div className="absolute inset-0 rounded-2xl border-2 border-dashed opacity-0 group-hover:opacity-20 group-hover:border-ring" />
              )}
            </button>
          );
        })}
      </div>
      {value === "outro" ? (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              placeholder="Conte qual é o seu tipo de negócio"
              value={other}
              onChange={(e) => onOtherChange(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        </div>
      ) : null}
      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {selected
          ? `${selected.label} selecionado. Um modelo pronto já estará carregado.`
          : "Escolha o seu segmento para carregar um modelo pronto."}
      </p>
    </div>
  );
}