"use client";

import { Lightbulb, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function TipsSection() {
  const tips = [
    {
      title: "Registradurías más rápidas",
      description: "Las registradurías de Sabaneta y Envigado suelen tener tiempos de atención mucho más cortos que las de Medellín, Bello o Itagüí.",
      type: "speed",
      icon: Sparkles
    },
    {
      title: "Descuento por Votación",
      description: "Presenta tu certificado de votación vigente y obtén un 10% de descuento por una sola vez en el trámite de expedición de duplicado de la cédula y pasaporte.",
      type: "discount",
      icon: CheckCircle2
    },
    {
      title: "Movilidad en Cundinamarca",
      description: "Si estás en Cundinamarca, municipios como Chía y Funza ofrecen descuentos adicionales y trámites mucho más rápidos para licencias y traspasos.",
      type: "location",
      icon: AlertCircle
    }
  ];

  return (
    <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
          <Lightbulb className="text-brand-secondary w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Recomendaciones y Tips</h2>
          <p className="text-slate-400 text-sm">Consejos para que tus trámites sean más eficientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02]">
            <div className="w-10 h-10 bg-brand-secondary/20 rounded-xl flex items-center justify-center mb-4">
              <tip.icon className="w-5 h-5 text-brand-secondary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
