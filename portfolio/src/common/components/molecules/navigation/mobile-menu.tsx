import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Locale } from "@/common/i18n/routes";
import {
  resolveNavigationHref,
  type NavigationTarget,
} from "./navigation-href";
import { NavbarActions } from "./navbar-actions";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: { name: string; href: NavigationTarget }[];
  locale: Locale;
  isHomePage: boolean;
  onNavigate: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: NavigationTarget,
  ) => void;
}

export function MobileMenu({
  isOpen,
  navLinks,
  locale,
  isHomePage,
  onNavigate,
}: MobileMenuProps) {
  const t = useTranslations("Navigation");

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          id="mobile-navigation-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-90 flex h-dvh w-screen flex-col bg-background xl:hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent)]" />
          <div className="bg-grid-white/[0.02] pointer-events-none absolute inset-0" />

          <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-container pt-24 pb-24 sm:pt-32 sm:pb-12">
            <ul className="flex flex-col gap-6 sm:gap-8">
              {navLinks.map((link, i) => (
                <m.li
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={resolveNavigationHref(link.href, locale, isHomePage)}
                    onClick={(event) => {
                      if (isHomePage && link.href.startsWith("#")) {
                        onNavigate(event, link.href);
                      }
                    }}
                    className="group flex items-baseline"
                  >
                    <span className="text-4xl font-black tracking-tighter text-foreground uppercase transition-[transform,color] duration-300 group-hover:translate-x-4 group-hover:text-primary">
                      {link.name}
                    </span>
                  </Link>
                </m.li>
              ))}
            </ul>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center justify-between"
            >
              <NavbarActions mode="mobile-menu" />
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

