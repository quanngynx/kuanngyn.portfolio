import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/common/components/atoms/dialog";

import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { useTranslations, useMessages } from "next-intl";
import { useLenisModal } from "@/common/hooks/use-lenis-modal";
import { sanitizePhone } from "@/common/utils/number";
import { ShineButton } from "@/common/components/atoms/button/button.shine";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SharedContactModalMessages = {
  contact?: {
    email?: string;
    phone?: string;
  };
  social?: Array<{
    label: string;
    href: string;
  }>;
};

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  useLenisModal(open);

  const tModals = useTranslations("Modals");
  const messages = useMessages() as unknown as SharedContactModalMessages;

  const contactInfo = messages.contact || { email: "", phone: "" };
  const socialLinks = messages.social || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="flex max-h-[85vh] flex-col gap-0 overflow-hidden border-border/50 bg-background/95 p-0 backdrop-blur-xl sm:max-w-[560px]"
      >
        <div className="absolute top-0 right-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative shrink-0 px-8 pt-8 pb-4">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {tModals("contactTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {tModals("contactDescription")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div
          className="flex-1 overflow-y-auto px-8 pt-2 pb-8"
          data-lenis-prevent="true"
        >
          <div className="mt-2 flex flex-col flex-wrap gap-4 sm:flex-row">
            <a
              href={`mailto:${contactInfo.email}`}
              className="group flex items-center gap-4 rounded-full border border-border/50 bg-secondary/20 px-5 py-2.5 backdrop-blur-sm transition-[background-color,border-color] duration-500 ease-out hover:border-foreground/30 hover:bg-foreground"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background transition-transform duration-500 group-hover:scale-110 group-hover:bg-background">
                <Mail className="h-3.5 w-3.5 text-foreground" />
              </div>
              <span className="text-sm font-medium tracking-wide text-foreground transition-colors duration-500 group-hover:text-background">
                {contactInfo.email}
              </span>
            </a>

            <a
              href={`tel:${sanitizePhone(contactInfo.phone || "")}`}
              className="group flex items-center gap-4 rounded-full border border-border/50 bg-secondary/20 px-5 py-2.5 backdrop-blur-sm transition-[background-color,border-color] duration-500 ease-out hover:border-foreground/30 hover:bg-foreground"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background transition-transform duration-500 group-hover:scale-110 group-hover:bg-background">
                <Phone className="h-3.5 w-3.5 text-foreground" />
              </div>
              <span className="text-sm font-medium tracking-wide text-foreground transition-colors duration-500 group-hover:text-background">
                {contactInfo.phone}
              </span>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {socialLinks.map((link: { label: string; href: string }) => (
              <div key={link.label}>
                <ShineButton
                  href={link.href}
                  className="h-10 px-5"
                  shineClassName="w-4 bg-background/20 dark:bg-background/20"
                >
                  <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </ShineButton>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </DialogContent>
    </Dialog>
  );
}
