"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { Heart } from "lucide-react";

export default function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-brand-primary/10 -z-10" />

      {/* Top border accent */}
      <div className="border-t border-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start mb-12">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 mb-4 group hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="TRAMIX"
                width={120}
                height={32}
                className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-slate-600 text-center md:text-left max-w-xs">
              Transformando la experiencia de trámites con tecnología accesible e inteligente.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-bold text-brand-primary-dark">Enlaces Rápidos</h3>
            <nav className="flex flex-col gap-2 text-center md:text-left">
              <Link href="/favoritos" className="text-sm text-slate-600 hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-1">
                <Heart className="w-3.5 h-3.5" />
                Favoritos
              </Link>
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-brand-primary transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Brand info */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-xs font-semibold text-brand-secondary-dark bg-brand-secondary/15 px-4 py-2 rounded-lg">
              Powered by TRAMIX
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs sm:text-sm text-slate-500 text-center md:text-left">
            © {year} TRAMIX — {t.home.trusted}
          </p>
          <p className="text-xs text-slate-500 text-center md:text-right">
            Diseñado para todos, accesible para todos
          </p>
        </div>
      </div>
    </footer>
  );
}
