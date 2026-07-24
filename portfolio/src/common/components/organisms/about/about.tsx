"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { BlurReveal } from "@/common/components/effects/blur-reveal";
import { AboutModal } from "@/common/components/molecules/modals/about-modal";
import { HangingProfile } from "@/common/components/widgets/hanging-profile";

export default function About() {
  const t = useTranslations("About");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="container-void relative w-full overflow-hidden bg-background text-foreground">
      <div className="container mx-auto px-container">
        <div className="flex flex-col gap-12 xl:flex-row xl:gap-32">
          <div className="xl:w-1/4">
            <div className="sticky top-32 flex flex-col gap-4">
              <BlurReveal>
                <span className="title-counter">[001]</span>
              </BlurReveal>

              <BlurReveal>
                <h2 className="title relative z-10">{t("title")}</h2>
              </BlurReveal>

              <BlurReveal>
                <div className="mt-8 hidden xl:block">
                  <HangingProfile />
                </div>
              </BlurReveal>
            </div>
          </div>

          <div className="flex flex-col gap-24 xl:w-3/4">
            <div className="space-y-12">
              <BlurReveal>
                <h3 className="text-3xl leading-[1.1] font-light md:text-5xl lg:text-6xl">
                  {t("intro")}
                </h3>
              </BlurReveal>

              <BlurReveal>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {t("description")}
                </p>
              </BlurReveal>

              <BlurReveal>
                <>
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="group relative inline-flex cursor-pointer items-center gap-2 py-2 text-xl font-medium md:text-2xl"
                  >
                    <span className="relative z-10 border-b-2 border-foreground/30 pb-1 transition-[border-color] duration-300 group-hover:border-foreground">
                      {t("readFullVersion")}
                    </span>
                    <ArrowRight className="h-6 w-6" />
                  </button>

                  <AboutModal open={isOpen} onOpenChange={setIsOpen} />
                </>
              </BlurReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
