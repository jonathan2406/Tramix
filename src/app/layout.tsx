import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "TRAMIX",
  description: "Plataforma digital inteligente para trámites.",
};
import NavBar from "@/components/NavBar";
import Image from "next/image";
import AccessibilityControls from "@/components/AccessibilityControls";
import ChatBot from "@/components/ChatBot";
import { LanguageProvider } from "@/components/LanguageContext";
import SiteFooter from "@/components/home/SiteFooter";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} ${inter.variable} ${display.variable} bg-brand-bg antialiased`} suppressHydrationWarning>
        <div className="tramix-page-bg" aria-hidden="true" />
        <Providers>
          <LanguageProvider>
            <div className="px-3 sm:px-4 pt-3 sm:pt-4">
              <NavBar />
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              {children}
            </main>
            <SiteFooter />
            <AccessibilityControls />
            <ChatBot />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
