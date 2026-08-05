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
    const tModals = useTranslations('Modals');
    const tAbout = useTranslations('About');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-160 max-h-[85vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="relative px-8 pt-8 pb-4 shrink-0">
                    <DialogHeader className="gap-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {tModals('aboutTitle')}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="overflow-y-auto px-8 pb-8 pt-2 flex-1" data-lenis-prevent="true">
                    <div className="flex flex-col gap-6">
                        <div className="text-sm text-foreground/80 leading-relaxed font-light">
                            {tAbout('full')}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
