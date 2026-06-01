"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Globe, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";

export default function NavBar() {
  const { data: session, status } = useSession();
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-brand-primary via-brand-primary to-brand-primary-light border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center min-h-[4.5rem] py-2 gap-x-4 gap-y-1">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="TRAMIX Logo"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <span className="sr-only">TRAMIX</span>
          </Link>

          <div className="flex gap-3 sm:gap-4 items-center flex-wrap">
            {status === "loading" ? (
              <div className="animate-pulse flex gap-2">
                <div className="w-20 h-8 bg-white/20 rounded-lg" />
                <div className="w-20 h-8 bg-white/20 rounded-lg" />
              </div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-white text-sm font-semibold hover:text-brand-secondary-light transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {t.nav.dashboard}
                </Link>
                {((session.user as any)?.role === "developer" || (session.user as any)?.role === "funcionario") && (
                  <Link
                    href="/admin"
                    className="text-sm font-bold bg-gradient-to-r from-brand-accent/80 to-brand-accent text-brand-primary-dark px-4 py-2 rounded-lg hover:from-brand-accent to-brand-accent-light transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    {t.nav.admin}
                  </Link>
                )}
                <Link
                  href="/favoritos"
                  className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-brand-secondary-light transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  <Heart className="w-4 h-4" />
                  {t.nav.favorites}
                </Link>
                <Link
                  href="/profile"
                  className="text-white text-sm font-medium hover:text-brand-secondary-light transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {t.nav.profile}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg border border-white/20 transition-all text-sm font-semibold backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white text-sm font-medium hover:text-brand-secondary-light transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-brand-secondary to-brand-secondary-light text-brand-primary-dark font-bold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 shadow-md text-sm"
                >
                  {t.nav.register}
                </Link>
              </>
            )}

            {/* HU-36: Selector de idioma */}
            <div className="flex items-center gap-1 bg-white/15 rounded-lg p-1 backdrop-blur-sm border border-white/10">
              <Globe className="w-4 h-4 text-white/70 ml-1" />
              <button
                onClick={() => setLang("es")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  lang === "es"
                    ? "bg-white text-brand-primary shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  lang === "en"
                    ? "bg-white text-brand-primary shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
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
