import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { meQuery } from "@/lib/queries";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLink =
  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground";
const navActive = "bg-secondary text-secondary-foreground";

export function AppShell({ children }: { children: ReactNode }) {
  const { data: me } = useQuery(meQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/painel" aria-label="Web Criativa — meu painel">
            <Logo compact />
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/painel" className={navLink} activeProps={{ className: navActive }}>
              <LayoutDashboard className="size-4" />
              <span className="max-md:hidden">Meu painel</span>
            </Link>
            {me?.isAdmin ? (
              <Link to="/admin" className={navLink} activeProps={{ className: navActive }}>
                <ShieldCheck className="size-4" />
                <span className="max-md:hidden">Administração</span>
              </Link>
            ) : null}
            <Link to="/conta" className={navLink} activeProps={{ className: navActive }}>
              <UserRound className="size-4" />
              <span className="max-md:hidden">Minha conta</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
              <LogOut />
              <span className="max-md:hidden">Sair</span>
            </Button>
            <ThemeToggle className="ml-1" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      {eyebrow ? <p className="mb-2 text-xs font-medium tracking-[0.2em] text-lilac uppercase">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold text-plum sm:text-4xl">{title}</h1>
      {children ? <div className="mt-2 max-w-2xl text-muted-foreground">{children}</div> : null}
    </div>
  );
}
