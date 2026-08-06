import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/common/components/atoms/dialog";

import { useTranslations } from "next-intl";
import { useLenisModal } from "@/common/hooks/use-lenis-modal";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  useLenisModal(open);
  const tModals = useTranslations("Modals");
  const tAbout = useTranslations("About");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="flex max-h-[85vh] flex-col gap-0 border-border/50 bg-background/95 p-0 backdrop-blur-xl sm:max-w-160"
      >
        <div className="absolute top-0 right-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative shrink-0 px-8 pt-8 pb-4">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {tModals("aboutTitle")}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div
          className="flex-1 overflow-y-auto px-8 pt-2 pb-8"
          data-lenis-prevent="true"
        >
          <div className="flex flex-col gap-6">
            <div className="text-sm leading-relaxed font-light text-foreground/80">
              {tAbout("full")}
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </DialogContent>
    </Dialog>
  );
}
