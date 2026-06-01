"use client";

import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";
import HeroMockup from "@/components/home/HeroMockup";
import SiteFooter from "@/components/home/SiteFooter";
import "./landing.css";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  LayoutGrid,
  MapPin,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "700", "800"],
});

export default function Home() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const stats = [
    { value: t.home.stat1Value, label: t.home.stat1Label },
    { value: t.home.stat2Value, label: t.home.stat2Label },
    { value: t.home.stat3Value, label: t.home.stat3Label },
  ];

  const steps = [
    { num: "01", title: t.home.step1Title, desc: t.home.step1Desc, icon: Zap },
    { num: "02", title: t.home.step2Title, desc: t.home.step2Desc, icon: LayoutGrid },
    { num: "03", title: t.home.step3Title, desc: t.home.step3Desc, icon: ChevronRight },
  ];

  const marqueeItems = t.home.trusted.split("·").map((s) => s.trim());

  return (
    <div className={`landing-root ${jakarta.variable} relative -mt-2 pb-4`}>
      <div className="landing-page-bg" aria-hidden="true" />
      {/* ─── HERO split ─── */}
      <section className="relative pt-8 pb-24 lg:pt-12 lg:pb-32">
        <div className="absolute top-12 right-0 w-[600px] h-[600px] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center relative z-10">
          <div className="text-center lg:text-left animate-landing-fade-up">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/85 border border-brand-primary/20 text-brand-primary-dark text-xs font-bold mb-8 shadow-lg shadow-brand-primary/10 backdrop-blur-md hover:shadow-xl hover:shadow-brand-primary/15 transition-all">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-secondary" />
              </span>
              <span>{t.home.badge}</span>
            </div>

            <h1 className="landing-display text-5xl sm:text-6xl xl:text-7xl font-extrabold text-brand-primary-dark leading-[1.1] mb-8">
              {t.home.heading}{" "}
              <span className="landing-gradient-text">TRAMIX</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {t.home.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {session ? (
                <Link
                  href="/dashboard"
                  className="landing-btn-primary group text-white font-bold text-base px-8 py-4 rounded-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  {t.home.ctaDashboard}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="landing-btn-primary group text-white font-bold text-base px-8 py-4 rounded-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {t.home.ctaRegister}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#como-funciona"
                    className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-brand-primary-dark bg-white/95 border-2 border-brand-primary/25 hover:border-brand-secondary/60 hover:bg-white hover:shadow-lg transition-all backdrop-blur-sm"
                  >
                    {t.home.ctaSecondary}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </>
              )}
            </div>

            {/* Stats row - Mejorados */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto lg:mx-0">
              {stats.map((s, idx) => (
                <div
                  key={s.label}
                  className="landing-stat-card rounded-2xl px-4 py-5 text-center lg:text-left hover:scale-105 transition-transform"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <p className="landing-display text-2xl sm:text-3xl font-extrabold landing-gradient-text">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-2 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pr-4">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ─── Marquee trust strip - Mejorada ─── */}
      <div className="relative my-20 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="py-6 border-y border-brand-primary/12 bg-gradient-to-r from-white/50 via-brand-secondary/8 to-white/50 backdrop-blur-sm rounded-2xl">
          <div className="landing-marquee-track">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={`${item}-${i}`} className="landing-marquee-item flex items-center gap-3 whitespace-nowrap">
                <Sparkles className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bento features - Mejorada ─── */}
      <section className="mb-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="landing-display text-4xl sm:text-5xl font-extrabold text-brand-primary-dark mb-4">
            {t.home.bentoTitle}
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">{t.home.bentoSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 auto-rows-[minmax(160px,auto)]">
          {/* Large highlight */}
          <article className="md:col-span-4 md:row-span-2 landing-bento-highlight rounded-3xl p-8 sm:p-12 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/8 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute top-8 right-8 w-24 h-24 border border-white/25 rounded-3xl rotate-12 opacity-30 group-hover:rotate-45 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-md">
                <LayoutGrid className="w-8 h-8 text-brand-secondary-light" />
              </div>
              <div>
                <h3 className="landing-display text-3xl sm:text-4xl font-bold mb-4">{t.home.feature1Title}</h3>
                <p className="text-white/90 text-base leading-relaxed max-w-md">{t.home.feature1Desc}</p>
              </div>
            </div>
          </article>

          {/* AI card */}
          <article className="md:col-span-2 landing-card rounded-3xl p-7 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-secondary/40 to-brand-primary/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Bot className="w-7 h-7 text-brand-primary" />
            </div>
            <h3 className="font-bold text-lg text-brand-primary-dark mb-3">{t.home.feature2Title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.home.feature2Desc}</p>
          </article>

          {/* Map card */}
          <article className="md:col-span-2 landing-card rounded-3xl p-7 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-7 h-7 text-brand-primary" />
            </div>
            <h3 className="font-bold text-lg text-brand-primary-dark mb-3">{t.home.feature3Title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.home.feature3Desc}</p>
          </article>

          {/* Accessibility wide */}
          <article className="md:col-span-4 landing-card rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-8 hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-white/80 to-brand-secondary/8 border border-brand-secondary/15">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-brand-primary/15 to-brand-secondary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-brand-primary-dark mb-2">{t.home.feature4Title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.home.feature4Desc}</p>
            </div>
          </article>
        </div>
      </section>

      {/* ─── How it works - Mejorada ─── */}
      <section id="como-funciona" className="mb-28 scroll-mt-32">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-secondary-dark bg-brand-secondary/15 px-4 py-2 rounded-full inline-block">
            {t.home.howBadge || "Proceso"}
          </span>
          <h2 className="landing-display text-4xl sm:text-5xl font-extrabold text-brand-primary-dark mt-6 mb-4">
            {t.home.howTitle}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">{t.home.howSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Conector visual */}
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-1 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
          
          {steps.map((step, idx) => (
            <article
              key={step.num}
              className="relative landing-card rounded-3xl p-8 text-center hover:-translate-y-3 transition-all duration-300 group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="landing-step-num landing-display inline-flex w-16 h-16 rounded-2xl items-center justify-center text-2xl font-extrabold mb-6 shadow-lg mx-auto">
                {step.num}
              </span>
              <h3 className="font-bold text-xl text-brand-primary-dark mb-3">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mt-6 mx-auto group-hover:bg-brand-secondary/15 transition-colors">
                <step.icon className="w-6 h-6 text-brand-primary group-hover:text-brand-secondary transition-colors" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── CTA band - Mejorada ─── */}
      <section className="landing-cta-band rounded-[2.5rem] p-12 sm:p-16 text-center text-white mb-12">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="landing-display text-4xl sm:text-5xl font-extrabold mb-6">{t.home.ctaBandTitle}</h2>
          <p className="text-white/90 text-lg mb-10 leading-relaxed">{t.home.ctaBandSubtitle}</p>
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-brand-primary-dark font-bold px-12 py-4 rounded-xl hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl"
            >
              {t.home.ctaDashboard}
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary-dark font-bold px-12 py-4 rounded-xl hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl"
              >
                {t.home.ctaRegister}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 font-bold px-12 py-4 rounded-xl transition-all backdrop-blur-sm"
              >
                {t.home.ctaLogin}
              </Link>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
