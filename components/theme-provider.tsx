"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: NextThemesProviderProps) {
  return React.createElement(
    NextThemesProvider as React.ComponentType<any>,
    props,
    children,
  );
}
