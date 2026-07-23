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

interface LanguageSwitcherProps {
    isPastHero?: boolean;
}

export function LanguageSwitcher({ isPastHero = true }: LanguageSwitcherProps) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (targetLocale: 'en' | 'vi') => {
        router.replace(pathname, { locale: targetLocale });
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full backdrop-blur-md transition-all duration-500 shadow-sm focus:outline-none",
                        isPastHero
                            ? "border border-border/50 bg-background/50 text-foreground hover:bg-foreground hover:text-background hover:border-foreground/30"
                            : "border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white/40"
                    )}
                >
                    <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-13 group-hover:duration-1000 group-hover:translate-x-full">
                        <div className="relative h-full w-4 bg-background/20 dark:bg-background/20" />
                    </div>
                    <span className="relative z-10 flex items-center justify-center">
                        <Globe className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                    </span>
                    <span className="sr-only">Switch Language</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-120 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl min-w-[140px] p-2">
                <DropdownMenuItem
                    className="rounded-xl cursor-pointer my-0.5 focus:bg-secondary flex items-center"
                    onClick={() => switchLanguage("en")}
                >
                    <span className={cn("mr-2 flex h-3.5 w-3.5 items-center justify-center")}>
                        {locale === "en" && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="text-xs tracking-widest uppercase">English</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="rounded-xl cursor-pointer my-0.5 focus:bg-secondary flex items-center"
                    onClick={() => switchLanguage("vi")}
                >
                    <span className={cn("mr-2 flex h-3.5 w-3.5 items-center justify-center")}>
                        {locale === "vi" && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="text-xs tracking-widest uppercase">Tiếng Việt</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageSwitcher;
