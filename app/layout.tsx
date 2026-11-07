import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Hyperlean",
  description: "Gamified, keyboard-first formal theorem proving",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <html lang="en" className="dark">
      <body style={{ margin: 0, background: "#0A0F1D", color: "#F8FAFC" }}>
        {children}
      </body>
    </html>
  );
}
