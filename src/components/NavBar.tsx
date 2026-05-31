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
    "px-3 py-2 rounded-xl text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-brand-primary-dark via-brand-primary to-brand-primary-dark shadow-lg shadow-brand-primary/25">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-wrap justify-between items-center min-h-[4.5rem] py-2 gap-x-4 gap-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Image
              src="/logo.png"
              alt="TRAMIX Logo"
              width={160}
              height={40}
              className="h-10 w-auto object-contain drop-shadow-sm"
              priority
            />
            <span className="sr-only">TRAMIX</span>
          </Link>

          <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
            {status === "loading" ? (
              <div className="animate-pulse w-32 h-9 bg-white/15 rounded-xl" />
            ) : session ? (
              <>
                <Link href="/dashboard" className={navLink}>
                  {t.nav.dashboard}
                </Link>
                {((session.user as { role?: string })?.role === "developer" ||
                  (session.user as { role?: string })?.role === "funcionario") && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 rounded-xl text-sm font-bold bg-amber-400/20 text-amber-100 border border-amber-300/30 hover:bg-amber-400/30 transition-all"
                  >
                    {t.nav.admin}
                  </Link>
                )}
                <Link href="/favoritos" className={`${navLink} flex items-center gap-1.5`}>
                  <Heart className="w-4 h-4" />
                  {t.nav.favorites}
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
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-secondary text-brand-primary-dark hover:bg-brand-secondary-dark shadow-md shadow-black/10 hover:-translate-y-0.5 transition-all"
                >
                  {t.nav.register}
                </Link>
              </>
            )}

            <div className="flex items-center gap-1 bg-black/15 rounded-xl p-1 border border-white/10">
              <Globe className="w-3.5 h-3.5 text-white/60 ml-1.5" />
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === "es"
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === "en"
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-white/70 hover:text-white"
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
