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
  const t = useTranslations("Stack");
  const messages = useMessages() as unknown as SharedMessages;
  const stackData = messages.stack || {};

  const categories = [
    {
      title: t("frontend"),
      items: stackData.frontend || [],
    },
    {
      title: t("backend"),
      items: stackData.backend || [],
    },
    {
      title: t("database"),
      items: stackData.database || [],
    },
    {
      title: t("tools"),
      items: stackData.tools || [],
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 text-foreground md:py-24 lg:py-32 xl:py-40 2xl:py-36">
      <div className="container mx-auto flex h-full flex-col px-container">
        <div className="mb-16 flex flex-col gap-4">
          <BlurReveal>
            <span className="title-counter">[002]</span>
          </BlurReveal>

          <BlurReveal>
            <h2 className="title">{t("title")}</h2>
          </BlurReveal>
        </div>

        <div className="mb-6 flex flex-col gap-container">
          {categories.map((category, catIndex) => (
            <BlurReveal key={category.title}>
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground/40">
                    0{catIndex + 1}
                  </span>
                  <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    {category.title}
                  </h3>
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-6">
                  {category.items.map((item: StackItem) => (
                    <HoverCard key={item.name} openDelay={50} closeDelay={50}>
                      <HoverCardTrigger asChild>
                        <div className="group flex shrink-0 cursor-default items-center gap-3 px-1 py-2.5">
                          <div className="opacity-50 grayscale transition-[opacity,filter,transform] duration-500 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={20}
                              height={20}
                              style={{ width: '20px', height: '20px' }}
                              unoptimized={item.icon.endsWith('.svg')}
                            />
                          </div>
                          <span className="text-sm tracking-wide text-muted-foreground transition-colors duration-500 ease-out group-hover:text-foreground">
                            {item.name}
                          </span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="flex w-auto flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-border/50 bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
                      >
                        <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-foreground/5 to-transparent" />

                        <div className="relative rounded-xl bg-secondary/50 p-3 shadow-inner ring-1 ring-border/50 transition-transform duration-500 group-hover:scale-110">
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={36}
                            height={36}
                            className='h-9 w-9 object-contain drop-shadow-lg'
                            style={{ width: '36px', height: '36px' }}
                            unoptimized={item.icon.endsWith('.svg')}
                          />
                        </div>
                        <div className="z-10 flex flex-col items-center justify-center gap-1">
                          <span className="text-sm font-bold tracking-[0.15em] text-foreground uppercase">
                            {item.name}
                          </span>
                          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
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
