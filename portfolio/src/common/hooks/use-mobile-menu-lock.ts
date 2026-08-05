import { useEffect } from "react";
import type Lenis from "lenis";

export function useMobileMenuLock(
  isMobileMenuOpen: boolean,
  lenis: Lenis | null,
) {
  useEffect(() => {
    if (!isMobileMenuOpen) {
      lenis?.start();
      return;
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      lenis?.start();
    };
  }, [isMobileMenuOpen, lenis]);
}
