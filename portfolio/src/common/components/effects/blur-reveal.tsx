"use client";

import { ReactNode } from "react";
import { m } from "framer-motion";

interface BlurRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BlurReveal({
  children,
  className,
  delay = 0,
}: BlurRevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, filter: "blur(8px)", y: 30 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </m.div>
  );
}
