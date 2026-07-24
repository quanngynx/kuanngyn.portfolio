import React from "react";
import { cn } from "@/common/utils/ui";

interface ShineButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
  shineClassName?: string;
}

export function ShineButton({
  href,
  className,
  children,
  shineClassName = "w-6 bg-background/20 dark:bg-background/20",
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: ShineButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? rel : undefined}
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background text-foreground shadow-sm transition-[color,background-color,border-color] duration-500 hover:border-foreground/30 hover:bg-foreground hover:text-background",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 flex h-full w-full -translate-x-full -skew-x-13 justify-center transition-transform duration-700 group-hover:translate-x-full">
        <div className={cn("relative h-full", shineClassName)} />
      </div>
      {children}
    </a>
  );
}
