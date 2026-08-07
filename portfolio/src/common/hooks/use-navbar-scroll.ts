import { useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export function useNavbarScroll(
  scrollHeight: number,
  screenWidth: number,
  containerWidth: number,
) {
  const [isPastHero, setIsPastHero] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroThreshold =
      (scrollHeight ||
        (typeof window !== "undefined" ? window.innerHeight : 800)) - 100;

    setIsPastHero((current) => {
      const next = latest >= heroThreshold;
      return current === next ? current : next;
    });
  });

  const py = useTransform(scrollY, [0, scrollHeight], [24, 12]);

  const startWidth = Math.max(screenWidth, containerWidth);
  const navMaxWidth = useTransform(
    scrollY,
    [0, scrollHeight],
    [startWidth, containerWidth],
  );

  return {
    py,
    navMaxWidth,
    isPastHero,
  };
}

