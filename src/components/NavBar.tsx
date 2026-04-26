"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
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
            {status === "loading" ? (
              <div className="animate-pulse w-32 h-8 bg-white/20 rounded-xl" />
            ) : session ? (
              <>
                <Link href="/dashboard" className="hover:text-brand-secondary transition-colors text-sm font-medium">Dashboard</Link>
                {((session.user as any)?.role === "developer" || (session.user as any)?.role === "funcionario") && (
                  <Link href="/admin" className="hover:text-brand-secondary transition-colors text-sm font-bold border border-white/20 px-3 py-1 rounded shadow-sm bg-brand-primary-dark/20 text-yellow-300">Admin</Link>
                )}
                <Link href="/profile" className="hover:text-brand-secondary transition-colors text-sm font-medium">Mi Perfil</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="bg-brand-primary-dark/40 px-4 py-2 rounded-xl hover:bg-brand-primary-dark/60 border border-white/10 transition-all text-sm font-semibold">Salir</button>
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
  );
}
