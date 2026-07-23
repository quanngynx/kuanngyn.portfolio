"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/common/providers/smooth-scroll-provider";
import { ThemeSwitcher } from "@/common/components/widgets/theme-switcher";
import { LanguageSwitcher } from "@/common/components/widgets/language-switcher";
import { cn } from "@/common/utils/ui";

export function Navbar() {
  const t = useTranslations('Navigation');
  const lenis = useLenis();
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
    const heroThreshold = (dimensions.scrollHeight || (typeof window !== "undefined" ? window.innerHeight : 800)) - 100;
    setIsPastHero(latest >= heroThreshold);
  });

  const bgOpacity = useTransform(scrollY, [0, dimensions.scrollHeight], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, dimensions.scrollHeight], [0, 16]);
  const backdropFilter = useMotionTemplate`blur(${backdropBlur}px)`;

  const py = useTransform(scrollY, [0, dimensions.scrollHeight], [24, 12]);

  const startWidth = Math.max(dimensions.screenWidth, dimensions.containerWidth);
  const navMaxWidth = useTransform(scrollY, [0, dimensions.scrollHeight], [startWidth, dimensions.containerWidth]);

  const navLinks = useMemo(() => [
    { name: t('home'), href: "#home" },
    { name: t('about'), href: "#about" },
    { name: t('stack'), href: "#stack" },
    { name: t('projects'), href: "#projects" },
    { name: t('roadmap'), href: "#roadmap" },
    { name: t('contact'), href: "#contact" },
  ], [t]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setDimensions({
        screenWidth: window.innerWidth,
        scrollHeight: window.innerHeight,
        containerWidth: dummyRef.current ? dummyRef.current.getBoundingClientRect().width : 1280,
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

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
          const currentPy = currentScroll >= dimensions.scrollHeight
            ? 12
            : 24 - (currentScroll / dimensions.scrollHeight) * 12;
          const heightDifference = (currentPy - 12) * 2;
          navbarHeight = Math.max(currentHeight - heightDifference, 0);
        }

        const isDesktop = dimensions.screenWidth >= 1280;
        const isAboutOnDesktop = targetId === "about" && isDesktop;

        if (lenis) {
          lenis.scrollTo(targetId === "home" ? 0 : elem!, {
            offset: targetId === "home" ? 0 : isAboutOnDesktop ? 0 : -navbarHeight,
            duration: 1.5,
          });
        } else {
          if (targetId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (elem) {
            const rect = elem.getBoundingClientRect();
            const offsetPosition = rect.top + window.scrollY - (isAboutOnDesktop ? 0 : navbarHeight);
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }, [lenis, dimensions.scrollHeight, dimensions.screenWidth]);

  return (
    <motion.header
      ref={headerRef}
      style={{
        paddingTop: py,
        paddingBottom: py,
      }}
      className="fixed top-0 left-0 right-0 z-100 transition-colors duration-300"
    >
      <div ref={dummyRef} className="container invisible absolute pointer-events-none -z-50" />

      <motion.div
        style={{
          opacity: bgOpacity,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
        }}
        className="absolute inset-0 bg-background/75 border-b border-border/40 -z-10 pointer-events-none"
      />

      <motion.nav
        style={{
          maxWidth: navMaxWidth,
        }}
        className="mx-auto px-container flex items-center justify-between w-full"
      >
        <Link
          href="#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="relative z-110 flex items-center gap-2 group"
        >
          {/* NOTE: PLACE FOR LOGO BRAND */}
          <span className={cn(
            "text-xl sm:text-2xl font-black tracking-tighter uppercase transition-colors duration-300 group-hover:opacity-70",
            isPastHero ? "text-foreground" : "text-white"
          )}>
            quanngynx
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={cn(
                    "relative text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 group py-2",
                    isPastHero ? "text-white/80 hover:text-white" : "text-black hover:text-black/70"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full",
                    isPastHero ? "bg-white" : "bg-black"
                  )} />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageSwitcher isPastHero={isPastHero} />
            <ThemeSwitcher isPastHero={isPastHero} />
          </div>
        </div>

        <div className="flex xl:hidden items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className={cn(
              "relative z-110 p-2 focus:outline-none transition-colors duration-300",
              isPastHero ? "text-white" : "text-black"
            )}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-90 bg-background xl:hidden flex flex-col h-dvh w-screen"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <div className="flex flex-col flex-1 pt-24 sm:pt-32 pb-24 sm:pb-12 px-container overflow-y-auto relative z-10">
              <ul className="flex flex-col gap-6 sm:gap-8">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + (i * 0.05),
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="group flex items-baseline"
                    >
                      <span className="text-4xl font-black tracking-tighter uppercase text-foreground transition-all duration-300 group-hover:pl-4 group-hover:text-primary">
                        {link.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <LanguageSwitcher isPastHero={true} />
                  <ThemeSwitcher isPastHero={true} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
