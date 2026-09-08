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
  title: "Organization Name | Recruitment Portal",
  description: "Recruitment portal for Organization Name",
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
