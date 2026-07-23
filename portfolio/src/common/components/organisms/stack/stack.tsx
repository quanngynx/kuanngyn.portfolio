"use client";

import Image from "next/image";
import { useTranslations, useMessages } from "next-intl";
import { BlurReveal } from "@/common/components/effects/blur-reveal";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/common/components/atoms/hover-card";

export type StackItem = {
    name: string;
    icon: string;
    featured?: boolean;
};

export type SharedMessages = {
    stack?: {
        frontend?: StackItem[];
        backend?: StackItem[];
        database?: StackItem[];
        tools?: StackItem[];
    };
};

export default function Stack() {
    const t = useTranslations('Stack');
    const messages = useMessages() as unknown as SharedMessages;
    const stackData = messages.stack || {};

    const categories = [
        {
            title: t('frontend'),
            items: stackData.frontend || [],
        },
        {
            title: t('backend'),
            items: stackData.backend || [],
        },
        {
            title: t('database'),
            items: stackData.database || [],
        },
        {
            title: t('tools'),
            items: stackData.tools || [],
        },
    ];

    return (
        <section className="w-full bg-background text-foreground overflow-hidden relative py-16 md:py-24 lg:py-32 xl:py-40 2xl:py-36">

            <div className="h-full flex flex-col px-container container mx-auto">
                <div className="flex flex-col gap-4 mb-16">
                    <BlurReveal>
                        <span className="title-counter">[002]</span>
                    </BlurReveal>

                    <BlurReveal>
                        <h2 className="title">{t('title')}</h2>
                    </BlurReveal>
                </div>

                <div className="flex flex-col gap-container mb-6">
                    {categories.map((category, catIndex) => (
                        <BlurReveal key={category.title}>
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[10px] font-mono tracking-widest text-muted-foreground/40">
                                        0{catIndex + 1}
                                    </span>
                                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
                                        {category.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-6 flex-wrap mb-6">
                                    {category.items.map((item: StackItem) => (
                                        <HoverCard key={item.name} openDelay={50} closeDelay={50}>
                                            <HoverCardTrigger asChild>
                                                <div className="group flex items-center gap-3 py-2.5 px-1 shrink-0 cursor-default">
                                                    <div className="transition-all duration-500 ease-out opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">
                                                        <Image src={item.icon} alt={item.name} width={20} height={20} unoptimized={item.icon.endsWith('.svg')} />
                                                    </div>
                                                    <span className="text-sm tracking-wide text-muted-foreground transition-colors duration-500 ease-out group-hover:text-foreground">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent
                                                side="top"
                                                align="center"
                                                className="w-auto p-4 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                                                <div className="absolute inset-0 bg-linear-to-tr from-foreground/5 to-transparent pointer-events-none" />

                                                <div className="relative p-3 rounded-xl bg-secondary/50 ring-1 ring-border/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                    <Image src={item.icon} alt={item.name} width={36} height={36} className="drop-shadow-lg" unoptimized={item.icon.endsWith('.svg')} />
                                                </div>
                                                <div className="flex flex-col items-center justify-center gap-1 z-10">
                                                    <span className="text-sm font-bold tracking-[0.15em] uppercase text-foreground">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                                                        {category.title}
                                                    </span>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    ))}
                                </div>
                            </div>
                        </BlurReveal>
                    ))}
                </div>

            </div>
        </section>
    );
}
