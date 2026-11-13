import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
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

type SegmentPreviewProps = {
  segment: string;
  segmentOther?: string;
  style: string;
  className?: string;
};

type SegmentInfo = {
  label: string;
  description: string;
  category: string;
  image: string;
};

const SEGMENT_PREVIEWS: Record<string, SegmentInfo> = {
  salao: {
    label: "Salão de Beleza",
    description: "Fotos de ambientes, cortes e colorações",
    category: "Estética",
    image: salaoImg,
  },
  manicure: {
    label: "Manicure",
    description: "Unhas artísticas e texturas suaves de gel",
    category: "Beleza",
    image: manicureImg,
  },
  loja: {
    label: "Loja",
    description: "Vitrine virtual com produtos em destaque",
    category: "Varejo",
    image: lojaImg,
  },
  papelaria: {
    label: "Papelaria",
    description: "Convites e planners com detalhes personalizados",
    category: "Artesanato",
    image: papelariaImg,
  },
  confeitaria: {
    label: "Confeitaria",
    description: "Detalhes de bolos e doces em close",
    category: "Comida",
    image: confeitariaImg,
  },
  restaurante: {
    label: "Restaurante",
    description: "Pratos coloridos e ambiente do restaurante",
    category: "Gastronomia",
    image: restauranteImg,
  },
  barbearia: {
    label: "Barbearia",
    description: "Corte clássico e detalhes do atendimento",
    category: "Homens",
    image: barbeariaImg,
  },
  fotografia: {
    label: "Fotografia",
    description: "Cenas cinematográficas de ensaio",
    category: "Criativo",
    image: fotografiaImg,
  },
  servicos: {
    label: "Serviços",
    description: "Soluções profissionais para o seu negócio",
    category: "Negócio",
    image: servicosImg,
  },
  outro: {
    label: "Seu negócio",
    description: "Modelo neutro e elegante sob medida",
    category: "Personalizado",
    image: outroImg,
  },
};

const STYLE_GRADIENTS: Record<string, string> = {
  elegante: "bg-gradient-to-br from-slate-50 via-white to-slate-50",
  moderno: "bg-gradient-to-br from-slate-900 via-slate-900 to-black",
  delicado: "bg-gradient-to-br from-pink-50 via-white to-pink-50",
  minimalista: "bg-gradient-to-br from-white via-gray-50 to-white",
};

const FALLBACK_INFO: SegmentInfo = {
  label: "Seu negócio",
  description: "Modelo neutro e elegante sob medida",
  category: "Personalizado",
  image: outroImg,
};

export function SegmentPreview({ segment, segmentOther, style, className }: SegmentPreviewProps) {
  const info = SEGMENT_PREVIEWS[segment] ?? FALLBACK_INFO;
  const displayLabel = segment === "outro" && segmentOther ? segmentOther : info.label;

  const previewStyle = STYLE_GRADIENTS[style] ?? "bg-gradient-to-br from-slate-50 via-white to-pink-15";
  const textStyle = style === "moderno" ? "text-white" : "text-slate-700";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        previewStyle,
        className,
      )}
    >
      <div className="absolute inset-0">
        <img
          src={info.image}
          alt={`Preview de ${displayLabel}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-l opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="relative p-6">
        <div
          className={cn("flex items-center gap-3 mb-4 transition-transform duration-300 group-hover:-translate-y-1")}
          style={{
            animationDelay: "100ms",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: `rgba(255, 255, 255, 0.6)`,
          }}
        >
          <div
            className={cn("flex size-10 items-center justify-center rounded-2xl")}
            style={{ backdropFilter: "blur(5px)", background: "rgba(255, 255, 255, 0.4)" }}
          >
            <img
              src={info.image}
              alt={displayLabel}
              className="w-5 h-5 object-cover rounded"
            />
          </div>
          <h3 className={cn("font-display text-xl font-semibold", textStyle)}>{displayLabel}</h3>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider opacity-70">{info.category}</span>
          <div className="h-1 w-8 bg-border/30 rounded-full" />
        </div>

        <p
          className={cn("text-sm mb-4", style === "moderno" ? "text-white/70" : "text-white/80")}
        >
          {info.description}
        </p>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 rounded bg-white/30" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>

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