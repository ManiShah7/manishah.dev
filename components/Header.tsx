"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Sun, Moon } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark = saved ? JSON.parse(saved) : prefersDark;
    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <div className="font-mono text-lg">
                <span className="text-gray-600 dark:text-gray-400">&lt;</span>
                <span className="text-gray-900 font-semibold dark:text-gray-100">
                  ManiShah
                </span>
                <span className="text-gray-600 dark:text-gray-400"> /&gt;</span>
              </div>
            </Link>
            <div className="w-9 h-9"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <div className="font-mono text-lg">
              <span className="text-gray-600 dark:text-gray-400">&lt;</span>
              <span className="text-gray-900 font-semibold dark:text-gray-100">
                ManiShah
              </span>
              <span className="text-gray-600 dark:text-gray-400"> /&gt;</span>
            </div>
          </Link>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
            type="button"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
