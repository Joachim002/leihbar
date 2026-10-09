import type { Metadata } from "next";
import { Barlow, Saira_Stencil } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Überschriften und Standnummern: Saira Stencil (wie Markierungen auf Asphalt). Fließtext: Barlow.
const stencil = Saira_Stencil({ subsets: ["latin"], variable: "--font-saira-stencil", display: "swap" });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Leihbar", template: "%s – Leihbar" },
  description: "Leihen statt kaufen – Dinge am Campus anbieten, finden, anfragen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${stencil.variable} ${barlow.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
