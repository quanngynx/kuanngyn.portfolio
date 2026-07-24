"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { cn } from "@/common/utils/ui";

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      className={cn(
        "fixed top-0 right-0 left-0 z-99999 h-1 origin-left bg-primary",
        className,
      )}
      style={{ scaleX }}
    />
  );
}
