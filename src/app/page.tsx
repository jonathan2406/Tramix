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

  const marqueeItems = t.home.trusted.split(/\s*\u00b7\s*/).filter(Boolean);

  return (
    <div className={`landing-root ${jakarta.variable} relative -mt-2 pb-4`}>
      <div className="landing-page-bg" aria-hidden="true" />

      <section className="landing-hero-section relative pt-6 pb-20 lg:pt-10 lg:pb-24">
        <div className="landing-hero-frame" aria-hidden="true" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center relative z-10">
          <div className="text-center lg:text-left animate-landing-fade-up">
            <div className="landing-eyebrow inline-flex items-center gap-2 px-4 py-2 text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary" />
              </span>
              {t.home.badge}
            </div>

            <h1 className="landing-display text-4xl sm:text-5xl xl:text-[4rem] font-extrabold text-brand-primary-dark leading-[1.07] mb-6">
              {t.home.heading} <span className="landing-gradient-text">TRAMIX</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-9 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.home.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {session ? (
                <Link
                  href="/dashboard"
                  className="landing-btn-primary group text-white font-bold text-base px-8 py-4 rounded-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {t.home.ctaDashboard}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="landing-btn-primary group text-white font-bold text-base px-8 py-4 rounded-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    {t.home.ctaRegister}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#como-funciona"
                    className="landing-btn-secondary group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all"
                  >
                    {t.home.ctaSecondary}
                  </a>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-12 max-w-md mx-auto lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="landing-stat-card rounded-xl px-3 py-4 text-center lg:text-left">
                  <p className="landing-display text-2xl sm:text-3xl font-extrabold landing-gradient-text">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pr-4">
            <HeroMockup />
          </div>
        </div>
      </section>

      <div className="landing-trust-strip overflow-hidden py-4 mb-16 rounded-xl">
        <div className="landing-marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`${item}-${i}`} className="landing-marquee-item flex items-center gap-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary inline" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="landing-display text-3xl sm:text-4xl font-extrabold text-brand-primary-dark mb-3">
            {t.home.bentoTitle}
          </h2>
          <p className="text-slate-600 text-lg">{t.home.bentoSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(140px,auto)]">
          <article className="md:col-span-4 md:row-span-2 landing-bento-highlight rounded-2xl p-8 sm:p-10 relative overflow-hidden group">
            <div className="landing-bento-mark" aria-hidden="true" />
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[220px]">
              <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center mb-6 backdrop-blur-sm">
                <LayoutGrid className="w-7 h-7 text-brand-secondary" />
              </div>
              <div>
                <h3 className="landing-display text-2xl sm:text-3xl font-bold mb-3">{t.home.feature1Title}</h3>
                <p className="text-white/80 text-base max-w-md leading-relaxed">{t.home.feature1Desc}</p>
              </div>
            </div>
          </article>

          <article className="md:col-span-2 landing-card rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300 group border-brand-secondary/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-secondary/30 to-brand-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="font-bold text-lg text-brand-primary-dark mb-2">{t.home.feature2Title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.home.feature2Desc}</p>
          </article>

          <article className="md:col-span-2 landing-card rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/15 to-brand-secondary/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="font-bold text-lg text-brand-primary-dark mb-2">{t.home.feature3Title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.home.feature3Desc}</p>
          </article>

          <article className="md:col-span-4 landing-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-white to-brand-secondary/5">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-brand-primary-dark mb-2">{t.home.feature4Title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.home.feature4Desc}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="como-funciona" className="mb-24 scroll-mt-28">
        <div className="text-center mb-14">
          <span className="landing-section-kicker text-xs font-bold uppercase tracking-[0.18em]">Process</span>
          <h2 className="landing-display text-3xl sm:text-4xl font-extrabold text-brand-primary-dark mt-2 mb-3">
            {t.home.howTitle}
          </h2>
          <p className="text-slate-600 text-lg max-w-lg mx-auto">{t.home.howSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-secondary/20 via-brand-primary/30 to-brand-secondary/20" />
          {steps.map((step) => {
            const StepIcon = step.icon;

            return (
              <article
                key={step.num}
                className="relative landing-card rounded-2xl p-8 text-center hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span className="landing-step-num landing-display inline-flex w-12 h-12 rounded-xl items-center justify-center text-sm font-extrabold mb-5">
                  {step.num}
                </span>
                <StepIcon className="mx-auto mb-4 h-6 w-6 text-brand-primary/70" />
                <h3 className="font-bold text-xl text-brand-primary-dark mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-cta-band rounded-2xl p-10 sm:p-14 text-center text-white mb-8">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="landing-display text-3xl sm:text-4xl font-extrabold mb-4">{t.home.ctaBandTitle}</h2>
          <p className="text-white/85 text-lg mb-8 leading-relaxed">{t.home.ctaBandSubtitle}</p>
          {session ? (
            <Link
              href="/dashboard"
              className="landing-cta-link inline-flex items-center gap-2 bg-white text-brand-primary-dark font-bold px-10 py-4 rounded-xl hover:-translate-y-0.5 transition-all"
            >
              {t.home.ctaDashboard}
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="landing-cta-link inline-flex items-center justify-center gap-2 bg-white text-brand-primary-dark font-bold px-10 py-4 rounded-xl hover:-translate-y-0.5 transition-all"
              >
                {t.home.ctaRegister}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 font-bold px-10 py-4 rounded-xl hover:bg-white/25 transition-all backdrop-blur-sm"
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
