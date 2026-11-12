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
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SEGMENTS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            aria-pressed={value === s.value}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border bg-card px-3 py-4 text-sm font-medium text-secondary-foreground transition-all hover:border-ring",
              value === s.value && "border-transparent bg-soft shadow-candy ring-2 ring-ring",
            )}
          >
            <span className="text-2xl" aria-hidden>{s.emoji}</span>
            <span className="text-center leading-tight">{s.label}</span>
          </button>
        ))}
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
    </div>
  );
}
