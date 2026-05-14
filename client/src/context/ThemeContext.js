import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.body.style.background =
      theme === "dark" ? "#020617" : "#F8FAFC";

    document.body.style.color =
      theme === "dark" ? "#F8FAFC" : "#0F172A";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = {
    light: {
      page: "#F8FAFC",
      card: "#FFFFFF",
      text: "#0F172A",
      muted: "#64748B",
      border: "#E2E8F0",
      sidebar: "#0F172A",
    },
    dark: {
      page: "#020617",
      card: "#0F172A",
      text: "#F8FAFC",
      muted: "#94A3B8",
      border: "#1E293B",
      sidebar: "#020617",
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: colors[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}