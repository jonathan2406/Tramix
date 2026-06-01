"use client";

import { Bot, Search, Sparkles, Zap, Lightbulb } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function HeroMockup() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
      {/* Glow behind mockup - Enhanced */}
      <div className="absolute -inset-8 bg-gradient-to-br from-brand-primary/40 via-brand-secondary/30 to-transparent rounded-[2.5rem] blur-3xl opacity-70 animate-landing-pulse-soft" />
      <div className="absolute -top-4 -right-4 w-72 h-72 bg-brand-secondary/20 rounded-full blur-3xl" />

      <div className="relative landing-mockup-shell rounded-[1.75rem] p-1 animate-landing-float">
        <div className="rounded-[1.5rem] overflow-hidden bg-white shadow-2xl shadow-brand-primary/25 border border-white/90">
          {/* Browser chrome - Mejorado */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100/50">
            <span className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-brand-secondary/80 shadow-sm" />
            <span className="ml-3 text-[10px] font-mono text-slate-400 truncate flex-1 font-semibold">
              tramix.app/dashboard
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 bg-gradient-to-b from-white to-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-brand-primary-dark">{t.home.mockGreeting}</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-brand-secondary to-brand-secondary-light px-3 py-1.5 rounded-full shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Live
              </span>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/60" />
              <div className="relative w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border-2 border-brand-primary/20 text-xs text-slate-400 font-medium hover:border-brand-primary/40 transition-colors">
                {t.home.mockSearch}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t.home.mockTramite1, code: "DOC-01", online: true, icon: Lightbulb },
                { label: t.home.mockTramite2, code: "MOV-12", online: true, icon: Zap },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.code}
                    className="group relative p-3 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-brand-primary/15 shadow-sm hover:border-brand-primary/40 hover:shadow-md transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider">{item.code}</span>
                        <Icon className="w-3.5 h-3.5 text-brand-secondary-dark opacity-60" />
                      </div>
                      <p className="text-[11px] font-bold text-brand-primary-dark leading-tight">{item.label}</p>
                      {item.online && (
                        <span className="inline-block mt-2 text-[8px] font-bold text-white bg-gradient-to-r from-brand-secondary to-brand-secondary-light px-2 py-0.5 rounded-md shadow-sm">
                          {t.home.mockOnline}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards - Mejoradas */}
      <div className="absolute -left-4 sm:-left-8 top-1/4 landing-float-card p-4 rounded-xl max-w-[150px] hidden sm:block animate-landing-float-delayed shadow-lg border-brand-primary/10">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-brand-secondary-dark" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-brand-primary-dark">{t.home.mockFloat1Title}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{t.home.mockFloat1Desc}</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 sm:-right-6 bottom-8 landing-float-card p-4 rounded-xl hidden sm:block animate-landing-float shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-brand-primary-dark" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-brand-primary-dark">{t.home.mockFloat2Title}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{t.home.mockFloat2Desc}</p>
          </div>
        </div>
      </div>

      <div className="absolute right-4 -top-2 landing-float-card px-4 py-2.5 rounded-full flex items-center gap-2 animate-landing-float-delayed shadow-lg border border-brand-secondary/20">
        <Sparkles className="w-4 h-4 text-brand-secondary" />
        <span className="text-[10px] font-bold text-brand-primary-dark">{t.home.mockNew}</span>
      </div>
    </div>
  );
}
