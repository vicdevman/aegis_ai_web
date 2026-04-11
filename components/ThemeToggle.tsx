"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className="p-2 ml-4 rounded-xl w-9 h-9 flex items-center justify-center bg-slate-200 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-white/10 opacity-50 cursor-not-allowed" 
        disabled
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors ring-1 ring-slate-300 dark:ring-white/10 flex items-center justify-center cursor-pointer relative"
      aria-label="Toggle theme"
    >
      <Sun className="h-4.5 w-4.5 transition-all dark:-rotate-90 dark:opacity-0 opacity-100 rotate-0" />
      <Moon className="absolute h-4.5 w-4.5 transition-all rotate-90 opacity-0 dark:rotate-0 dark:opacity-100" />
    </button>
  );
}
