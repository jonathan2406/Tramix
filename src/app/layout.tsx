import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRAMIX MVP",
  description: "Plataforma digital inteligente para trámites.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <nav className="bg-blue-700 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-between items-center min-h-[3.5rem] py-2 gap-x-4 gap-y-1">
                <Link href="/" className="font-bold text-xl tracking-tight shrink-0">TRAMIX</Link>
                <div className="flex gap-3 items-center flex-wrap">
                  {session ? (
                    <>
                      <Link href="/dashboard" className="hover:text-blue-200 text-sm">Dashboard</Link>
                      <Link href="/profile" className="hover:text-blue-200 text-sm">Mi Perfil</Link>
                      <a href="/api/auth/signout" className="bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-800 transition text-sm">Salir</a>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="hover:text-blue-200 text-sm">Iniciar Sesión</Link>
                      <Link href="/register" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm">Registro</Link>
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
