import { Inter, Syne } from "next/font/google";
import { CustomCursor } from "@/common/components/atoms/cursor";
import { NotFoundContent } from "@/common/components/organisms/not-found-content";
import enDict from "@/common/i18n/en.json";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "404 - Page Not Found",
  description: "Page not found.",
};

export default function RootNotFound() {
  return (
    <div
      className={`${inter.variable} ${syne.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
    >
      <CustomCursor />
      <NotFoundContent dict={{ notFound: enDict.NotFound }} />
    </div>
  );
}
