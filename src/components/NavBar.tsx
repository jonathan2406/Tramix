"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Globe } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";

export default function NavBar() {
  const { data: session, status } = useSession();
  const { lang, setLang, t } = useLanguage();

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
                <Link href="/dashboard" className="hover:text-brand-secondary transition-colors text-sm font-medium">{t.nav.dashboard}</Link>
                {((session.user as any)?.role === "developer" || (session.user as any)?.role === "funcionario") && (
                  <Link href="/admin" className="hover:text-brand-secondary transition-colors text-sm font-bold border border-white/20 px-3 py-1 rounded shadow-sm bg-brand-primary-dark/20 text-yellow-300">{t.nav.admin}</Link>
                )}
                <Link href="/favoritos" className="flex items-center gap-1.5 hover:text-brand-secondary transition-colors text-sm font-medium">
                  <Heart className="w-4 h-4" />
                  {t.nav.favorites}
                </Link>
                <Link href="/profile" className="hover:text-brand-secondary transition-colors text-sm font-medium">{t.nav.profile}</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-brand-primary-dark/40 px-4 py-2 rounded-xl hover:bg-brand-primary-dark/60 border border-white/10 transition-all text-sm font-semibold">{t.nav.logout}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-brand-secondary transition-colors text-sm font-medium">{t.nav.login}</Link>
                <Link href="/register" className="bg-brand-secondary text-brand-primary-dark font-bold px-5 py-2.5 rounded-xl hover:bg-brand-secondary-dark transition-all transform hover:scale-105 shadow-md text-sm">{t.nav.register}</Link>
              </>
            )}
            {/* HU-36: Selector de idioma */}
            <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
              <Globe className="w-3.5 h-3.5 text-white/70 ml-1" />
              <button onClick={() => setLang("es")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${lang === "es" ? "bg-white text-brand-primary" : "text-white/70 hover:text-white"}`}>
                ES
              </button>
              <button onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${lang === "en" ? "bg-white text-brand-primary" : "text-white/70 hover:text-white"}`}>
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
