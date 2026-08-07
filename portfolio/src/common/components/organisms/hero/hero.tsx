"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useScroll, useTransform, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactModal } from "@/common/components/molecules/modals/contact-modal";
import { InteractiveParticles } from "@/common/components/effects/interactive-particles";
import { ButtonWithVideo } from "../../atoms/button/button.video";
import { cn } from "@/common/utils";

const TRACK_1 = [
  "/hero-slider/amncu2ytwgk1u3entffj.webp",
  "/hero-slider/cosirjjoqyzvjq7v0lf5.webp",
  "/hero-slider/sszt57fxhsqxrbdredxf.webp",
  "/hero-slider/mjcsiedxyrnajenusw2t.webp",
  "/hero-slider/sl75jrynnekai1cl8y40.webp",
  "/hero-slider/qlbpj8l3jro90tesp23v.webp",
] as const;

const TRACK_2 = [
  "/hero-slider/sszt57fxhsqxrbdredxf.webp",
  "/hero-slider/xhmbmyszuzjmjz4f4deb.webp",
  "/hero-slider/mjcsiedxyrnajenusw2t.webp",
  "/hero-slider/cosirjjoqyzvjq7v0lf5.webp",
  "/hero-slider/nonvxfb3d8ygtge9ousy.webp",
  "/hero-slider/szptr8p0lf04zkpl5rlh.webp",
] as const;

const COL_1_IMAGES = [
  ...TRACK_1.map((src, index) => ({
    id: `first-${src}`,
    priority: index < 2,
    src,
  })),
  ...TRACK_1.map((src) => ({ id: `second-${src}`, priority: false, src })),
];

const COL_2_IMAGES = [
  ...TRACK_2.map((src, index) => ({
    id: `first-${src}`,
    priority: index < 2,
    src,
  })),
  ...TRACK_2.map((src) => ({ id: `second-${src}`, priority: false, src })),
];

function navigateToResume() {
  window.open(
    "https://drive.google.com/file/d/1wfaTzAQA5LUwdtXlISH0DltSaw_KhaO2/view?usp=sharing",
    "_blank",
    "noopener noreferrer",
  );
}

export default function Hero() {
  const tHero = useTranslations("Hero");
  const tAbout = useTranslations("About");
  const containerRef = useRef<HTMLDivElement>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);
  const scale = useTransform(scrollY, [0, 800], [1, 0.94]);
  const y = useTransform(scrollY, [0, 800], [0, -150]);
  const blurValue = useTransform(scrollY, [0, 800], [0, 10]);
  const filter = useTransform(blurValue, (value) => `blur(${value}px)`);

  return (
    <section
      ref={containerRef}
      className="sticky flex h-dvh w-full flex-col justify-between overflow-hidden px-container pt-36 pb-12 sm:pt-40 md:px-16 md:pt-44 2xl:top-10 2xl:pt-48 2xl:pb-24"
      id="home"
    >
      <InteractiveParticles />

      <m.div
        style={{ opacity }}
        className={cn(
          "top-0 right-6 bottom-0 z-5 flex h-full w-55 gap-3 px-2 ",
          "sm:right-12 sm:w-65 sm:gap-4 md:right-16 md:w-85 lg:right-24 lg:w-100 xl:right-36 xl:w-110 2xl:right-48 2xl:w-120",
          "pointer-events-none absolute overflow-hidden opacity-[0.22] mix-blend-luminosity select-none",
          "dark:opacity-[1.28]",
        )}
      >
        <div className="relative h-full flex-1 overflow-hidden max-md:hidden">
          <m.div
            animate={{ y: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 32,
              repeat: Infinity,
            }}
            className="flex flex-col gap-3 pt-4 sm:gap-4"
          >
            {COL_1_IMAGES.map(({ id, priority, src }) => (
              <div
                key={id}
                className="relative aspect-3/4 w-full overflow-hidden rounded-4xl border border-border/5"
              >
                <Image
                  src={src}
                  alt="Portrait"
                  fill
                  sizes="(max-width: 768px) 0px, (max-width: 1280px) 20vw, 15vw"
                  priority={priority}
                  className="object-cover object-center brightness-[0.8] contrast-[1.08] grayscale"
                />
              </div>
            ))}
          </m.div>
        </div>

        <div className="relative h-full flex-1 overflow-hidden max-md:opacity-50">
          <m.div
            animate={{ y: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 32,
              repeat: Infinity,
            }}
            className="flex flex-col gap-3 pt-4 sm:gap-4"
          >
            {COL_2_IMAGES.map(({ id, priority, src }) => (
              <div
                key={id}
                className="relative aspect-3/4 w-full overflow-hidden rounded-4xl border border-border/5"
              >
                <Image
                  src={src}
                  alt="Portrait"
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1280px) 20vw, 15vw"
                  priority={priority}
                  className="object-cover object-center brightness-[0.8] contrast-[1.08] grayscale"
                />
              </div>
            ))}
          </m.div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-background via-transparent to-background" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-background via-transparent to-transparent" />
      </m.div>

      <m.div
        style={{ opacity, scale, y, filter }}
        className="relative z-20 flex h-full w-full flex-1 flex-col justify-end gap-6 sm:gap-8 xl:gap-12"
      >
        <div className="flex w-full items-start justify-between">
          <div className="grunge-text pointer-events-none rotate-90 text-4xl text-foreground/10 select-none sm:text-6xl">
            {"////"}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative h-12 w-px overflow-hidden bg-border">
              <m.div
                className="absolute top-0 left-0 h-1/2 w-full bg-foreground"
                animate={{
                  y: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground uppercase [writing-mode:vertical-lr]">
              {tHero("scrollDown")}
            </span>
          </div>
        </div>

        <div className="relative z-20 mt-auto flex w-full flex-col justify-center pt-4 mix-blend-difference sm:pt-8">
          <div className="overflow-hidden">
            <h1 className="text-5xl leading-[0.85] font-black tracking-tighter whitespace-nowrap text-white uppercase 3xl:text-[120px] md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl">
              Quanngynx
              <br />
              <span className="text-white/80">Portfolio</span>
            </h1>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 xl:space-y-10">
          <p className="max-w-xl leading-relaxed font-light text-white/80 mix-blend-difference sm:text-lg 2xl:text-xl">
            {tAbout("description")}
          </p>

          <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="group relative flex h-12 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 text-background shadow-2xl transition-[color,background-color,border-color,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-background hover:text-foreground xl:h-16 xl:px-10"
            >
              <div className="absolute inset-0 flex h-full w-full -translate-x-full -skew-x-12 justify-center transition-transform duration-700 group-hover:translate-x-full">
                <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
              </div>
              <span className="relative z-10 flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase xl:gap-3 xl:text-base">
                {tHero("contactMe")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 xl:h-5 xl:w-5" />
              </span>
            </button>

            <ButtonWithVideo
              className="group relative flex h-12 w-fit cursor-pointer items-center justify-center rounded-full border border-border bg-secondary px-6 text-muted-foreground backdrop-blur-sm transition-[color,background-color,border-color] duration-500 hover:border-border/30 hover:bg-secondary/15 hover:text-white sm:border-transparent xl:h-16 xl:px-10"
              videoFileName="header-button-home"
              onClick={navigateToResume}
              asChild
            >
              <span className="relative z-10 flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase xl:gap-3 xl:text-base">
                {tHero("viewResume")}
              </span>
            </ButtonWithVideo>
          </div>
        </div>
      </m.div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </section>
  );
}
