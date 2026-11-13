import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEGMENTS } from "@/lib/constants";
import { Input } from "@/components/ui/input";

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
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange(s.value)}
              aria-pressed={isSelected}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border bg-card px-3 py-4 text-sm font-medium text-secondary-foreground transition-all hover:border-ring active:scale-[0.98] group",
                isSelected && "border-transparent bg-soft shadow-xl shadow-brand/20 ring-2 ring-ring",
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-all",
                  isSelected ? "bg-brand text-primary-foreground" : "bg-secondary text-secondary-foreground",
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {s.emoji}
                </span>
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
            <Sparkles className="size-4 text-pink flex-shrink-0" />
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