"use client";

import { Lightbulb, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function TipsSection() {
  const tips = [
    {
      title: "Registradurías más rápidas",
      description:
        "Las registradurías de Sabaneta y Envigado suelen tener tiempos de atención mucho más cortos que las de Medellín, Bello o Itagüí.",
      icon: Sparkles,
    },
    {
      title: "Descuento por Votación",
      description:
        "Presenta tu certificado de votación vigente y obtén un 10% de descuento por una sola vez en el trámite de expedición de duplicado de la cédula y pasaporte.",
      icon: CheckCircle2,
    },
    {
      title: "Movilidad en Cundinamarca",
      description:
        "Si estás en Cundinamarca, municipios como Chía y Funza ofrecen descuentos adicionales y trámites mucho más rápidos para licencias y traspasos.",
      icon: AlertCircle,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-brand-primary/20 border border-brand-primary/20 bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-primary-dark">
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-secondary/25 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.08)_0%,transparent_45%)] pointer-events-none" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
          <Lightbulb className="text-brand-secondary w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Recomendaciones y Tips</h2>
          <p className="text-white/70 text-sm mt-1">Consejos para que tus trámites sean más eficientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:bg-white/15 hover:border-brand-secondary/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-11 h-11 bg-brand-secondary/25 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <tip.icon className="w-5 h-5 text-brand-secondary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
            <p className="text-white/75 text-sm leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
