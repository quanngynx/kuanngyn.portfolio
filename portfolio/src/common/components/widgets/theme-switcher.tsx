"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/atoms/dropdown-menu";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background/50 text-foreground shadow-sm backdrop-blur-md transition-[color,background-color,border-color] duration-500 hover:border-foreground/30 hover:bg-foreground hover:text-background focus:outline-none"
        >
          <div className="absolute inset-0 flex h-full w-full -translate-x-full -skew-x-13 justify-center transition-transform duration-700 group-hover:translate-x-full">
            <div className="relative h-full w-4 bg-background/20 dark:bg-background/20" />
          </div>
          <span className="relative z-10 flex items-center justify-center">
            <Sun className="h-4 w-4 scale-100 rotate-0 opacity-100 transition-[transform,opacity] duration-500 dark:scale-95 dark:-rotate-90 dark:opacity-0" />
            <Moon className="absolute h-4 w-4 scale-95 rotate-90 opacity-0 transition-[transform,opacity] duration-500 dark:scale-100 dark:rotate-0 dark:opacity-100" />
          </span>
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-120 min-w-[140px] rounded-2xl border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="my-0.5 cursor-pointer rounded-xl focus:bg-secondary"
        >
          <Sun className="mr-2 h-3.5 w-3.5" />
          <span className="text-xs tracking-widest uppercase">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="my-0.5 cursor-pointer rounded-xl focus:bg-secondary"
        >
          <Moon className="mr-2 h-3.5 w-3.5" />
          <span className="text-xs tracking-widest uppercase">Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSwitcher;
