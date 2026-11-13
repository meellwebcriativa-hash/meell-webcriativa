import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Runs before paint (see __root.tsx) so the saved theme applies without a flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // storage unavailable: theme still applies for this visit
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn("cursor-pointer", className)}
      aria-label={dark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      title={dark ? "Modo claro" : "Modo escuro"}
    >
      <span className="flex size-10 items-center justify-center rounded-full border bg-card transition-colors hover:bg-secondary">
        {dark ? <Sun className="size-5 text-pink" /> : <Moon className="size-5 text-lilac" />}
      </span>
    </button>
  );
}
