import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/common/components/atoms/dialog";

import { useTranslations } from "next-intl";
import { useLenisModal } from "@/common/hooks/use-lenis-modal";
import { GitBranch, ExternalLink } from "lucide-react";
import Image from "next/image";
import { ShineButton } from "@/common/components/atoms/button/button.shine";
import { DeepWikiLogo } from "../../atoms/icons/deepwiki";

export type ProjectItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  demo?: string;
  repo?: string;
  deepwiki?: string;
  caseStudy?: string;
  stack?: string[];
};

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectItem | null;
}

export function ProjectModal({
  open,
  onOpenChange,
  project,
}: ProjectModalProps) {
  useLenisModal(open);
  const tModals = useTranslations("Modals");

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="flex max-h-[90vh] w-[95vw] shrink-0 flex-col gap-0 border-border/50 bg-background/95 p-0 backdrop-blur-xl sm:max-w-200"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            {tModals("projectDetails")} {project.title}
          </DialogDescription>
        </DialogHeader>

        <div className="absolute top-0 right-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div
          className="h-full w-full flex-1 overflow-y-auto"
          data-lenis-prevent="true"
        >
          <div className="relative h-[40vh] w-full shrink-0 sm:h-[50vh]">
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                className="rounded-lg object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />

            <div className="absolute right-6 bottom-6 left-6 flex flex-col justify-between gap-4 sm:right-10 sm:bottom-10 sm:left-10 sm:flex-row sm:items-end">
              <div>
                <h2 className="mb-2 text-4xl font-bold tracking-tighter text-foreground sm:text-6xl md:text-7xl">
                  {project.title}
                </h2>
                <div className="flex items-center gap-3 font-mono text-sm tracking-widest text-muted-foreground uppercase">
                  <span>{project.category}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 p-6 sm:p-10">
            <div>
              <h3 className="mb-4 text-sm tracking-widest text-muted-foreground uppercase">
                {tModals("aboutProject")}
              </h3>
              <p className="text-lg leading-relaxed font-light text-foreground/80">
                {project.description}
              </p>
            </div>

            {project.stack && project.stack.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm tracking-widest text-muted-foreground uppercase">
                  {tModals("technologies")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(project.demo || project.repo || project.caseStudy) && (
              <div className="flex flex-wrap gap-4 border-t border-border/50 pt-4">
                {project.caseStudy && (
                  <ShineButton
                    href={project.caseStudy}
                    target="_self"
                    className="h-12 bg-foreground px-6 text-background shadow-lg hover:-translate-y-1 hover:bg-background hover:text-foreground sm:px-8"
                    shineClassName="w-8 bg-background/20 dark:bg-foreground/10"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase sm:text-sm">
                      {tModals("readCaseStudy")}
                      <ExternalLink className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-4 sm:w-4" />
                    </span>
                  </ShineButton>
                )}

                {project.demo && (
                  <ShineButton
                    href={project.demo}
                    className="h-12 bg-foreground px-6 text-background shadow-lg hover:-translate-y-1 hover:bg-background hover:text-foreground sm:px-8"
                    shineClassName="w-8 bg-background/20 dark:bg-foreground/10"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase sm:text-sm">
                      {tModals("liveDemo")}
                      <ExternalLink className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-4 sm:w-4" />
                    </span>
                  </ShineButton>
                )}

                {project.repo && (
                  <ShineButton
                    href={project.repo}
                    className="h-12 bg-secondary/10 px-6 text-foreground shadow-sm backdrop-blur-md hover:-translate-y-1 hover:bg-foreground hover:text-background sm:px-8"
                    shineClassName="w-8 bg-foreground/10 dark:bg-background/20"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase sm:text-sm">
                      {tModals("sourceCode")}
                      <GitBranch className="h-3.5 w-3.5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 sm:h-4 sm:w-4" />
                    </span>
                  </ShineButton>
                )}

                {project.repo && (
                  <ShineButton
                    href={project.deepwiki ?? ""}
                    className="h-12 bg-secondary/10 px-6 text-foreground shadow-sm backdrop-blur-md hover:-translate-y-1 hover:bg-foreground hover:text-background sm:px-8"
                    shineClassName="w-8 bg-foreground/10 dark:bg-background/20"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase sm:text-sm">
                      {tModals("deepwikiDocs")}
                      <DeepWikiLogo className="h-3.5 w-3.5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 sm:h-4 sm:w-4" />
                    </span>
                  </ShineButton>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </DialogContent>
    </Dialog>
  );
}
