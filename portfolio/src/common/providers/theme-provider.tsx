"use client";

import * as React from "react";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{ async: true, suppressHydrationWarning: true }}
    >
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </NextThemesProvider>
  );
}
