"use client";

import { Bot, Search, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function HeroMockup() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
      {/* Glow behind mockup */}
      <div className="absolute inset-4 bg-gradient-to-br from-brand-primary/30 to-brand-secondary/40 rounded-[2rem] blur-3xl opacity-60 animate-pulse-soft" />

      <div className="relative tramix-mockup-shell rounded-[1.75rem] p-1 animate-float">
        <div className="rounded-[1.5rem] overflow-hidden bg-white shadow-2xl shadow-brand-primary/20 border border-white/80">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-brand-secondary/80" />
            <span className="ml-3 text-[10px] font-mono text-slate-400 truncate flex-1">
              tramix.app/dashboard
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-50/80 to-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-brand-primary-dark">{t.home.mockGreeting}</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand-secondary-dark bg-brand-secondary/20 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                Live
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
              <div className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border-2 border-slate-100 text-xs text-slate-400 font-medium">
                {t.home.mockSearch}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t.home.mockTramite1, code: "DOC-01", online: true },
                { label: t.home.mockTramite2, code: "MOV-12", online: true },
              ].map((item) => (
                <div
                  key={item.code}
                  className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-brand-primary/20 transition-colors"
                >
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider">{item.code}</span>
                  <p className="text-[11px] font-bold text-brand-primary-dark mt-1 leading-tight">{item.label}</p>
                  {item.online && (
                    <span className="inline-block mt-2 text-[8px] font-bold text-brand-secondary-dark bg-brand-secondary/25 px-1.5 py-0.5 rounded-md">
                      {t.home.mockOnline}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -left-4 sm:-left-8 top-1/4 tramix-float-card p-3 rounded-2xl max-w-[140px] hidden sm:block animate-float-delayed">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-secondary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-brand-secondary-dark" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-primary-dark">{t.home.mockFloat1Title}</p>
            <p className="text-[9px] text-slate-500">{t.home.mockFloat1Desc}</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 sm:-right-6 bottom-8 tramix-float-card p-3 rounded-2xl hidden sm:block animate-float">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-primary/15 flex items-center justify-center">
            <Bot className="w-4 h-4 text-brand-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-primary-dark">{t.home.mockFloat2Title}</p>
            <p className="text-[9px] text-slate-500">{t.home.mockFloat2Desc}</p>
          </div>
        </div>
      </div>

      <div className="absolute right-4 -top-2 tramix-float-card px-3 py-2 rounded-full flex items-center gap-1.5 animate-float-delayed">
        <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
        <span className="text-[10px] font-bold text-brand-primary-dark">{t.home.mockNew}</span>
      </div>
    </div>
  );
}
