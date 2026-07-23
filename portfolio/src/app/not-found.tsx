import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/common/components/atoms/cursor";
import { NotFoundContent } from "@/common/components/organisms/not-found-content";
import enDict from "@/common/i18n/en.json";
import { ThemeProvider } from "@/common/providers/theme-provider";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "404 - Page Not Found",
  description: "Page not found.",
};

export default function RootNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>404 - Page Not Found</title>
      </head>
      <body className={`${inter.variable} ${syne.variable} font-sans bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <CustomCursor />
          <NotFoundContent dict={{ notFound: enDict.NotFound }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
