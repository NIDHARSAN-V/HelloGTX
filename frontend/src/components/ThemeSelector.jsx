"use client"

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";

const themes = [
  { name: "Default", value: "" },
  { name: "Tropical", value: "theme-tropical" },
  { name: "Sunset", value: "theme-sunset" },
  { name: "Ocean", value: "theme-ocean" },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("");

  useEffect(() => {
    // Get the current theme from localStorage or default to ""
    const savedTheme = localStorage.getItem("color-theme") || "";
    setCurrentTheme(savedTheme);

    // Apply the theme to the document element
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "").trim();

    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  const handleThemeChange = (theme) => {
    // Remove any existing theme classes
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "").trim();

    // Add the new theme class if it's not the default
    if (theme) {
      document.documentElement.classList.add(theme);
    }

    // Save the theme preference
    localStorage.setItem("color-theme", theme);
    setCurrentTheme(theme);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => {
          const nextTheme =
            themes[(themes.findIndex((t) => t.value === currentTheme) + 1) % themes.length].value;
          handleThemeChange(nextTheme);
        }}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <Palette className="h-5 w-5" />
        <span className="sr-only">Change color theme</span>
      </button>
    </div>
  );
}