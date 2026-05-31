"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";
import { ArrowRight, Bot, LayoutGrid, MapPin, Sparkles } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const features = [
    { title: t.home.feature1Title, desc: t.home.feature1Desc, icon: LayoutGrid },
    { title: t.home.feature2Title, desc: t.home.feature2Desc, icon: Bot },
    { title: t.home.feature3Title, desc: t.home.feature3Desc, icon: MapPin },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <section className="relative min-h-[78vh] flex flex-col items-center justify-center text-center px-6 py-16 rounded-[2.5rem] tramix-card overflow-hidden animate-fade-up">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/[0.06] via-transparent to-brand-secondary/[0.08] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,36rem)] h-64 bg-gradient-to-r from-brand-primary/5 via-brand-secondary/10 to-brand-primary/5 rounded-full blur-3xl opacity-80" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/15 text-brand-primary-dark text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-secondary" />
            {t.home.badge}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-brand-primary-dark mb-6 leading-[1.08]">
            {t.home.heading}{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-primary-dark to-brand-secondary">
                TRAMIX
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-brand-primary/40 via-brand-secondary/60 to-brand-primary/40" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            {session ? (
              <Link
                href="/dashboard"
                className="tramix-btn-primary group text-white font-bold text-lg px-10 py-4 rounded-2xl min-h-[44px] hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {t.home.ctaDashboard}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="tramix-btn-primary group text-white font-bold text-lg px-10 py-4 rounded-2xl min-h-[44px] hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {t.home.ctaLogin}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="group bg-white/90 border-2 border-brand-secondary/40 text-brand-primary-dark font-bold text-lg px-10 py-4 rounded-2xl min-h-[44px] hover:border-brand-secondary hover:bg-brand-secondary/10 hover:-translate-y-0.5 transition-all shadow-md shadow-brand-secondary/10 w-full sm:w-auto flex items-center justify-center"
                >
                  {t.home.ctaRegister}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map(({ title, desc, icon: Icon }, i) => (
          <article
            key={title}
            className="group tramix-card rounded-3xl p-7 hover:-translate-y-1 transition-all duration-300"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/15 to-brand-secondary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner">
              <Icon className="w-7 h-7 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-brand-primary-dark mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
