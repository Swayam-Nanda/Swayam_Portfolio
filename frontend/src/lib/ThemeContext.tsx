import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export const THEMES = {
  blue: { primary: "#5eb8ff", dark: "#1a90ad", highlight: "#93e5ff", light: "#ffffff" },
  gold: { primary: "#f4c46b", dark: "#d4a44b", highlight: "#fff3ad", light: "#ffffff" },
  white: { primary: "#f5f5f5", dark: "#a0a0a0", highlight: "#ffffff", light: "#ffffff" },
  crimson: { primary: "#ff5a5a", dark: "#b52a2a", highlight: "#ff9b9b", light: "#ffffff" },
  emerald: { primary: "#5ee3a8", dark: "#2a9060", highlight: "#b2ffdb", light: "#ffffff" },
  purple: { primary: "#b07bff", dark: "#7040b0", highlight: "#e1ccff", light: "#ffffff" },
};

export type ThemeId = keyof typeof THEMES;

interface ThemeContextType {
  activeTheme: ThemeId;
  themeColors: typeof THEMES[ThemeId];
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveThemeState] = useState<ThemeId>("blue");

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as ThemeId;
    if (savedTheme && THEMES[savedTheme]) {
      setActiveThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const setTheme = (id: ThemeId) => {
    setActiveThemeState(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("portfolio-theme", id);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, themeColors: THEMES[activeTheme], setTheme }}>
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
