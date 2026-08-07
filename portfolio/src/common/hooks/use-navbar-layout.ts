import { useState, useEffect, useRef } from "react";

export function useNavbarLayout() {
  const [dimensions, setDimensions] = useState({
    screenWidth: 1920,
    containerWidth: 1280,
    scrollHeight: 800,
  });

  const measurementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const updateDimensions = () => {
      frameId = requestAnimationFrame(() => {
        const next = {
          screenWidth: window.innerWidth,
          scrollHeight: window.innerHeight,
          containerWidth: measurementRef.current
            ? measurementRef.current.getBoundingClientRect().width
            : 1280,
        };

        setDimensions((current) => {
          if (
            current.screenWidth === next.screenWidth &&
            current.scrollHeight === next.scrollHeight &&
            current.containerWidth === next.containerWidth
          ) {
            return current;
          }
          return next;
        });
      });
    };

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    updateDimensions();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return {
    measurementRef,
    ...dimensions,
  };
}
