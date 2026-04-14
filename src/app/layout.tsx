import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRAMIX",
  description: "Plataforma digital inteligente para trámites.",
};
import NavBar from "@/components/NavBar";
import Image from "next/image";
import AccessibilityControls from "@/components/AccessibilityControls";
import ChatBot from "@/components/ChatBot";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-brand-bg antialiased`} suppressHydrationWarning>
        <Providers>
          <NavBar />
          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <AccessibilityControls />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
