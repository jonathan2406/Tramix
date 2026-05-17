"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ChevronRight, Trash2, HeartOff } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Favorito = {
  id: string;
  tramite: {
    id: string;
    title: string;
    description: string;
    code: string;
    isOnline: boolean;
    categoria: { name: string } | null;
  };
};

export default function FavoritosPage() {
  const { status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/favoritos")
        .then(r => r.json())
        .then(data => { setFavoritos(data); setLoading(false); });
    }
  }, [status, router]);

  async function removeFavorite(tramiteId: string) {
    setRemoving(tramiteId);
    await fetch(`/api/favoritos/${tramiteId}`, { method: "DELETE" });
    setFavoritos(prev => prev.filter(f => f.tramite.id !== tramiteId));
    setRemoving(null);
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando favoritos...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7 text-rose-500" />
          <h1 className="text-3xl font-bold text-gray-900">{t.favorites.title}</h1>
        </div>
        <p className="text-gray-500 text-sm">{t.favorites.subtitle}</p>
      </div>

      {favoritos.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
          <HeartOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">{t.favorites.empty}</h3>
          <p className="text-gray-500 mt-2">{t.favorites.emptyHint}</p>
          <Link href="/dashboard" className="inline-block mt-6 bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primary-dark transition-all">
            {t.favorites.explore}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favoritos.map(({ id, tramite }) => (
            <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold tracking-wider">{tramite.code}</span>
                  {tramite.isOnline && <span className="px-3 py-1 bg-brand-secondary/20 text-brand-secondary-dark rounded-lg text-xs font-bold">100% Online</span>}
                  {tramite.categoria && <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-bold">{tramite.categoria.name}</span>}
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{tramite.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{tramite.description}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link href={`/tramites/${tramite.id}`}
                  className="flex items-center gap-1 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary-dark transition-all">
                  {t.favorites.view} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button onClick={() => removeFavorite(tramite.id)} disabled={removing === tramite.id}
                  className="flex items-center gap-1 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all disabled:opacity-50">
                  <Trash2 className="w-3.5 h-3.5" /> {t.favorites.remove}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
