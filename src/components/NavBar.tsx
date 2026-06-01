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
    <nav className="site-nav sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center min-h-[4.5rem] py-2 gap-x-4 gap-y-2">
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
          <div className="flex gap-2 sm:gap-3 items-center flex-wrap justify-end">
            {status === "loading" ? (
              <div className="animate-pulse w-32 h-8 bg-white/20 rounded-xl" />
            ) : session ? (
              <>
                <Link href="/dashboard" className="site-nav-link">{t.nav.dashboard}</Link>
                {((session.user as any)?.role === "developer" || (session.user as any)?.role === "funcionario") && (
                  <Link href="/admin" className="site-nav-admin">{t.nav.admin}</Link>
                )}
                <Link href="/favoritos" className="site-nav-link flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  {t.nav.favorites}
                </Link>
                <Link href="/profile" className="site-nav-link">{t.nav.profile}</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="site-nav-button">{t.nav.logout}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="site-nav-link">{t.nav.login}</Link>
                <Link href="/register" className="site-nav-cta">{t.nav.register}</Link>
              </>
            )}
            <div className="site-language-switch flex items-center gap-1 rounded-xl p-1">
              <Globe className="w-3.5 h-3.5 text-white/75 ml-1" />
              <button onClick={() => setLang("es")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${lang === "es" ? "bg-white text-brand-primary" : "text-white/75 hover:text-white"}`}>
                ES
              </button>
              <button onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${lang === "en" ? "bg-white text-brand-primary" : "text-white/75 hover:text-white"}`}>
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
