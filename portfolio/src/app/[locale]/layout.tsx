import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BaseLayout } from "@/common/components/templates";
import { BASE_URL } from "@/common/constants";
import { isSupportedLocale, routing } from "@/common/i18n/routes";
import { CustomCursor } from "@/common/components/atoms/cursor";
import { Preloader } from "@/common/components/atoms/loader/preloader";
import SmoothScroll from "@/common/providers/smooth-scroll-provider";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Quanngynx",
  description: "Creative Developer Portfolio",
  alternates: {
    types: {
      "application/rss+xml": `${BASE_URL}/rss.xml`,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "cyan" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
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

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <BaseLayout>
      <div
        className={`${inter.variable} ${syne.variable} bg-background font-sans text-foreground antialiased`}
      >
        <CustomCursor />
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </div>
    </BaseLayout>
  );
}
