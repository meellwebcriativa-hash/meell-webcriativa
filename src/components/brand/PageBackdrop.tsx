import { cn } from "@/lib/utils";

export function PageBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-page" />

      <div className="animate-drift-slow absolute -top-48 -left-32 size-[36rem] rounded-full bg-lilac/25 blur-3xl" />
      <div className="animate-drift-slower absolute -top-40 -right-28 size-[32rem] rounded-full bg-pink/25 blur-3xl" />
      <div className="animate-drift-slower absolute bottom-[-12rem] left-1/3 size-[30rem] rounded-full bg-lilac-soft/60 blur-3xl" />

      <div className="bg-dots absolute inset-0 opacity-80" />

      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="stroke-lilac" strokeWidth="1.4">
          <circle cx="1290" cy="130" r="110" opacity="0.5" />
          <circle cx="1290" cy="130" r="190" opacity="0.32" />
          <circle cx="1290" cy="130" r="270" opacity="0.2" strokeDasharray="10 12" />
        </g>

        <g className="stroke-pink" strokeWidth="1.3">
          <circle cx="30" cy="880" r="140" opacity="0.38" />
          <circle cx="30" cy="880" r="220" opacity="0.24" strokeDasharray="8 10" />
          <circle cx="30" cy="880" r="300" opacity="0.14" />
        </g>

        <g className="stroke-lilac animate-pulse" strokeWidth="1.1" opacity="0.35" strokeDasharray="7 10">
          <path d="M-40 640C180 560 320 720 540 660S900 540 1140 640 1400 600 1480 660" />
          <path d="M-40 740C200 680 340 810 590 750S980 660 1220 740 1440 700 1480 730" />
        </g>

        <g className="stroke-pink animate-pulse" strokeWidth="1.2" opacity="0.32">
          <path d="M900 790 1010 726 1124 792 1236 742" />
          <path d="M1010 726 982 842 1124 792" />
          <path d="M1124 792 1180 862" />
        </g>
        <g className="fill-lilac animate-pulse" opacity="0.55">
          <circle cx="900" cy="790" r="3.5" />
          <circle cx="1010" cy="726" r="4" />
          <circle cx="1124" cy="792" r="3.5" />
          <circle cx="982" cy="842" r="3" />
        </g>
        <g className="fill-pink animate-pulse" opacity="0.5">
          <circle cx="1236" cy="742" r="3.5" />
          <circle cx="1180" cy="862" r="3" />
        </g>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
          }
          .animate-pulse-custom {
            animation: pulse 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}