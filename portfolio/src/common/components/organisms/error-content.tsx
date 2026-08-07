"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { InteractiveParticles } from "@/common/components/effects/interactive-particles";

export interface ErrorContentProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  dict?: {
    error?: {
      title?: string;
      description?: string;
      tryAgain?: string;
      goHome?: string;
    };
  };
}

interface ErrorUIProps {
  title: string;
  description: string;
  tryAgain: string;
  goHome: string;
  reset?: () => void;
}

function ErrorUI({
  title,
  description,
  tryAgain,
  goHome,
  reset,
}: ErrorUIProps) {
  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-container text-center">
      <InteractiveParticles />

      <div className="relative z-20 flex max-w-2xl flex-col items-center justify-center px-4">
        <div className="relative flex items-center justify-center select-none">
          <h1 className="font-sans text-[9rem] leading-none font-black tracking-tighter text-foreground/5 sm:text-[12rem] md:text-[15rem] dark:text-foreground/5">
            500
          </h1>

          <span className="absolute animate-pulse font-sans text-2xl font-black tracking-[0.25em] text-foreground uppercase drop-shadow-sm sm:text-3xl md:text-4xl">
            {title}
          </span>
        </div>

        <p className="mb-8 max-w-md text-sm leading-relaxed font-light text-muted-foreground select-none sm:text-base">
          {description}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            className="group relative flex h-12 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 text-background shadow-2xl transition-[color,background-color,border-color,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-background hover:text-foreground sm:h-14 sm:px-8"
          >
            <div className="absolute inset-0 flex h-full w-full -translate-x-full -skew-x-12 justify-center transition-transform duration-700 group-hover:translate-x-full">
              <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
            </div>
            <span className="relative z-10 flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase">
              <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-45" />
              {tryAgain}
            </span>
          </button>

          <Link
            href="/"
            className="group relative flex h-12 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background px-6 text-foreground shadow-lg transition-[color,background-color,border-color,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground hover:text-background sm:h-14 sm:px-8"
          >
            <div className="absolute inset-0 flex h-full w-full -translate-x-full -skew-x-12 justify-center transition-transform duration-700 group-hover:translate-x-full">
              <div className="relative h-full w-8 bg-foreground/10 dark:bg-background/20" />
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

function TranslatedErrorContent({ dict, reset }: ErrorContentProps) {
  const t = useTranslations("Error");

  const title = dict?.error?.title || t("title");
  const description = dict?.error?.description || t("description");
  const tryAgain = dict?.error?.tryAgain || t("tryAgain");
  const goHome = dict?.error?.goHome || t("goHome");

  return (
    <ErrorUI
      title={title}
      description={description}
      tryAgain={tryAgain}
      goHome={goHome}
      reset={reset}
    />
  );
}

export function ErrorContent({ dict, reset }: ErrorContentProps) {
  if (dict?.error) {
    const title = dict.error.title || "SOMETHING WENT WRONG";
    const description =
      dict.error.description ||
      "An unexpected error occurred while loading this page. Please try again or return home.";
    const tryAgain = dict.error.tryAgain || "TRY AGAIN";
    const goHome = dict.error.goHome || "RETURN HOME";

    return (
      <ErrorUI
        title={title}
        description={description}
        tryAgain={tryAgain}
        goHome={goHome}
        reset={reset}
      />
    );
  }

  return <TranslatedErrorContent dict={dict} reset={reset} />;
}
