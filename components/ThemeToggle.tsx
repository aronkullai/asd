"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="inline-grid h-11 w-11 place-items-center rounded-card border border-line bg-white text-navy transition hover:bg-soft focus:outline-none focus:ring-4 focus:ring-accent/25 dark:bg-slate-900 dark:text-slate-100"
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
