import { useEffect } from "react";
import { useLenis } from "@/common/providers/smooth-scroll-provider";

export function useLenisModal(open: boolean) {
    const lenis = useLenis();

    useEffect(() => {
        if (open) {
            lenis?.stop();
        } else {
            lenis?.start();
        }
    }, [open, lenis]);
}
