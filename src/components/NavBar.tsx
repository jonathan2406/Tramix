"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Globe } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";

export default function NavBar() {
  const { data: session, status } = useSession();
  const { lang, setLang, t } = useLanguage();

  const navLink =
    "px-3 py-2 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all";

  return (
    <nav className="tramix-nav-float sticky top-3 sm:top-4 z-50 rounded-2xl max-w-7xl mx-auto">
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.07)_50%,transparent_65%)] pointer-events-none" />
      <div className="px-4 sm:px-6 relative">
        <div className="flex flex-wrap justify-between items-center min-h-[3.75rem] py-2 gap-x-4 gap-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Image
              src="/logo.png"
              alt="TRAMIX Logo"
              width={150}
              height={38}
              className="h-9 w-auto object-contain drop-shadow-md"
              priority
            />
            <span className="sr-only">TRAMIX</span>
          </Link>

          <div className="flex gap-1.5 sm:gap-2 items-center flex-wrap">
            {status === "loading" ? (
              <div className="animate-pulse w-28 h-9 bg-white/15 rounded-xl" />
            ) : session ? (
              <>
                <Link href="/dashboard" className={navLink}>
                  {t.nav.dashboard}
                </Link>
                {((session.user as { role?: string })?.role === "developer" ||
                  (session.user as { role?: string })?.role === "funcionario") && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-400/25 text-amber-50 border border-amber-300/35 hover:bg-amber-400/35 transition-all"
                  >
                    {t.nav.admin}
                  </Link>
                )}
                <Link href="/favoritos" className={`${navLink} flex items-center gap-1.5`}>
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.nav.favorites}</span>
                </Link>
                <Link href="/profile" className={navLink}>
                  {t.nav.profile}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 border border-white/15 hover:bg-white/20 transition-all"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={navLink}>
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-secondary text-brand-primary-dark hover:bg-brand-secondary-dark shadow-lg shadow-black/15 hover:-translate-y-0.5 transition-all"
                >
                  {t.nav.register}
                </Link>
              </>
            )}

            <div className="flex items-center gap-0.5 bg-black/20 rounded-xl p-1 border border-white/10 ml-1">
              <Globe className="w-3.5 h-3.5 text-white/50 hidden sm:block ml-1" />
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === "es" ? "bg-white text-brand-primary shadow-sm" : "text-white/65 hover:text-white"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === "en" ? "bg-white text-brand-primary shadow-sm" : "text-white/65 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
