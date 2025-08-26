import type React from "react";
import type { Metadata } from "next";
import {
  Playfair_Display,
  Source_Sans_3,
  Montagu_Slab,
} from "next/font/google";
import "./globals.css";

const playfair = Montagu_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montagu",
  weight: ["400", "700"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Shanki | Memories",
  description: "Memories of ShAnki",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-montagu antialiased">{children}</body>
    </html>
  );
}
