import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { SecondaryLogo } from "@/common/components/atoms/icons/brand";
import { cn } from "@/common/utils/ui";
import type { Locale } from "@/common/i18n/routes";
import {
  resolveNavigationHref,
  type NavigationTarget,
} from "./navigation-href";
import { NavbarActions } from "./navbar-actions";

interface DesktopNavProps {
  navLinks: { name: string; href: NavigationTarget }[];
  locale: Locale;
  isHomePage: boolean;
  isPastHero: boolean;
  onNavigate: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: NavigationTarget,
  ) => void;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function DesktopNav({
  navLinks,
  locale,
  isHomePage,
  isPastHero,
  onNavigate,
}: DesktopNavProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const { theme, resolvedTheme } = useTheme();

  return (
    <>
      <Link
        href={resolveNavigationHref("#home", locale, isHomePage)}
        aria-label="Home"
        onClick={(event) => {
          if (isHomePage) {
            onNavigate(event, "#home");
          }
        }}
        className={cn(
          "group relative z-110 flex items-center gap-2 transition-colors duration-300 hover:opacity-70",
          !isHomePage || isPastHero ? "text-foreground" : "text-white",
        )}
      >
        <SecondaryLogo className="h-6 w-auto sm:h-12" />
      </Link>

      <div className="hidden items-center gap-8 xl:flex">
        <ul className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isHomeLink =
              link.href === "#home" || link.name.toLowerCase() === "home";
            const isContactLink =
              link.href === "#contact" || link.name.toLowerCase() === "contact";
            const isLight =
              mounted && (resolvedTheme === "light" || theme === "light");

            const isContactSplit =
              isHomePage &&
              !isPastHero &&
              isLight &&
              isContactLink &&
              link.name.toLowerCase().endsWith("ct");

            let textClass = "text-foreground/80 hover:text-foreground";
            let underlineClass = "bg-foreground";

            if (isHomePage && !isPastHero) {
              if (isHomeLink) {
                textClass = "text-white/80 hover:text-white";
                underlineClass = "bg-white";
              } else if (!isLight) {
                textClass = "text-white/80 hover:text-white";
                underlineClass = "bg-white";
              }
            } else if (!isLight) {
              textClass = "text-white/80 hover:text-white";
              underlineClass = "bg-white";
            }

            return (
              <li key={link.name}>
                <Link
                  href={resolveNavigationHref(link.href, locale, isHomePage)}
                  onClick={(event) => {
                    if (isHomePage && link.href.startsWith("#")) {
                      onNavigate(event, link.href);
                    }
                  }}
                  className={cn(
                    "group relative py-2 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300",
                    !isContactSplit && textClass,
                  )}
                >
                  {isContactSplit ? (
                    <>
                      <span className="text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                        {link.name.slice(0, -2)}
                      </span>
                      <span className="text-white/80 transition-colors duration-300 group-hover:text-white">
                        {link.name.slice(-2)}
                      </span>
                    </>
                  ) : (
                    link.name
                  )}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-full origin-left scale-x-[0.01] opacity-0 transition-[transform,opacity] duration-300 group-hover:scale-x-100 group-hover:opacity-100",
                      underlineClass,
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <NavbarActions mode="hero" />
      </div>
    </>
  );
}
