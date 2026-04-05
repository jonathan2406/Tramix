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
import Image from "next/image";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-brand-bg antialiased`} suppressHydrationWarning>
        <Providers>
          <nav className="bg-brand-primary text-white shadow-xl border-b border-brand-primary-dark/20 sticky top-0 z-50 backdrop-blur-sm bg-brand-primary/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-between items-center min-h-[4.5rem] py-2 gap-x-4 gap-y-1">
                <Link href="/" className="flex items-center gap-2 transition-transform active:scale-95">
                  <Image 
                    src="/logo.png" 
                    alt="TRAMIX Logo" 
                    width={160} 
                    height={40} 
                    className="h-10 w-auto object-contain"
                    priority
                  />
                  <span className="sr-only">TRAMIX</span>
                </Link>
                <div className="flex gap-4 items-center flex-wrap">
                  {session ? (
                    <>
                      <Link href="/dashboard" className="hover:text-brand-secondary transition-colors text-sm font-medium">Dashboard</Link>
                      <Link href="/profile" className="hover:text-brand-secondary transition-colors text-sm font-medium">Mi Perfil</Link>
                      <a href="/api/auth/signout" className="bg-brand-primary-dark/40 px-4 py-2 rounded-xl hover:bg-brand-primary-dark/60 border border-white/10 transition-all text-sm font-semibold">Salir</a>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="hover:text-brand-secondary transition-colors text-sm font-medium">Iniciar Sesión</Link>
                      <Link href="/register" className="bg-brand-secondary text-brand-primary-dark font-bold px-5 py-2.5 rounded-xl hover:bg-brand-secondary-dark transition-all transform hover:scale-105 shadow-md text-sm">Registro</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
