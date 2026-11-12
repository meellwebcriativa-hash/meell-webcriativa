import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEGMENTS } from "@/lib/constants";
import { Input } from "@/components/ui/input";

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
                "relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border bg-card px-3 py-4 text-sm font-medium text-secondary-foreground transition-all hover:border-ring active:scale-[0.98]",
                isSelected && "border-transparent bg-soft shadow-candy ring-2 ring-ring",
              )}
            >
              {isSelected ? (
                <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-brand text-primary-foreground">
                  <Check className="size-3" aria-hidden />
                </span>
              ) : null}
              <span className="text-2xl" aria-hidden>
                {s.emoji}
              </span>
              <span className="text-center leading-tight">{s.label}</span>
            </button>
          );
        })}
      </div>
      {value === "outro" ? (
        <div className="mt-4">
          <Input
            autoFocus
            placeholder="Conte qual é o seu tipo de negócio"
            value={other}
            onChange={(e) => onOtherChange(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      ) : null}
      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {selected
          ? `${selected.label} selecionado.`
          : "Escolha o seu segmento para carregar um modelo pronto."}
      </p>
    </div>
  );
}
