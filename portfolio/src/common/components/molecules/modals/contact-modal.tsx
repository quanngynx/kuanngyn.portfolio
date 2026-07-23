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

    const tModals = useTranslations('Modals');
    const messages = useMessages() as unknown as SharedContactModalMessages;

    const contactInfo = messages.contact || { email: '', phone: '' };
    const socialLinks = messages.social || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-[560px] max-h-[85vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="relative px-8 pt-8 pb-4 shrink-0">
                    <DialogHeader className="gap-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {tModals('contactTitle')}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            {tModals('contactDescription')}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="overflow-y-auto px-8 pb-8 pt-2 flex-1" data-lenis-prevent="true">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-2">
                        <a
                            href={`mailto:${contactInfo.email}`}
                            className="group flex items-center gap-4 px-5 py-2.5 rounded-full border border-border/50 bg-secondary/20 backdrop-blur-sm hover:bg-foreground hover:border-foreground/30 transition-all duration-500 ease-out"
                        >
                            <div className="w-8 h-8 rounded-full border border-border/50 bg-background flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-background transition-transform duration-500">
                                <Mail className="w-3.5 h-3.5 text-foreground" />
                            </div>
                            <span className="text-foreground tracking-wide font-medium text-sm group-hover:text-background transition-colors duration-500">
                                {contactInfo.email}
                            </span>
                        </a>

                        <a
                            href={`tel:${sanitizePhone(contactInfo.phone || '')}`}
                            className="group flex items-center gap-4 px-5 py-2.5 rounded-full border border-border/50 bg-secondary/20 backdrop-blur-sm hover:bg-foreground hover:border-foreground/30 transition-all duration-500 ease-out"
                        >
                            <div className="w-8 h-8 rounded-full border border-border/50 bg-background flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-background transition-transform duration-500">
                                <Phone className="w-3.5 h-3.5 text-foreground" />
                            </div>
                            <span className="text-foreground tracking-wide font-medium text-sm group-hover:text-background transition-colors duration-500">
                                {contactInfo.phone}
                            </span>
                        </a>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center mt-6">
                        {socialLinks.map((link: { label: string; href: string }) => (
                            <div key={link.label}>
                                <ShineButton
                                    href={link.href}
                                    className="h-10 px-5"
                                    shineClassName="w-4 bg-background/20 dark:bg-background/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-xs tracking-widest uppercase font-medium">
                                        {link.label}
                                        <ArrowUpRight className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </span>
                                </ShineButton>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
