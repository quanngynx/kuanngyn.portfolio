"use client";

import { useState, useEffect } from "react";
import { useScroll, m } from "framer-motion";

export function ReadingProgressBar() {
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setTargetEl(document.getElementById("blog-article"));
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetEl ? { current: targetEl } : undefined,
    offset: ["start start", "end end"],
  });

  return (
    <m.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 right-0 left-0 z-50 h-0.5 origin-left bg-primary"
    />
  );
}
