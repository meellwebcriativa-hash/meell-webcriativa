import { useMemo } from "react";
import { ExternalLink, Heart, Scissors, Camera, Briefcase, ShoppingCart, FileText, Coffee, Utensils, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SegmentPreviewProps = {
  segment: string;
  segmentOther?: string;
  style: string;
  className?: string;
};

type SegmentInfo = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  category: string;
};

const SEGMENT_PREVIEWS: Record<string, SegmentInfo> = {
  salao: {
    icon: Scissors,
    label: "Salão de Beleza",
    description: "Fotos de ambientes, cortes e colorações",
    category: "Estética",
  },
  manicure: {
    icon: Heart,
    label: "Manicure",
    description: "Unhas artísticas e texturas suaves de gel",
    category: "Beleza",
  },
  loja: {
    icon: ShoppingCart,
    label: "Loja",
    description: "Vitrine virtual com produtos em destaque",
    category: "Varejo",
  },
  papelaria: {
    icon: FileText,
    label: "Papelaria",
    description: "Convites e planners com detalhes personalizados",
    category: "Artesanato",
  },
  confeitaria: {
    icon: Coffee,
    label: "Confeitaria",
    description: "Detalhes de bolos e doces em close",
    category: "Comida",
  },
  restaurante: {
    icon: Utensils,
    label: "Restaurante",
    description: "Pratos coloridos e ambiente do restaurante",
    category: "Gastronomia",
  },
  barbearia: {
    icon: Scissors,
    label: "Barbearia",
    description: "Corte clássico e detalhes do atendimento",
    category: "Homens",
  },
  fotografia: {
    icon: Camera,
    label: "Fotografia",
    description: "Cenas cinematográficas de ensaio",
    category: "Criativo",
  },
  servicos: {
    icon: Briefcase,
    label: "Serviços",
    description: "Soluções profissionais para o seu negócio",
    category: "Negócio",
  },
  outro: {
    icon: Sparkles,
    label: "Seu negócio",
    description: "Modelo neutro e elegante sob medida",
    category: "Personalizado",
  },
};

const STYLE_GRADIENTS: Record<string, string> = {
  elegante: "bg-gradient-to-br from-slate-50 via-white to-slate-50",
  moderno: "bg-gradient-to-br from-slate-900 via-slate-900 to-black",
  delicado: "bg-gradient-to-br from-pink-50 via-white to-pink-50",
  minimalista: "bg-gradient-to-br from-white via-gray-50 to-white",
};

const SEGMENT_GRADIENTS: Record<string, string> = {
  salao: "from-pink/30 via-pink/20 to-pink/10",
  manicure: "from-lilac/30 via-pink/25 to-pink/10",
  loja: "from-brand/30 via-lilac/25 to-pink/15",
  papelaria: "from-pink/30 via-lilac/25 to-pink/15",
  confeitaria: "from-pink/40 via-pink/25 to-pink/15",
  restaurante: "from-lilac/30 via-pink/25 to-pink/15",
  barbearia: "from-brand/30 via-lilac/25 to-pink/15",
  fotografia: "from-pink/30 via-pink/20 to-lilac/15",
  servicos: "from-lilac/30 via-brand/25 to-pink/15",
  outro: "from-pink/30 via-lilac/25 to-pink/15",
};

export function SegmentPreview({ segment, segmentOther, style, className }: SegmentPreviewProps) {
  const info = SEGMENT_PREVIEWS[segment] ?? SEGMENT_PREVIEWS.outro;
  const Icon = info.icon;
  const displayLabel = segment === "outro" && segmentOther ? segmentOther : info.label;

  const previewStyle = STYLE_GRADIENTS[style] ?? STYLE_GRADIENTS.elegante;
  const segmentGradient = SEGMENT_GRADIENTS[segment] ?? SEGMENT_GRADIENTS.outro;
  const textStyle = style === "moderno" ? "text-white" : "text-slate-700";

  const skeletonElements = useMemo(() => {
    const count = 4;
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="relative h-32 rounded-2xl overflow-hidden"
        style={{ animationDelay: `${i * 200}ms` }}
      >
        <div
          className={cn("absolute inset-0 animate-pulse", segmentGradient, "bg-clip-padding")}
          style={{ animationDuration: "2s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/10" />
      </div>
    ));
  }, [segmentGradient]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        previewStyle,
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23ffffff'/%3E%3C/svg%3E")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="relative p-6">
        <div
          className="flex items-center gap-3 mb-4 transition-transform duration-300 group-hover:-translate-y-1"
          style={{ animationDelay: "100ms" }}
        >
          <div
            className={cn("flex size-10 items-center justify-center rounded-2xl", "bg-white/20 backdrop-blur-sm")}
          >
            <Icon className={cn("size-5", textStyle)} />
          </div>
          <h3 className={cn("font-display text-xl font-semibold", textStyle)}>{displayLabel}</h3>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider opacity-60">{info.category}</span>
          <div className="h-1 w-8 bg-border/30 rounded-full" />
        </div>

        <p
          className={cn("text-sm mb-4", style === "moderno" ? "text-white/70" : "text-black/70 dark:text-white/70")}
        >
          {info.description}
        </p>

        <div className="space-y-3">{skeletonElements}</div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider opacity-80">
            Estilo:{" "}
            {style === "moderno"
              ? "Moderno"
              : style === "delicado"
              ? "Delicado"
              : style === "minimalista"
              ? "Minimalista"
              : "Elegante"}
          </span>
          <ExternalLink className={cn("size-4 opacity-50 group-hover:opacity-100 transition-opacity")} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{ animation: "spin 30s linear infinite" }}
      >
        <div className="w-full h-full border rounded-full" />
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}