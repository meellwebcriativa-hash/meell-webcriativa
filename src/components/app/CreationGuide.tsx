import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STEPS = [
  { step: 1, title: "Nome do negócio", description: "Como seu site aparecerá no início e na navegação" },
  { step: 2, title: "Escolha o segmento", description: "Esse modelo já vem com textos e preços prontos" },
  { step: 3, title: "Escolha o estilo", description: "Afeta cores, tipografia e o visual geral" },
  { step: 4, title: "Personalize depois", description: "Pode editar tudo depois no editor do site" },
];

export function CreationGuide({ currentStep }: { currentStep: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <HelpCircle className="size-4" />
            <span className="hidden sm:inline">Guia</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Como criar seu site</h4>
            {STEPS.map((s) => (
              <div key={s.step} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                    currentStep === s.step ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {s.step}
                </div>
                <div>
                  <p className="text-xs font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground max-w-[180px]">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}