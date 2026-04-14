"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, FileX } from "lucide-react";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import PointsOfAttentionSection from "@/components/PointsOfAttentionSection";
import TipsSection from "@/components/TipsSection";

// Type definitions passed from Server Component
type Categoria = { id: string; name: string; icon: string };
type Tramite = { id: string; title: string; description: string; code: string; categoriaId: string | null; isOnline: boolean; targetAgeRange: string | null; type: string };

export default function DashboardClient({ categorias, tramites, userAge, puntosAtencion }: { categorias: Categoria[], tramites: Tramite[], userAge: string | null | undefined, puntosAtencion?: any[] }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"todos" | "ciudadano" | "financiero">("todos"); // HU-16
  const [searchCode, setSearchCode] = useState("");
  const [searchError, setSearchError] = useState("");
  const router = useRouter();

  // Dynamic Icon Renderer
  const IconComponent = ({ name }: { name: string }) => {
    const Icon = (Icons as any)[name] || Icons.Circle;
    return <Icon className="w-8 h-8 mb-2 text-brand-primary" />;
  };

  // HU-06: Filtrado por categoría y HU-05: Recomendación por edad
  let filteredTramites = tramites;
  if (selectedCat) {
    filteredTramites = tramites.filter(t => t.categoriaId === selectedCat);
  } else if (userAge) {
    filteredTramites = tramites.filter(t => !t.targetAgeRange || t.targetAgeRange === userAge);
  }

  // HU-16: Filtrar por tipo ciudadano / financiero
  if (typeFilter !== "todos") {
    filteredTramites = filteredTramites.filter(t => t.type === typeFilter);
  }

  const isCategoryEmpty = (selectedCat || typeFilter !== "todos") && filteredTramites.length === 0;


  // HU-07: Consulta por código
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    if (!searchCode.trim()) {
      setSearchError("Debes ingresar un código para realizar la búsqueda.");
      return;
    }

    const exactMatch = tramites.find(t => t.code.toUpperCase() === searchCode.trim().toUpperCase());
    if (exactMatch) {
      router.push(`/tramites/${exactMatch.id}`);
    } else {
      setSearchError("No encontramos ningún trámite asociado al código ingresado. Verifica e intenta nuevamente.");
    }
  };

  return (
    <div className="space-y-8">
      {/* HU-07 Search Component */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Búsqueda Rápida por Código</label>
        <form onSubmit={handleSearch} className="flex gap-2 relative">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Ej: TRM-1024"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className={`block w-full pl-10 pr-3 py-4 border ${searchError ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-xl focus:ring-brand-primary focus:border-brand-primary transition`}
            />
          </div>
          <button type="submit" className="bg-brand-primary text-white px-8 py-4 rounded-xl min-h-[44px] min-w-[44px] font-semibold hover:bg-brand-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-md hidden md:block">
            Consultar
          </button>
        </form>
        {searchError && (
          <div className="mt-3 text-red-600 text-sm flex gap-2 items-center bg-red-50 p-3 rounded-lg">
             <span className="font-semibold px-2 py-0.5 bg-red-200 text-red-800 rounded">!</span> {searchError}
          </div>
        )}
      </div>

      {/* HU-16: Filtro Tipo de Trámite */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Filtrar por Tipo</h2>
        <div className="flex gap-4">
          {(["todos", "ciudadano", "financiero"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm capitalize transition ${typeFilter === t ? "bg-brand-secondary text-brand-primary-dark shadow-md" : "bg-white border-2 border-gray-100 text-gray-500 hover:border-gray-300"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* HU-06 Categories Grid */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categorías de Trámites</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedCat(null)}
            className={`p-6 rounded-2xl min-h-[44px] min-w-[44px] border-2 transition-all flex flex-col items-center justify-center text-center ${!selectedCat ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white border-transparent hover:border-gray-200'} shadow-sm`}
          >
            <Icons.LayoutGrid className={`w-8 h-8 mb-2 ${!selectedCat ? 'text-brand-primary' : 'text-slate-400'}`} />
            <span className="font-semibold text-slate-800">Todos</span>
          </button>
          
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`p-6 rounded-2xl min-h-[44px] min-w-[44px] border-2 transition-all flex flex-col items-center justify-center text-center ${selectedCat === cat.id ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white border-transparent hover:border-gray-200'} shadow-sm`}
            >
              <IconComponent name={cat.icon} />
              <span className="font-semibold text-slate-800">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Results / Empty State */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCat ? `Resultados Filtrados` : `Trámites Destacados`}
          </h2>
        </div>

        {isCategoryEmpty ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
            <div className="flex justify-center mb-4">
               <FileX className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sin trámites</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Por el momento no hay trámites disponibles en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTramites.map(t => (
              <Link href={`/tramites/${t.id}`} key={t.id} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[44px] min-w-[44px] hover:shadow-lg hover:border-brand-primary/30 transition-all flex flex-col hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold tracking-wider">{t.code}</span>
                  {t.isOnline && <span className="px-3 py-1 bg-brand-secondary/20 text-brand-secondary-dark rounded-lg text-xs font-bold ring-1 ring-brand-secondary/30">100% Online</span>}
                </div>
                <h3 className="font-bold text-lg text-brand-primary-dark leading-tight mb-2 group-hover:text-brand-secondary transition-colors">{t.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mt-auto mb-4">{t.description}</p>
                <div className="mt-auto flex items-center justify-between text-brand-primary font-bold text-sm">
                  <span>Iniciar Trámite</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* NEW SECTIONS */}
      <PointsOfAttentionSection puntos={puntosAtencion} />
      
      <TipsSection />
    </div>
  );
}
