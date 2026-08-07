"use client";

import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/common/i18n/routes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/atoms/dropdown-menu";
import { cn } from "@/common/utils/ui";
import type { NavbarActionsMode } from "../molecules/navigation/navbar.types";

export function LanguageSwitcher({ mode = "mobile-menu" }: { mode?: NavbarActionsMode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (targetLocale: "en" | "vi") => {
    router.replace(pathname, { locale: targetLocale });
  };

  const isBlended = mode === "blended";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-[color,background-color,border-color] duration-500 focus:outline-none",
            isBlended
              ? "bg-transparent text-inherit border-transparent hover:bg-white/10"
              : "border border-border/50 bg-background/50 text-foreground shadow-sm backdrop-blur-md hover:border-foreground/30 hover:bg-foreground hover:text-background",
          )}
        >
          <div className="absolute inset-0 flex h-full w-full -translate-x-full -skew-x-13 justify-center transition-transform duration-700 group-hover:translate-x-full">
            <div className="relative h-full w-4 bg-background/20 dark:bg-background/20" />
          </div>
          <span className="relative z-10 flex items-center justify-center">
            <Globe className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
          </span>
          <span className="sr-only">Switch Language</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-120 min-w-35 rounded-2xl border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-xl"
      >
        <DropdownMenuItem
          className="my-0.5 flex cursor-pointer items-center rounded-xl focus:bg-secondary"
          onClick={() => switchLanguage("en")}
        >
          <span
            className={cn("mr-2 flex h-3.5 w-3.5 items-center justify-center")}
          >
            {locale === "en" && <Check className="h-3.5 w-3.5" />}
          </span>
          <span className="text-xs tracking-widest uppercase">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="my-0.5 flex cursor-pointer items-center rounded-xl focus:bg-secondary"
          onClick={() => switchLanguage("vi")}
        >
          <span
            className={cn("mr-2 flex h-3.5 w-3.5 items-center justify-center")}
          >
            {locale === "vi" && <Check className="h-3.5 w-3.5" />}
          </span>
          <span className="text-xs tracking-widest uppercase">Tiếng Việt</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
