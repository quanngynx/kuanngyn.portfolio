import { clsx } from 'clsx';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { StyledComponentsRegistry } from '@/common/configs';

import "@radix-ui/themes/styles.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

type Props = {
    children: ReactNode;
    locale: string;
};

export async function BaseLayout({
    children,
    locale
}: Props) {
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={clsx(geistSans.variable, geistMono.variable)} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <StyledComponentsRegistry>
                        {children}
                        <Toaster richColors />
                    </StyledComponentsRegistry>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}