// Font
import { Inter } from "next/font/google";
// Providers
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SubmissionsProvider } from "@/components/SubmissionsProvider";
import IntroExperience from "@/components/IntroExperience";
import ColorCursor from "@/components/ColorCursor";
// Styling
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "GDG VITC | Recruitment Portal 2026",
  description: "Apply to GDG on Campus, VIT Chennai departments for the 2026 recruitment cycle.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="portal-theme" disableTransitionOnChange>
        <SubmissionsProvider>
          <IntroExperience />
          <ColorCursor />
          {children}
          <Toaster />
        </SubmissionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
