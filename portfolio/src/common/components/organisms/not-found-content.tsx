"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { InteractiveParticles } from "@/common/components/effects/interactive-particles";

interface NotFoundContentProps {
  dict?: {
    notFound?: {
      title?: string;
      description?: string;
      goHome?: string;
    };
  };
}

interface NotFoundUIProps {
  title: string;
  description: string;
  goHome: string;
}

function NotFoundUI({ title, description, goHome }: NotFoundUIProps) {
  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-container text-center">
      <InteractiveParticles />

      <div className="relative z-20 flex max-w-2xl flex-col items-center justify-center px-4">
        <div className="relative flex items-center justify-center select-none">
          <h1 className="font-sans text-[9rem] leading-none font-black tracking-tighter text-foreground/5 sm:text-[12rem] md:text-[15rem] dark:text-foreground/5">
            404
          </h1>

          <span className="absolute animate-pulse font-sans text-2xl font-black tracking-[0.25em] text-foreground uppercase drop-shadow-sm sm:text-3xl md:text-4xl">
            {title}
          </span>
        </div>

        <p className="mb-8 max-w-md text-sm leading-relaxed font-light text-muted-foreground select-none sm:text-base">
          {description}
        </p>

        <div>
          <Link
            href="/"
            className="group relative flex h-12 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 text-background shadow-2xl transition-[color,background-color,border-color,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-background hover:text-foreground sm:h-14 sm:px-8"
          >
            <div className="absolute inset-0 flex h-full w-full -translate-x-full -skew-x-12 justify-center transition-transform duration-700 group-hover:translate-x-full">
              <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
            </div>
            <span className="relative z-10 flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase">
              {goHome}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function TranslatedNotFoundContent({ dict }: NotFoundContentProps) {
  const t = useTranslations("NotFound");

  const title = dict?.notFound?.title || t("title");
  const description = dict?.notFound?.description || t("description");
  const goHome = dict?.notFound?.goHome || t("goHome");

  return <NotFoundUI title={title} description={description} goHome={goHome} />;
}

export function NotFoundContent({ dict }: NotFoundContentProps) {
  if (dict?.notFound) {
    const title = dict.notFound.title || "PAGE NOT FOUND";
    const description =
      dict.notFound.description ||
      "The page you are looking for does not exist or has been moved.";
    const goHome = dict.notFound.goHome || "RETURN HOME";

    return (
      <NotFoundUI title={title} description={description} goHome={goHome} />
    );
  }

  return <TranslatedNotFoundContent dict={dict} />;
}
