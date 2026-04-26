"use client";

import { useMemo, useState, useEffect } from "react";
import { MapPin, Phone, Clock, Navigation, Building2, BookUser, ShieldCheck } from "lucide-react";

// Categorias e iconos mapeados a lucide, similar a HU-06
const ICON_MAP: Record<string, any> = {
  "Movilidad": Navigation,
  "Documentación": Building2,
  "Pasaporte": BookUser,
  "Libreta Militar": ShieldCheck,
};

type Punto = {
  id: string; address: string; schedule: string; phone: string; status: string;
  tramite: { title: string; categoria: { name: string } | null };
};

export default function PointsOfAttentionSection({ puntos }: { puntos?: Punto[] }) {
  const [activeFilter, setActiveFilter] = useState("Todos");

  // Agrupar dinámicamente
  const groupedData = useMemo(() => {
    if (!puntos) return [];
    
    const groups: Record<string, any> = {};
    puntos.forEach(p => {
      // HU-14: puntos fuera de servicio se muestran atenuados; no se filtran
      
      const catName = p.tramite?.categoria?.name || "Otros";
      if (!groups[catName]) {
        groups[catName] = {
          id: catName,
          category: catName,
          icon: ICON_MAP[catName] || Building2,
          centers: []
        };
      }
      groups[catName].centers.push({
        name: p.tramite.title,
        address: p.address,
        phone: p.phone,
        schedule: p.schedule,
        status: p.status
      });
    });
    return Object.values(groups);
  }, [puntos]);

  useEffect(() => {
    if (Object.keys(groupedData).length > 0 && activeFilter === "Todos") {
      setActiveFilter(groupedData[0].category);
    }
  }, [groupedData, activeFilter]);

  if (!puntos || puntos.length === 0) return null;
  if (groupedData.length === 0) return null;

  const filtered = activeFilter === "Todos" 
    ? groupedData[0] 
    : groupedData.find(g => g.category === activeFilter);

  return (
    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
          <MapPin className="text-brand-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Puntos de Atención</h2>
          <p className="text-slate-500 text-sm">Encuentra dónde realizar tus trámites presenciales</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {groupedData.map((g: any) => (
          <button
            key={g.id}
            onClick={() => setActiveFilter(g.category)}
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 border-2
              ${activeFilter === g.category ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105' : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:border-slate-200'}
            `}
          >
            <g.icon className="w-4 h-4" />
            {g.category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        {filtered?.centers.map((center: any, idx: number) => {
          const isInactive = center.status !== "activo";
          return (
            <div key={idx} className={`relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-brand-primary/20 transition-all group hover:bg-white hover:shadow-xl ${isInactive ? "opacity-60 grayscale hover:opacity-100 hover:grayscale-0" : ""}`}>
              {isInactive && (
                <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200 shadow-sm z-10">
                  Fuera de Servicio
                </div>
              )}
              <h3 className={`font-bold mb-4 flex items-center justify-between text-sm pr-20 ${isInactive ? "text-slate-500" : "text-brand-primary-dark group-hover:text-brand-primary transition-colors"}`}>
                {center.name}
                <Navigation className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isInactive ? "text-slate-400" : "text-brand-secondary"}`} />
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm text-slate-600">
                  <MapPin className={`w-4 h-4 flex-shrink-0 ${isInactive ? "text-slate-400" : "text-brand-secondary"}`} />
                  <span>{center.address}</span>
                </div>
                <div className="flex gap-3 text-sm text-slate-600">
                  <Clock className={`w-4 h-4 flex-shrink-0 ${isInactive ? "text-slate-400" : "text-brand-secondary"}`} />
                  <span>{center.schedule}</span>
                </div>
                <div className="flex gap-3 text-sm text-slate-600">
                  <Phone className={`w-4 h-4 flex-shrink-0 ${isInactive ? "text-slate-400" : "text-brand-secondary"}`} />
                  <span>{center.phone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
