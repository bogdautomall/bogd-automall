import type { Metadata } from "next";
import "./globals.css";

// Phase 1 uses a system font stack (zero external requests, fast first
// paint). Phase 3 will replace this with deliberately chosen brand
// typography per the visual identity work — see frontend-design guidance.

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
  // The mn/en language toggle is implemented in Phase 3.
  return (
    <html lang="mn" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
