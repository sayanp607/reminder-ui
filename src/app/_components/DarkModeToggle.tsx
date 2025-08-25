"use client";
import React, { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setDarkMode((d) => !d)}
        className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 font-semibold shadow hover:bg-gray-700 dark:hover:bg-gray-300 transition"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
