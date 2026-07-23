import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

import { BaseLayout } from "@/common/components/templates";
import { Locale, routing } from "@/common/i18n/routes";
import { ThemeProvider } from "@/common/providers/theme-provider";
import { CustomCursor } from "@/common/components/atoms/cursor";
import { Preloader } from "@/common/components/atoms/loader/preloader";
import SmoothScroll from "@/common/providers/smooth-scroll-provider";
import Navbar from "@/common/components/molecules/navigation/navbar";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Quanngynx",
    description: "Creative Developer Portfolio",
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'cyan' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<RootLayoutProps>) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    return (
        <BaseLayout locale={locale}>
            <div className={`${inter.variable} ${syne.variable} font-sans bg-background text-foreground antialiased`} suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                >
                    <CustomCursor />
                    <Preloader />
                    <SmoothScroll>
                        <Navbar />
                        {children}
                    </SmoothScroll>
                </ThemeProvider>
            </div>
        </BaseLayout>
    );
}
