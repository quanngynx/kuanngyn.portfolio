import { ThemeSwitcher } from "@/common/components/widgets/theme-switcher";
import { LanguageSwitcher } from "@/common/components/widgets/language-switcher";
import { cn } from "@/common/utils/ui";
import type { NavbarActionsMode } from "./navbar.types";

interface NavbarActionsProps {
  mode: NavbarActionsMode;
  className?: string;
}

export function NavbarActions({ mode, className }: NavbarActionsProps) {
  // If mode is "blended", the parent is expected to apply `mix-blend-difference text-white`
  // so the switchers inherit it (or handle it themselves).
  // ThemeSwitcher and LanguageSwitcher already check `mode === "blended"` internally 
  // to change their styling appropriately.
  
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <LanguageSwitcher mode={mode} />
      <ThemeSwitcher mode={mode} />
    </div>
  );
}
