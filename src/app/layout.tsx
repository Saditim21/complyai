import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";

import { ToastProvider } from "@/components/shared/ToastProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClarionAI — EU AI Act Compliance Made Simple",
  description:
    "ClarionAI helps EU businesses comply with the EU AI Act. Inventory your AI systems, classify risk, and generate required compliance documents before the August 2026 deadline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
