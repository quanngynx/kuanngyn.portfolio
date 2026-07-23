"use client";

import { cn } from "@/common/utils";
import { MoonIcon, SunIcon } from "../icons";
import { useThemeSwitcher } from "./hooks";

export function ThemeSwitcher() {
   const [darkMode, setDarkMode] = useThemeSwitcher();

   const handleThemeMode = () => {
      setDarkMode(darkMode === "dark" ? "light" : "dark");
   };

   return (
      <button
         onClick={handleThemeMode}
         className={cn(
            `ml-3 flex items-center justify-center rounded-full p-1 ${
            darkMode === "light" ? "bg-dark text-light" : "bg-light text-dark"
         }`,
         )}
      >
         {darkMode === "dark" ? (
            <SunIcon className="w-full h-auto fill-dark" />
         ) : (
            <MoonIcon className="w-full h-auto fill-dark" />
         )}
      </button>
   );
}

