import { cn } from "@/lib/utils";
import icon from "@/assets/logo-wc-icone.png.asset.json";

export function LogoIcon({ className }: { className?: string }) {
  return <img src={icon.url} alt="" aria-hidden className={cn("size-10 rounded-[23%] shadow-candy", className)} />;
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoIcon />
      <span className={cn("flex flex-col leading-none", compact && "max-sm:hidden")}>
        <span className="font-display text-xl font-semibold text-plum">Web Criativa</span>
        <span className="mt-1 text-[11px] tracking-[0.18em] text-lilac uppercase">by Meell Criativa</span>
      </span>
    </span>
  );
}
