"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Search, Navigation, Building2, BookUser, ShieldCheck } from "lucide-react";

const PUNTOS = [
  {
    id: "movilidad",
    name: "Secretarías de Movilidad",
    description: "Trámites de tránsito y transporte en el Valle de Aburrá.",
    category: "Movilidad",
    icon: Navigation,
    centers: [
      { name: "Sede Medellín (Caribe)", address: "Carrera 64C # 72-160", phone: "604-445-7777", schedule: "L-V 7:30 AM - 5:30 PM" },
      { name: "Sede Envigado", address: "Avenida Las Vegas # 37 Sur 35", phone: "604-339-4000", schedule: "L-V 8:00 AM - 5:00 PM (Sáb 8-12)" },
      { name: "Sede Sabaneta", address: "Carrera 45 # 77 Sur 25", phone: "604-288-0192", schedule: "L-V 7:30 AM - 4:30 PM" },
    ]
  },
  {
    id: "documentacion",
    name: "Registradurías",
    description: "Expedición de cédulas y registros civiles en el Valle de Aburrá.",
    category: "Documentación",
    icon: Building2,
    centers: [
      { name: "Registraduría Auxiliar Medellín", address: "Calle 48 # 42-45", phone: "601-222-0000", schedule: "L-V 8:00 AM - 4:00 PM" },
      { name: "Registraduría Itagüí", address: "Carrera 51 # 51-54", phone: "604-372-2222", schedule: "L-V 8:00 AM - 4:00 PM" },
      { name: "Registraduría Bello", address: "Diagonal 50 # 38-40", phone: "604-482-1111", schedule: "L-V 8:00 AM - 4:00 PM" },
    ]
  },
  {
    id: "pasaporte",
    name: "Gobernación de Antioquia",
    description: "Trámite de pasaportes y apostillas.",
    category: "Pasaporte",
    icon: BookUser,
    centers: [
      { name: "Oficina de Pasaportes", address: "Calle 42B # 52-106 La Alpujarra", phone: "604-383-9000", schedule: "L-V 7:30 AM - 3:30 PM" }
    ]
  },
  {
    id: "libreta",
    name: "Brigadas y Distritos Militares",
    description: "Definición de situación militar.",
    category: "Libreta Militar",
    icon: ShieldCheck,
    centers: [
      { name: "Cuarta Brigada (Medellín)", address: "Calle 50 # 76-126", phone: "604-444-0000", schedule: "L-V 7:00 AM - 5:00 PM" }
    ]
  }
];

export default function PointsOfAttentionSection() {
  const [activeFilter, setActiveFilter] = useState("Movilidad");

  const filtered = PUNTOS.find(p => p.category === activeFilter);

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
        {PUNTOS.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveFilter(p.category)}
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 border-2
              ${activeFilter === p.category ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105' : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:border-slate-200'}
            `}
          >
            <p.icon className="w-4 h-4" />
            {p.category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        {filtered?.centers.map((center, idx) => (
          <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-brand-primary/20 transition-all group hover:bg-white hover:shadow-xl">
            <h3 className="font-bold text-brand-primary-dark mb-4 group-hover:text-brand-primary transition-colors flex items-center justify-between">
              {center.name}
              <Navigation className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-brand-secondary" />
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>{center.address}</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>{center.schedule}</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>{center.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
