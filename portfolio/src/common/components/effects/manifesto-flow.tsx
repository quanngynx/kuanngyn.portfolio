"use client";

const Separator = () => (
  <div className="aspect-square h-3 w-3 rounded-full bg-foreground/10 sm:h-4 sm:w-4 md:h-5 md:w-5 xl:h-6 xl:w-6" />
);

const DEFAULT_MANIFESTO = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Atomic Design",
  "UI Engineering",
  "Framer Motion",
];

export default function ManifestoFlow({
  reverse = false,
}: {
  reverse?: boolean;
}) {
  const manifestoItems = DEFAULT_MANIFESTO;

  return (
    <div className="pointer-events-none relative w-full overflow-hidden border-y border-border/50 bg-background/50 py-10 backdrop-blur-sm select-none">
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent md:w-40" />

      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-linear-to-l from-background to-transparent md:w-40" />

      <div className="marquee-track pointer-events-auto flex w-full overflow-hidden">
        <div
          className={`flex min-w-full shrink-0 animate-scroll items-center justify-around gap-8 pr-8 xl:gap-16 xl:pr-16 ${reverse ? "direction-reverse" : ""}`}
        >
          {manifestoItems.map((item: string) => (
            <div
              key={`t1-${item}`}
              className="flex items-center gap-8 xl:gap-16"
            >
              <span className="text-4xl font-bold whitespace-nowrap text-foreground/25 uppercase sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>

        <div
          className={`flex min-w-full shrink-0 animate-scroll items-center justify-around gap-8 pr-8 xl:gap-16 xl:pr-16 ${reverse ? "direction-reverse" : ""}`}
        >
          {manifestoItems.map((item: string) => (
            <div
              key={`t2-${item}`}
              className="flex items-center gap-8 xl:gap-16"
            >
              <span className="text-4xl font-bold whitespace-nowrap text-foreground/25 uppercase sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
