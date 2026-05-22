import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Organics by Awan Farms",
  description:
    "Agentic AI dairy farm delivery and management system for Organics by Awan Farms."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
