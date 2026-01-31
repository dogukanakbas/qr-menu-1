"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-black/80 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-110 group"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-200 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-yellow-400 group-hover:text-yellow-200 transition-colors" />
      )}
    </button>
  );
}
