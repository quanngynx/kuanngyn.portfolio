"use client";
import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/common/utils/ui";

const SPRING_CONFIG = { damping: 25, stiffness: 300, mass: 0.5 };

export function CustomCursor() {
  const isVisibleRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const cursorXSpring = useSpring(cursorX, SPRING_CONFIG);
  const cursorYSpring = useSpring(cursorY, SPRING_CONFIG);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const frameId = requestAnimationFrame(() => {
      setIsEnabled(true);
    });

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const isInteractive = (el: HTMLElement): boolean => {
      const tag = el.tagName.toLowerCase();
      if (
        tag === "button" ||
        tag === "a" ||
        tag === "input" ||
        tag === "select" ||
        tag === "textarea"
      )
        return true;
      if (el.closest("button") || el.closest("a")) return true;
      if (el.getAttribute("role") === "button") return true;
      if (el.classList.contains("cursor-pointer")) return true;
      if (el.dataset.cursor === "pointer") return true;
      return false;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(isInteractive(target));
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!isEnabled) return null;

  return (
    <m.div
      className="pointer-events-none fixed top-0 left-0 hidden items-center justify-center mix-blend-difference md:flex"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0,
        zIndex: 999999,
      }}
    >
      <m.div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300",
          isHovering ? "bg-white" : "border border-white/50 bg-transparent",
        )}
        animate={{
          scale: isHovering ? 2 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <m.div
          className="h-1.5 w-1.5 rounded-full bg-white"
          animate={{
            scale: isHovering ? 0 : 1,
            opacity: isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </m.div>
    </m.div>
  );
}
