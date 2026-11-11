import type { ReactNode } from "react";

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed bg-soft px-6 py-10 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-card">{icon}</div>
      <p className="font-display text-lg text-plum">{title}</p>
      {children ? <div className="mt-1 max-w-sm text-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}
