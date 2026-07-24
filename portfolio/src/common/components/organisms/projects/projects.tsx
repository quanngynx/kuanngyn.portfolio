"use client";

import { m, useTransform, useScroll, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useMessages } from "next-intl";
import { useMediaQuery, BREAKPOINTS } from "@/common/hooks/use-media-query";
import { BlurReveal } from "@/common/components/effects/blur-reveal";
import {
  ProjectItem,
  ProjectModal,
} from "@/common/components/molecules/modals/project-modal";

const EMPTY_PROJECT_ITEMS: ProjectItem[] = [];

export default function Projects() {
  const t = useTranslations("Projects");
  const messages = useMessages() as unknown as {
    Projects?: { items?: ProjectItem[] };
  };
  const projectItems = messages.Projects?.items ?? EMPTY_PROJECT_ITEMS;

  const isDesktop = useMediaQuery(BREAKPOINTS.xl);

  const targetRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  const [measurements, setMeasurements] = useState({
    scrollRange: 0,
    dynamicHeight: "auto",
  });
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isDesktop) {
      const frame = requestAnimationFrame(() => {
        setMeasurements({ scrollRange: 0, dynamicHeight: "auto" });
      });
      return () => cancelAnimationFrame(frame);
    }

    const updateMeasurements = () => {
      if (horizontalContainerRef.current) {
        const totalWidth = horizontalContainerRef.current.scrollWidth;
        const viewportW = window.innerWidth;
        const range = totalWidth - viewportW;
        const safeRange = range > 0 ? range : 0;

        setMeasurements({
          scrollRange: safeRange,
          dynamicHeight: `${safeRange + window.innerHeight}px`,
        });
      }
    };

    updateMeasurements();

    const timeout = setTimeout(updateMeasurements, 100);
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateMeasurements);
    });

    if (horizontalContainerRef.current) {
      resizeObserver.observe(horizontalContainerRef.current);
    }

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
  }, [isDesktop, projectItems]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -measurements.scrollRange],
  );
  const smoothX = useSpring(x, { stiffness: 400, damping: 60, restDelta: 0.5 });

  const handleOpenProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section
      ref={targetRef}
      data-slot="projects"
      className="relative py-16 md:py-24 lg:py-32 xl:py-0"
      style={{ height: measurements.dynamicHeight }}
    >
      <div
        className={`
                    w-full 
                    ${
                      isDesktop
                        ? "sticky top-0 flex h-screen items-center overflow-hidden"
                        : "relative flex flex-col"
                    }
                `}
      >
        {!isDesktop ? (
          <>
            <div className="mb-10 flex flex-col gap-4 px-container">
              <BlurReveal>
                <span className="title-counter">[003]</span>
              </BlurReveal>

              <BlurReveal>
                <h2 className="title">{t("title")}</h2>
              </BlurReveal>

              <BlurReveal>
                <p className="mt-4 text-lg text-muted-foreground">
                  {t("intro")}
                </p>
              </BlurReveal>
            </div>
            <div className="flex w-full max-w-full flex-col gap-container px-container">
              {projectItems.map((project: ProjectItem) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleOpenProject(project)}
                />
              ))}
            </div>
          </>
        ) : (
          <m.div
            ref={horizontalContainerRef}
            style={{ x: smoothX }}
            className="flex w-max items-center px-container"
          >
            <div className="flex w-[60vw] shrink-0 flex-col justify-center xl:w-[40vw]">
              <div className="flex flex-col gap-4">
                <BlurReveal>
                  <span className="title-counter">[003]</span>
                </BlurReveal>

                <BlurReveal>
                  <h2 className="title">{t("title")}</h2>
                </BlurReveal>

                <BlurReveal>
                  <p className="mt-4 text-5xl leading-tight font-light">
                    {t("intro")}
                  </p>
                </BlurReveal>

                <BlurReveal>
                  <div className="mt-12 flex items-center gap-4">
                    <div className="h-px w-24 bg-border" />
                    <span className="font-mono text-sm text-foreground/40 uppercase">
                      {t("scrollText")}
                    </span>
                  </div>
                </BlurReveal>
              </div>
            </div>

            {projectItems.map((project: ProjectItem) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleOpenProject(project)}
              />
            ))}

            <div className="flex h-[70vh] w-[40vw] shrink-0 flex-col items-center justify-center">
              <h3 className="text-[10vw] font-black tracking-tighter text-border uppercase">
                {t("endText")}
              </h3>
            </div>
          </m.div>
        )}
      </div>

      <ProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        project={selectedProject}
      />
    </section>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectItem;
  onClick?: () => void;
}) {
  return (
    <BlurReveal>
      <button
        type="button"
        onClick={onClick}
        className="group perspective-1000 relative aspect-4/3 w-full shrink-0 cursor-pointer text-left xl:mx-6 xl:w-[45vw]"
      >
        <div className="relative h-full w-full overflow-hidden border border-border/50 bg-muted transition-[border-color] duration-700 ease-out group-hover:border-foreground/20">
          <div className="absolute inset-0 z-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1280px) 100vw, 45vw"
              loading="lazy"
              className="object-cover opacity-60 grayscale transition-[opacity,filter,transform] duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 xl:p-12">
            <div className="flex items-start justify-between">
              <div className="overflow-hidden">
                <span className="block translate-y-full transform font-mono text-xs tracking-widest text-muted-foreground uppercase transition-transform delay-100 duration-500 group-hover:translate-y-0 xl:text-sm">
                  {project.category}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="block translate-y-full transform font-mono text-xs text-muted-foreground transition-transform delay-200 duration-500 group-hover:translate-y-0 xl:text-sm">
                  {project.year}
                </span>
              </div>
            </div>

            <h3 className="pointer-events-none absolute bottom-6 left-6 text-4xl font-black tracking-tighter text-foreground uppercase opacity-10 transition-opacity delay-100 duration-500 group-hover:opacity-100 md:bottom-8 md:left-8 md:text-5xl lg:text-6xl xl:text-7xl 2xl:bottom-12 2xl:left-12 2xl:text-8xl">
              {project.title}
            </h3>
          </div>
        </div>
      </button>
    </BlurReveal>
  );
}
