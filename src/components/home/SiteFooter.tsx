"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

export default function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="TRAMIX" width={120} height={32} className="h-8 w-auto opacity-90" />
          </Link>
          <p className="text-sm text-slate-500 text-center md:text-right">
            &copy; {year} TRAMIX - {t.home.trusted}
          </p>
        </div>
      </div>
    </footer>
  );
}
