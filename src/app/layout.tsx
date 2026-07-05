import type { Metadata } from "next";
import { Golos_Text, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

// Display face — used sparingly for headlines. Geometric and confident,
// with full Cyrillic support (required for Mongolian).
const golosText = Golos_Text({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "900"],
});

// Body face — clean, highly legible in both Latin and Cyrillic at small
// sizes, used for all running text and UI labels.
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

// Utility/data face — used for prices, mileage, specs: anywhere precise
// numbers matter, tabular figures read like a spec sheet.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-data",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bogd Automall",
    template: "%s | Bogd Automall",
  },
  description:
    "Bogd Automall — premium vehicle dealership. Browse our inventory of quality vehicles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Default language is Mongolian (mn) per project requirements.
  // The mn/en language toggle is implemented in Phase 3 (in progress).
  return (
    <html
      lang="mn"
      suppressHydrationWarning
      className={`${golosText.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
