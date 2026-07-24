"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations, useMessages } from "next-intl";
import { BlurReveal } from "@/common/components/effects/blur-reveal";
import { sanitizePhone } from "@/common/utils/number";
import { ShineButton } from "@/common/components/atoms/button/button.shine";

type SharedContactMessages = {
  contact?: {
    email?: string;
    phone?: string;
  };
  social?: Array<{
    label: string;
    href: string;
  }>;
};

export default function Contact() {
  const t = useTranslations("Contact");
  const messages = useMessages() as unknown as SharedContactMessages;

  const contactInfo = messages.contact || { email: "", phone: "" };
  const socialLinks = messages.social || [];

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-background pt-24 md:pt-32 xl:pt-48">
      <div className="relative z-10 container mx-auto px-container">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="mb-16 flex flex-col gap-4 lg:mb-32">
            <BlurReveal>
              <span className="title-counter">[005]</span>
            </BlurReveal>

            <BlurReveal>
              <h2 className="title">{t("title")}</h2>
            </BlurReveal>
            <BlurReveal>
              <p className="mt-3 max-w-xl text-lg font-medium tracking-tight text-foreground/60 italic">
                {t("introText")}
              </p>
            </BlurReveal>
          </div>
        </div>

        <div className="mx-auto mb-12 flex w-full max-w-5xl flex-col border-t border-border/50 sm:mb-24 xl:mb-40">
          <BlurReveal>
            <a
              href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(t("sendEmailSubject"))}&body=${encodeURIComponent(t("sendEmailBody"))}`}
              className="group flex flex-col justify-between border-b border-border/50 py-10 transition-transform duration-700 hover:translate-x-2 md:flex-row md:items-center md:py-14"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mb-4 font-mono text-sm tracking-widest text-muted-foreground uppercase transition-colors duration-500 group-hover:text-foreground md:mb-0">
                {t("sendEmail")}
              </span>
              <div className="flex items-center gap-8">
                <span className="origin-left text-2xl font-semibold tracking-tight text-foreground transition-[color,transform] duration-500 group-hover:scale-[1.02] group-hover:text-primary md:origin-right lg:text-3xl">
                  {contactInfo.email}
                </span>
                <div className="hidden h-10 w-10 shrink-0 -translate-x-8 items-center justify-center rounded-full border border-border/50 bg-background opacity-0 transition-[background-color,border-color,opacity,transform] duration-700 group-hover:translate-x-0 group-hover:border-foreground group-hover:bg-foreground group-hover:opacity-100 md:flex">
                  <ArrowUpRight className="h-6 w-6 text-foreground transition-colors duration-500 group-hover:text-background" />
                </div>
              </div>
            </a>
          </BlurReveal>
          <BlurReveal>
            <a
              href={`tel:${sanitizePhone(contactInfo.phone || "")}`}
              className="group flex flex-col justify-between border-b border-border/50 py-10 transition-transform duration-700 hover:translate-x-2 md:flex-row md:items-center md:py-14"
            >
              <span className="mb-4 font-mono text-sm tracking-widest text-muted-foreground uppercase transition-colors duration-500 group-hover:text-foreground md:mb-0">
                {t("directLine")}
              </span>
              <div className="flex items-center gap-8">
                <span className="origin-left text-2xl font-semibold tracking-tight text-foreground transition-[color,transform] duration-500 group-hover:scale-[1.02] group-hover:text-primary md:origin-right lg:text-3xl">
                  {contactInfo.phone}
                </span>
                <div className="hidden h-10 w-10 shrink-0 -translate-x-8 items-center justify-center rounded-full border border-border/50 bg-background opacity-0 transition-[background-color,border-color,opacity,transform] duration-700 group-hover:translate-x-0 group-hover:border-foreground group-hover:bg-foreground group-hover:opacity-100 md:flex">
                  <ArrowUpRight className="h-6 w-6 text-foreground transition-colors duration-500 group-hover:text-background" />
                </div>
              </div>
            </a>
          </BlurReveal>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-8 border-border/50 pb-12 md:flex-row xl:border-t xl:py-12">
          <div className="flex items-center gap-4 font-mono text-sm tracking-widest text-muted-foreground uppercase max-xl:hidden">
            <span>© 2026</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            <span>QUANNGYNX. {t("allRightsReserved")}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((link: { label: string; href: string }) => (
              <BlurReveal key={link.label}>
                <ShineButton
                  href={link.href}
                  className="h-14 px-8"
                  shineClassName="w-6 bg-background/20 dark:bg-background/20"
                >
                  <span className="relative z-10 flex items-center gap-3 text-sm font-medium tracking-widest uppercase">
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </ShineButton>
              </BlurReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
