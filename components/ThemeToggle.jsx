"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLight = mounted && resolvedTheme === "light";
  const label = isLight ? "Switch to dark theme" : "Switch to light theme";
  return (
    <button className="theme-toggle" type="button" onClick={() => setTheme(isLight ? "dark" : "light")} aria-label={label} title={label} disabled={!mounted}>
      {isLight ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </button>
  );
}
