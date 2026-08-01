"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import {
  m,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/common/i18n/routes";
import { useLenis } from "@/common/providers/smooth-scroll-provider";
import { ThemeSwitcher } from "@/common/components/widgets/theme-switcher";
import { LanguageSwitcher } from "@/common/components/widgets/language-switcher";
import { SecondaryLogo } from "@/common/components/atoms/icons/brand";
import { cn } from "@/common/utils/ui";

import {
  type NavigationTarget,
  resolveNavigationHref,
} from "./navigation-href";

export function Navbar() {
  const t = useTranslations("Navigation");
  const lenis = useLenis();
  const locale = useLocale();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  const [dimensions, setDimensions] = useState({
    screenWidth: 1920,
    containerWidth: 1280,
    scrollHeight: 800,
  });

  const dummyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroThreshold =
      (dimensions.scrollHeight ||
        (typeof window !== "undefined" ? window.innerHeight : 800)) - 100;
    setIsPastHero(latest >= heroThreshold);
  });

  const bgOpacity = useTransform(scrollY, [0, dimensions.scrollHeight], [0, 1]);
  const backdropBlur = useTransform(
    scrollY,
    [0, dimensions.scrollHeight],
    [0, 16],
  );
  const backdropFilter = useTransform(
    backdropBlur,
    (value) => `blur(${value}px)`,
  );

  const py = useTransform(scrollY, [0, dimensions.scrollHeight], [24, 12]);

  const startWidth = Math.max(
    dimensions.screenWidth,
    dimensions.containerWidth,
  );
  const navMaxWidth = useTransform(
    scrollY,
    [0, dimensions.scrollHeight],
    [startWidth, dimensions.containerWidth],
  );

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
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setDimensions({
        screenWidth: window.innerWidth,
        scrollHeight: window.innerHeight,
        containerWidth: dummyRef.current
          ? dummyRef.current.getBoundingClientRect().width
          : 1280,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const overflowVal = isMobileMenuOpen ? "hidden" : "";
    document.body.style.overflow = overflowVal;
    document.documentElement.style.overflow = overflowVal;

    if (isMobileMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isMobileMenuOpen, lenis]);

  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);

      if (elem || targetId === "home") {
        setIsMobileMenuOpen(false);

        setTimeout(() => {
          let navbarHeight = 80;
          if (headerRef.current) {
            const currentHeight = headerRef.current.offsetHeight;
            const currentScroll = window.scrollY;
            const currentPy =
              currentScroll >= dimensions.scrollHeight
                ? 12
                : 24 - (currentScroll / dimensions.scrollHeight) * 12;
            const heightDifference = (currentPy - 12) * 2;
            navbarHeight = Math.max(currentHeight - heightDifference, 0);
          }

          const isDesktop = dimensions.screenWidth >= 1280;
          const isAboutOnDesktop = targetId === "about" && isDesktop;

          if (lenis) {
            lenis.scrollTo(targetId === "home" ? 0 : elem!, {
              offset:
                targetId === "home" ? 0 : isAboutOnDesktop ? 0 : -navbarHeight,
              duration: 1.5,
            });
          } else {
            if (targetId === "home") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (elem) {
              const rect = elem.getBoundingClientRect();
              const offsetPosition =
                rect.top +
                window.scrollY -
                (isAboutOnDesktop ? 0 : navbarHeight);
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }
        }, 100);
      }
    },
    [lenis, dimensions.scrollHeight, dimensions.screenWidth],
  );

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
        ref={dummyRef}
        className="pointer-events-none invisible absolute -z-50 container"
      />

      <m.div
        style={{
          opacity: bgOpacity,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
        }}
        className="border-border-secondary pointer-events-none absolute inset-0 -z-10 border-b bg-background/75"
      />

      <m.nav
        style={{
          maxWidth: navMaxWidth,
        }}
        className="mx-auto flex w-full items-center justify-between px-container"
      >
        <Link
          href={resolveNavigationHref("#home", locale, isHomePage)}
          aria-label={t("home")}
          onClick={(event) => {
            if (isHomePage) {
              scrollToSection(event, "#home");
            } else {
              setIsMobileMenuOpen(false);
            }
          }}
          className="group relative z-110 flex items-center gap-2"
        >
          <SecondaryLogo
            className={cn(
              "h-6 w-auto transition-colors duration-300 group-hover:opacity-70 sm:h-12",
              !isHomePage || isPastHero ? "text-foreground" : "text-white",
            )}
          />
        </Link>

        <div className="hidden items-center gap-8 xl:flex">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={resolveNavigationHref(link.href, locale, isHomePage)}
                  onClick={(event) => {
                    if (isHomePage && link.href.startsWith("#")) {
                      scrollToSection(event, link.href);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="group relative py-2 text-xs font-bold tracking-[0.2em] text-foreground/80 uppercase transition-colors duration-300 hover:text-foreground"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-[0.01] bg-foreground opacity-0 transition-[transform,opacity] duration-300 group-hover:scale-x-100 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex items-center gap-4 xl:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative z-110 p-2 text-foreground transition-colors duration-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </m.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
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
                      href={resolveNavigationHref(
                        link.href,
                        locale,
                        isHomePage,
                      )}
                      onClick={(event) => {
                        if (isHomePage && link.href.startsWith("#")) {
                          scrollToSection(event, link.href);
                        } else {
                          setIsMobileMenuOpen(false);
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
                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}

export default Navbar;
