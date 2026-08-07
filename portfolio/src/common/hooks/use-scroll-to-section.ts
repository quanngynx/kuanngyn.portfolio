import { useCallback } from "react";
import type Lenis from "lenis";
import type { NavigationTarget } from "../components/molecules/navigation/navigation-href";

interface UseScrollToSectionProps {
  lenis: Lenis | null;
  headerRef: React.RefObject<HTMLElement | null>;
  scrollHeight: number;
  screenWidth: number;
  closeMobileMenu: () => void;
}

export function useScrollToSection({
  lenis,
  headerRef,
  scrollHeight,
  screenWidth,
  closeMobileMenu,
}: UseScrollToSectionProps) {
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: NavigationTarget) => {
      if (!href.startsWith("#")) return;
      
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);

      if (elem || targetId === "home") {
        closeMobileMenu();

        setTimeout(() => {
          let navbarHeight = 80;
          if (headerRef.current) {
            const currentHeight = headerRef.current.offsetHeight;
            const currentScroll = window.scrollY;
            const currentPy =
              currentScroll >= scrollHeight
                ? 12
                : 24 - (currentScroll / scrollHeight) * 12;
            const heightDifference = (currentPy - 12) * 2;
            navbarHeight = Math.max(currentHeight - heightDifference, 0);
          }

          const isDesktop = screenWidth >= 1280;
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
    [lenis, headerRef, scrollHeight, screenWidth, closeMobileMenu],
  );

  return scrollToSection;
}
