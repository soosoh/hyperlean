import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hyperlean — Prove theorems, level up",
  description:
    "A gamified, keyboard-first environment for formal mathematical theorem proving.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg font-sans text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
