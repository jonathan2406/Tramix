"use client";

import { useState } from "react";
import { Save, EyeOff, Eye, MapPin, Plus, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";

type Tramite = {
  id: string; title: string; description: string; code: string;
  type: string; published: boolean; estimatedTime: string | null;
  estimatedCost: string | null; categoria: { name: string } | null;
  puntosAtencion: PuntoAtencion[];
};
type PuntoAtencion = {
  id: string; address: string; schedule: string; phone: string;
  status: string; tramiteId: string; tramite?: { title: string };
};

type Props = {
  tramites: Tramite[];
  puntos: PuntoAtencion[];
  tramitesList: { id: string; title: string }[];
};

export default function AdminClient({ tramites: initialTramites, puntos: initialPuntos, tramitesList }: Props) {
  const [tab, setTab] = useState<"tramites" | "puntos">("tramites");
  const [tramites, setTramites] = useState(initialTramites);
  const [puntos, setPuntos] = useState(initialPuntos);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Edit states for tramites
  const [edits, setEdits] = useState<Record<string, Partial<Tramite>>>({});

  // New punto form
  const [newPunto, setNewPunto] = useState({ address: "", schedule: "", phone: "", tramiteId: tramitesList[0]?.id ?? "" });
  const [addingPunto, setAddingPunto] = useState(false);

  const getEdit = (id: string, field: keyof Tramite, fallback: any) =>
    edits[id]?.[field] !== undefined ? edits[id][field] : fallback;

  const setEdit = (id: string, field: keyof Tramite, value: any) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  // HU-13: Guardar cambios del trámite
  const saveTramite = async (id: string) => {
    if (!edits[id] || Object.keys(edits[id]).length === 0) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/tramites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edits[id]),
      });
      if (res.ok) {
        const updated = await res.json();
        setTramites((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
        setEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
      }
    } finally {
      setSaving(null);
    }
  };

  // HU-13: Toggle publicado/despublicado
  const togglePublished = async (id: string, current: boolean) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/tramites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current }),
      });
      if (res.ok) {
        setTramites((prev) => prev.map((t) => (t.id === id ? { ...t, published: !current } : t)));
      }
    } finally {
      setSaving(null);
    }
  };

  // HU-14: Toggle estado punto de atención
  const togglePunto = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "activo" ? "fuera_de_servicio" : "activo";
    const res = await fetch(`/api/admin/puntos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setPuntos((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    }
  };

  // HU-14: Eliminar punto de atención
  const deletePunto = async (id: string) => {
    if (!confirm("¿Eliminar este punto de atención?")) return;
    const res = await fetch(`/api/admin/puntos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPuntos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // HU-14: Crear nuevo punto de atención
  const createPunto = async () => {
    if (!newPunto.address || !newPunto.schedule || !newPunto.phone || !newPunto.tramiteId) return;
    setAddingPunto(true);
    try {
      const res = await fetch("/api/admin/puntos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPunto),
      });
      if (res.ok) {
        const created = await res.json();
        const tramite = tramitesList.find((t) => t.id === newPunto.tramiteId);
        setPuntos((prev) => [...prev, { ...created, tramite: { title: tramite?.title ?? "" } }]);
        setNewPunto({ address: "", schedule: "", phone: "", tramiteId: tramitesList[0]?.id ?? "" });
      }
    } finally {
      setAddingPunto(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        {(["tramites", "puntos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition capitalize ${tab === t ? "bg-brand-primary text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {t === "tramites" ? "🗂️ Gestión de Trámites" : "📍 Puntos de Atención"}
          </button>
        ))}
      </div>

      {/* HU-13: Gestión de Trámites */}
      {tab === "tramites" && (
        <div className="space-y-4">
          {tramites.map((t) => (
            <div key={t.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition ${!t.published ? "border-red-200 opacity-75" : "border-gray-100"}`}>
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
                onClick={() => setExpanded((prev) => (prev === t.id ? null : t.id))}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.published ? "bg-green-500" : "bg-red-400"}`} />
                  <div>
                    <p className="font-bold text-gray-900">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.code} · {t.categoria?.name ?? "Sin categoría"} · <span className="capitalize">{t.type}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!t.published && <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Despublicado</span>}
                  {expanded === t.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              {expanded === t.id && (
                <div className="p-5 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        value={String(getEdit(t.id, "title", t.title))}
                        onChange={(e) => setEdit(t.id, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Tipo</label>
                      <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        value={String(getEdit(t.id, "type", t.type))}
                        onChange={(e) => setEdit(t.id, "type", e.target.value)}
                      >
                        <option value="ciudadano">Ciudadano</option>
                        <option value="financiero">Financiero</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Descripción</label>
                      <textarea
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary resize-none"
                        value={String(getEdit(t.id, "description", t.description))}
                        onChange={(e) => setEdit(t.id, "description", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Tiempo Estimado</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        placeholder="Ej: 3 a 5 días hábiles"
                        value={String(getEdit(t.id, "estimatedTime", t.estimatedTime ?? ""))}
                        onChange={(e) => setEdit(t.id, "estimatedTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Costo Estimado</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        placeholder="Ej: Gratuito o $75.000 COP"
                        value={String(getEdit(t.id, "estimatedCost", t.estimatedCost ?? ""))}
                        onChange={(e) => setEdit(t.id, "estimatedCost", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      disabled={saving === t.id}
                      onClick={() => saveTramite(t.id)}
                      className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-brand-primary-dark transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving === t.id ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <button
                      disabled={saving === t.id}
                      onClick={() => togglePublished(t.id, t.published)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50 ${t.published ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                    >
                      {t.published ? <><EyeOff className="w-4 h-4" />Despublicar</> : <><Eye className="w-4 h-4" />Publicar</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* HU-14: Gestión de Puntos de Atención */}
      {tab === "puntos" && (
        <div className="space-y-6">
          {/* Nuevo punto */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-brand-primary" />Registrar Nuevo Punto de Atención</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Dirección</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary" placeholder="Calle 10 # 45-20" value={newPunto.address} onChange={(e) => setNewPunto((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Horario</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary" placeholder="L-V 8:00 AM - 5:00 PM" value={newPunto.schedule} onChange={(e) => setNewPunto((p) => ({ ...p, schedule: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Teléfono</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary" placeholder="604-xxx-xxxx" value={newPunto.phone} onChange={(e) => setNewPunto((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Trámite asociado</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary" value={newPunto.tramiteId} onChange={(e) => setNewPunto((p) => ({ ...p, tramiteId: e.target.value }))}>
                  {tramitesList.map((t) => (<option key={t.id} value={t.id}>{t.title}</option>))}
                </select>
              </div>
            </div>
            <button disabled={addingPunto} onClick={createPunto} className="mt-4 flex items-center gap-2 bg-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-primary-dark transition disabled:opacity-50">
              <Plus className="w-4 h-4" />
              {addingPunto ? "Registrando..." : "Registrar Punto"}
            </button>
          </div>

          {/* Lista de puntos existentes */}
          <div className="space-y-3">
            {puntos.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-dashed">No hay puntos de atención registrados.</div>
            )}
            {puntos.map((p) => (
              <div key={p.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 flex flex-wrap items-start justify-between gap-4 transition ${p.status === "activo" ? "border-green-200" : "border-red-200 opacity-70"}`}>
                <div className="flex items-start gap-4">
                  <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${p.status === "activo" ? "text-brand-secondary" : "text-red-400"}`} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{p.address}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.schedule} · {p.phone}</p>
                    <p className="text-xs text-brand-primary mt-0.5">{p.tramite?.title}</p>
                    <span className={`mt-1 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${p.status === "activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {p.status === "activo" ? "Activo" : "Fuera de servicio"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => togglePunto(p.id, p.status)} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition" title="Cambiar estado">
                    {p.status === "activo" ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-red-400" />}
                  </button>
                  <button onClick={() => deletePunto(p.id)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition" title="Eliminar">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
