import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-10 rounded-[23%] shadow-candy", className)}
      aria-hidden
      fill="none"
    >
      <defs>
        <linearGradient id="wc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8a2be2" />
          <stop offset="50%" stop-color="#ff69b4" />
          <stop offset="100%" stop-color="#9b59b6" />
        </linearGradient>
      </defs>
      <text x="50" y="65" font-family="Fraunces,ui-serif,Georgia,serif" font-weight="700" font-size="64" text-anchor="middle" fill="url(#wc-gradient)" letter-spacing="-0.04em">WC</text>
    </svg>
  );
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
