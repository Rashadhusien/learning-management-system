"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useReducer } from "react";

type Theme = "light" | "dark" | "blue" | "red";

interface ThemeState {
  theme: Theme;
  isClient: boolean;
}

type ThemeAction =
  | { type: "INITIALIZE"; theme: Theme }
  | { type: "CHANGE"; theme: Theme };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "INITIALIZE":
      return { ...state, theme: action.theme, isClient: true };
    case "CHANGE":
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

export function ThemeSwitcher() {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: "light",
    isClient: false,
  });

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    root.classList.remove("light", "dark", "blue", "red");

    root.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
  };

  // Initialize on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = storedTheme || systemTheme;

    dispatch({ type: "INITIALIZE", theme: initialTheme });
    applyTheme(initialTheme);
  }, []);

  // Apply theme when theme changes
  useEffect(() => {
    if (state.isClient) {
      applyTheme(state.theme);
    }
  }, [state.theme, state.isClient]);

  const handleThemeChange = (newTheme: Theme) => {
    dispatch({ type: "CHANGE", theme: newTheme });
  };

  const getThemeIcon = () => {
    switch (state.theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "blue":
        return <div className="h-4 w-4 bg-blue-500 rounded-full" />;
      case "red":
        return <div className="h-4 w-4 bg-red-500 rounded-full" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {getThemeIcon()}
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("blue")}>
          <div className="mr-2 h-4 w-4 bg-blue-500 rounded-full" />
          <span>Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("red")}>
          <div className="mr-2 h-4 w-4 bg-red-500 rounded-full" />
          <span>Red</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
