import { useMemo } from "react";
import { ExternalLink, Heart, Scissors, Camera, Briefcase, ShoppingCart, FileText, Coffee, Utensils, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_DESIGNS } from "@/lib/site-designs";

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
    backgroundStyle: "bg-gradient-to-br from-pink-50 via-white to-rose-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-pink-200",
  },
  manicure: {
    icon: Heart,
    label: "Manicure",
    description: "Unhas artísticas e texturas suaves de gel",
    category: "Beleza",
    backgroundStyle: "bg-gradient-to-br from-rose-50 via-white to-pink-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-rose-200",
  },
  loja: {
    icon: ShoppingCart,
    label: "Loja",
    description: "Vitrine virtual com produtos em destaque",
    category: "Varejo",
    backgroundStyle: "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-blue-200",
  },
  papelaria: {
    icon: FileText,
    label: "Papelaria",
    description: "Convites e planners com detalhes personalizados",
    category: "Artesanato",
    backgroundStyle: "bg-gradient-to-br from-lilac-50 via-white to-pink-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-lilac-200",
  },
  confeitaria: {
    icon: Coffee,
    label: "Confeitaria",
    description: "Detalhes de bolos e doces em close",
    category: "Comida",
    backgroundStyle: "bg-gradient-to-br from-amber-50 via-white to-orange-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-amber-200",
  },
  restaurante: {
    icon: Utensils,
    label: "Restaurante",
    description: "Pratos coloridos e ambiente do restaurante",
    category: "Gastronomia",
    backgroundStyle: "bg-gradient-to-br from-green-50 via-white to-emerald-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-green-200",
  },
  barbearia: {
    icon: Scissors,
    label: "Barbearia",
    description: "Corte clássico e detalhes do atendimento",
    category: "Homens",
    backgroundStyle: "bg-gradient-to-br from-gray-50 via-white to-slate-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-gray-200",
  },
  fotografia: {
    icon: Camera,
    label: "Fotografia",
    description: "Cenas cinematográficas de ensaio",
    category: "Criativo",
    backgroundStyle: "bg-gradient-to-br from-black/5 via-white to-gray-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-gray-300",
  },
  servicos: {
    icon: Briefcase,
    label: "Serviços",
    description: "Soluções profissionais para o seu negócio",
    category: "Negócio",
    backgroundStyle: "bg-gradient-to-br from-teal-50 via-white to-cyan-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-teal-200",
  },
  outro: {
    icon: Sparkles,
    label: "Seu negócio",
    description: "Modelo neutro e elegante sob medida",
    category: "Personalizado",
    backgroundStyle: "bg-gradient-to-br from-grey-50 via-white to-slate-50",
    headerStyle: "bg-white/80 backdrop-blur-sm border-slate-200",
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

const FALLBACK_INFO: SegmentInfo = {
  icon: Sparkles,
  label: "Seu negócio",
  description: "Modelo neutro e elegante sob medida",
  category: "Personalizado",
};

export function SegmentPreview({ segment, segmentOther, style, className }: SegmentPreviewProps) {
  const info = SEGMENT_PREVIEWS[segment] ?? FALLBACK_INFO;
  const Icon = info.icon;
  const displayLabel = segment === "outro" && segmentOther ? segmentOther : info.label;

  const previewStyle = STYLE_GRADIENTS[style] ?? "bg-gradient-to-br from-slate-50 via-white to-slate-50";
  const segmentGradient = SEGMENT_GRADIENTS[segment] ?? "from-pink/30 via-lilac/25 to-pink/15";
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
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${SITE_DESIGNS[segment as keyof typeof SITE_DESIGNS]?.image || SITE_DESIGNS.outro.image}")`,
          filter: "brightness(0.9) contrast(1.05)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="relative p-6">
        <div
          className={cn("flex items-center gap-3 mb-4 transition-transform duration-300 group-hover:-translate-y-1")}
          style={{
            animationDelay: "100ms",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: info.category === "Estética" ? "#ec4899" : 
                          info.category === "Beleza" ? "#ec4899" :
                          info.category === "Varejo" ? "#3b82f6" :
                          info.category === "Artesanato" ? "#a855f7" :
                          info.category === "Comida" ? "#f59e0b" :
                          info.category === "Gastronomia" ? "#10b981" :
                          info.category === "Homens" ? "#6b7280" :
                          info.category === "Criativo" ? "#6b7280" :
                          info.category === "Negócio" ? "#20c997" :
                          "#94a3b8",
          }}
        >
          <div
            className={cn("flex size-10 items-center justify-center rounded-2xl", "bg-white/20")}
            style={{ backdropFilter: "blur(10px)" }}
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