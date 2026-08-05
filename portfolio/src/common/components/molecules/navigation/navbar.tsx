"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Locale, usePathname } from "@/common/i18n/routes";
import { useLocale } from "next-intl";
import { useLenis } from "@/common/providers/smooth-scroll-provider";

import type { NavigationTarget } from "./navigation-href";
import { useNavbarLayout } from "@/common/hooks/use-navbar-layout";
import { useNavbarScroll } from "@/common/hooks/use-navbar-scroll";
import { useMobileMenuLock } from "@/common/hooks/use-mobile-menu-lock";
import { useScrollToSection } from "@/common/hooks/use-scroll-to-section";
import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  const t = useTranslations("Navigation");
  const lenis = useLenis();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { measurementRef, screenWidth, containerWidth, scrollHeight } =
    useNavbarLayout();
  const { py, navMaxWidth, isPastHero } = useNavbarScroll(
    scrollHeight,
    screenWidth,
    containerWidth,
  );

  useMobileMenuLock(isMobileMenuOpen, lenis);

  const scrollToSection = useScrollToSection({
    lenis,
    headerRef,
    scrollHeight,
    screenWidth,
    closeMobileMenu: () => setIsMobileMenuOpen(false),
  });

  const navLinks = useMemo(
    () =>
      [
        { name: t("home"), href: "#home" },
        { name: t("about"), href: "#about" },
        { name: t("stack"), href: "#stack" },
        { name: t("projects"), href: "#projects" },
        { name: t("roadmap"), href: "#roadmap" },
        { name: t("blog"), href: "/blog" },
        { name: t("contact"), href: "#contact" },
      ] satisfies { name: string; href: NavigationTarget }[],
    [t],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <m.header
      ref={headerRef}
      style={{
        paddingTop: py,
        paddingBottom: py,
      }}
      className="fixed top-0 right-0 left-0 z-100 transition-colors duration-300"
    >
      <div
        ref={measurementRef}
        className="pointer-events-none invisible absolute -z-50 container"
      />

      <m.nav
        style={{
          maxWidth: navMaxWidth,
        }}
        className="mx-auto flex w-full items-center justify-between px-container"
      >
        <DesktopNav
          navLinks={navLinks}
          locale={locale}
          isHomePage={isHomePage}
          isPastHero={isPastHero}
          onNavigate={scrollToSection}
        />

        <div className="flex items-center gap-4 xl:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative z-110 p-2 text-foreground transition-colors duration-300 focus:outline-none"
            aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </m.nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        navLinks={navLinks}
        locale={locale}
        isHomePage={isHomePage}
        onNavigate={(e, href) => {
          if (isHomePage && href.startsWith("#")) {
            scrollToSection(e, href);
          } else {
            setIsMobileMenuOpen(false);
          }
        }}
      />
    </m.header>
  );
}

export default Navbar;

