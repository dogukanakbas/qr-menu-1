"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
      console.log("Applying theme:", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      }
      // Force re-render by triggering a custom event
      window.dispatchEvent(new Event("themechange"));
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log("Toggle theme clicked, current theme:", theme);
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      console.log("New theme:", newTheme);
      return newTheme;
    });
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Theme Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Button clicked!");
          toggleTheme();
        }}
        className="fixed top-6 right-6 z-[100] p-3 rounded-full bg-black/90 dark:bg-black/90 bg-white/90 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-110 group shadow-lg cursor-pointer"
        aria-label="Toggle theme"
        type="button"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-200 transition-colors" />
        ) : (
          <Moon className="w-5 h-5 text-yellow-400 group-hover:text-yellow-200 transition-colors" />
        )}
      </button>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
