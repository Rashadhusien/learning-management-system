"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "blue" | "red";

const THEMES: Theme[] = ["light", "dark", "blue", "red"];

// ✅ Single atomic apply — no rAF, no setTimeout, no double-hop
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Remove only the current theme class, not all 4 every time
  THEMES.forEach((t) => root.classList.remove(t));
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// ✅ Read synchronously — no async, no delay
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("theme") as Theme;
    if (stored && THEMES.includes(stored)) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

const themeIcons: Record<Theme, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  blue: (
    <div className="h-4 w-4 rounded-full bg-blue-500" aria-label="Blue theme" />
  ),
  red: (
    <div className="h-4 w-4 rounded-full bg-red-500" aria-label="Red theme" />
  ),
};

const themeLabels: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  blue: "Blue",
  red: "Red",
};

export function ThemeSwitcher() {
  // ✅ Initialize directly from localStorage — no flash, no reducer needed
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  // ✅ Single effect, only for system theme change listener
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't manually set a theme
      if (!localStorage.getItem("theme")) {
        const next: Theme = e.matches ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const handleChange = (next: Theme) => {
    if (next === theme) return; // ✅ bail if same theme — no unnecessary DOM ops
    setTheme(next);
    applyTheme(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Current theme: ${themeLabels[theme]}`}
        >
          {themeIcons[theme]}
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => handleChange(t)}
            className={theme === t ? "bg-muted" : ""}
          >
            {themeIcons[t]}
            <span className="ml-2">{themeLabels[t]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
