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
        }
    };
}

interface NotFoundUIProps {
    title: string;
    description: string;
    goHome: string;
}

function NotFoundUI({ title, description, goHome }: NotFoundUIProps) {
    return (
        <div className="relative w-full h-screen flex flex-col justify-center items-center text-center px-container overflow-hidden bg-background">
            <InteractiveParticles />

            <div className="relative z-20 flex flex-col items-center justify-center max-w-2xl px-4">

                <div className="relative select-none flex items-center justify-center">
                    <h1 className="text-[9rem] sm:text-[12rem] md:text-[15rem] font-black tracking-tighter leading-none text-foreground/5 dark:text-foreground/5 font-sans">
                        404
                    </h1>

                    <span className="absolute text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.25em] text-foreground uppercase drop-shadow-sm font-sans animate-pulse">
                        {title}
                    </span>
                </div>

                <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed max-w-md mb-8 select-none">
                    {description}
                </p>

                <div>
                    <Link
                        href="/"
                        className="w-fit group relative flex h-12 sm:h-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 sm:px-8 text-background transition-all duration-500 ease-out hover:bg-background hover:border-foreground/30 hover:text-foreground shadow-2xl hover:-translate-y-0.5"
                    >
                        <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-12 group-hover:duration-1000 group-hover:translate-x-full">
                            <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
                        </div>
                        <span className="relative z-10 flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase">
                            {goHome}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>
            </div>

        </div>
    );
}

function TranslatedNotFoundContent({ dict }: NotFoundContentProps) {
    const t = useTranslations('NotFound');

    const title = dict?.notFound?.title || t('title');
    const description = dict?.notFound?.description || t('description');
    const goHome = dict?.notFound?.goHome || t('goHome');

    return <NotFoundUI title={title} description={description} goHome={goHome} />;
}

export function NotFoundContent({ dict }: NotFoundContentProps) {
    if (dict?.notFound) {
        const title = dict.notFound.title || "PAGE NOT FOUND";
        const description = dict.notFound.description || "The page you are looking for does not exist or has been moved.";
        const goHome = dict.notFound.goHome || "RETURN HOME";

        return <NotFoundUI title={title} description={description} goHome={goHome} />;
    }

    return <TranslatedNotFoundContent dict={dict} />;
}
