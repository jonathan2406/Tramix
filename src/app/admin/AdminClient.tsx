"use client";

import { useState } from "react";
import { Save, EyeOff, Eye, MapPin, Plus, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, ShieldAlert, BarChart2, Download, Clock, FileText, CheckCircle, AlertTriangle } from "lucide-react";

type Tramite = {
  id: string; title: string; description: string; code: string;
  type: string; published: boolean; estimatedTime: string | null;
  estimatedCost: string | null; categoria: { name: string } | null;
  puntosAtencion: PuntoAtencion[]; updatedAt: string;
};
type PuntoAtencion = {
  id: string; address: string; city: string; schedule: string; phone: string;
  status: string; tramiteId: string; tramite?: { title: string };
};
type User = {
  id: string; name: string; email: string; role: string; documentNumber: string; createdAt: Date;
};

type Props = {
  tramites: Tramite[];
  puntos: PuntoAtencion[];
  tramitesList: { id: string; title: string }[];
  users?: User[];
  currentUserId?: string;
};

export default function AdminClient({ tramites: initialTramites, puntos: initialPuntos, tramitesList, users: initialUsers = [], currentUserId }: Props) {
  const [tab, setTab] = useState<"tramites" | "puntos" | "usuarios" | "estadisticas">("tramites");
  const [tramites, setTramites] = useState(initialTramites);
  const [puntos, setPuntos] = useState(initialPuntos);
  const [users, setUsers] = useState(initialUsers);

  // HU-17: detect stale tramites (no update in 15+ days)
  const STALE_DAYS = 15;
  const isStale = (updatedAt: string) => {
    const diff = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diff > STALE_DAYS;
  };

  // HU-17: export CSV
  const exportCSV = () => {
    const headers = ["Código", "Título", "Tipo", "Categoría", "Publicado", "Tiempo Estimado", "Costo Estimado", "Última Actualización"];
    const rows = tramites.map(t => [
      t.code,
      `"${t.title}"`,
      t.type,
      t.categoria?.name ?? "Sin categoría",
      t.published ? "Sí" : "No",
      t.estimatedTime ?? "",
      t.estimatedCost ?? "",
      new Date(t.updatedAt).toLocaleDateString("es-CO")
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte_tramites_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Edit states for tramites
  const [edits, setEdits] = useState<Record<string, Partial<Tramite>>>({});

  // New punto form
  const [newPunto, setNewPunto] = useState({ address: "", city: "", schedule: "", phone: "", tramiteId: tramitesList[0]?.id ?? "" });
  const [addingPunto, setAddingPunto] = useState(false);

  const getEdit = (id: string, field: keyof Tramite, fallback: any) =>
    edits[id]?.[field] !== undefined ? edits[id][field] : fallback;

  const setEdit = (id: string, field: keyof Tramite, value: any) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  // HU-13: Guardar cambios del trámite
  const saveTramite = async (id: string) => {
    if (!edits[id] || Object.keys(edits[id]).length === 0) return;

    const currentTitle = String(getEdit(id, "title", tramites.find(t => t.id === id)?.title)).trim();
    if (!currentTitle) {
      setValidationError(id);
      return;
    }
    setValidationError(null);

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
        setSuccessMessage("Trámite actualizado con éxito");
        setTimeout(() => setSuccessMessage(null), 3000);
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

  // HU-16: Actualizar rol de usuario
  const updateRole = async (userId: string, newRole: string) => {
    if (userId === currentUserId) return; // Prevention done in UI and API
    setSaving(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setSuccessMessage("Rol actualizado exitosamente");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al actualizar el rol");
      }
    } catch (e) {
      alert("Error al actualizar el rol");
    } finally {
      setSaving(null);
    }
  };

  // HU-14: Crear nuevo punto de atención
  const createPunto = async () => {
    if (!newPunto.address || !newPunto.city || !newPunto.schedule || !newPunto.phone || !newPunto.tramiteId) return;
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
        setNewPunto({ address: "", city: "", schedule: "", phone: "", tramiteId: tramitesList[0]?.id ?? "" });
      }
    } finally {
      setAddingPunto(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
        {(["tramites", "puntos", "usuarios", "estadisticas"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl font-bold text-sm transition capitalize whitespace-nowrap ${tab === t ? "bg-brand-primary text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {t === "tramites" ? "🗂️ Trámites" : t === "puntos" ? "📍 Puntos" : t === "usuarios" ? "👥 Usuarios" : "📊 Estadísticas"}
          </button>
        ))}
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center font-bold shadow-sm animate-fade-in-down">
          ✅ {successMessage}
        </div>
      )}

      {/* HU-13: Gestión de Trámites */}
      {tab === "tramites" && (
        <div className="space-y-4">
          {tramites.map((t) => {
            const stale = t.published && isStale(t.updatedAt);
            return (
            <div key={t.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition ${stale ? "border-orange-400" : !t.published ? "border-red-200 opacity-75" : "border-gray-100"}`}>
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
                onClick={() => setExpanded((prev) => (prev === t.id ? null : t.id))}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${stale ? "bg-orange-400" : t.published ? "bg-green-500" : "bg-red-400"}`} />
                  <div>
                    <p className="font-bold text-gray-900">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.code} · {t.categoria?.name ?? "Sin categoría"} · <span className="capitalize">{t.type}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {stale && <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Prioritario</span>}
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
                        className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none transition ${validationError === t.id && !String(getEdit(t.id, "title", t.title)).trim() ? "border-red-500 bg-red-50 ring-2 ring-red-200" : "border-gray-200 focus:border-brand-primary"}`}
                        value={String(getEdit(t.id, "title", t.title))}
                        onChange={(e) => {
                          setEdit(t.id, "title", e.target.value);
                          if (e.target.value.trim() !== "") setValidationError(null);
                        }}
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

                  <div className="flex flex-col gap-3 pt-2">
                    {validationError === t.id && (
                      <p className="text-red-600 text-sm font-bold bg-red-50 py-2 px-3 rounded-lg border border-red-200">
                        Debe completar todos los campos obligatorios para continuar
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={saving === t.id || (validationError === t.id && !String(getEdit(t.id, "title", t.title)).trim())}
                        onClick={() => saveTramite(t.id)}
                        className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-brand-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              )}
            </div>
            );
          })}
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
                <label className="block text-xs font-bold text-gray-500 mb-1">Ciudad</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary" placeholder="Ej: Bogotá" value={newPunto.city} onChange={(e) => setNewPunto((p) => ({ ...p, city: e.target.value }))} />
              </div>
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
                    <p className="font-bold text-gray-900 text-sm">{p.address}, {p.city}</p>
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

      {/* HU-16: Gestión de Usuarios */}
      {tab === "usuarios" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-sm text-blue-800">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
            <div>
              <p className="font-bold">Asignación de permisos y roles</p>
              <p>Cambiar el rol a "funcionario" otorga acceso al sistema interno. Al retirarlo, se revocan los accesos inmediatamente. Por seguridad, no puedes modificar tu propio rol.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => {
              const isMe = u.id === currentUserId;
              return (
                <div key={u.id} className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition ${isMe ? "border-brand-primary/30 bg-brand-primary/5" : "border-gray-100"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{u.name} {isMe && <span className="text-xs text-brand-primary font-normal">(Tú)</span>}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rol de acceso</label>
                    {isMe ? (
                      <div 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-not-allowed"
                        title="Por seguridad, no puedes eliminar tu propio rol administrativo"
                        onClick={() => alert("Por seguridad, no puedes eliminar tu propio rol administrativo")}
                      >
                        Administrador / Desarrollador
                      </div>
                    ) : (
                      <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-primary bg-white disabled:opacity-50"
                        value={u.role}
                        disabled={saving === u.id}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <option value="user">Ciudadano (Solo Portal)</option>
                        <option value="funcionario">Funcionario (Acceso Interno)</option>
                        <option value="developer">Administrador</option>
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HU-17: Estadísticas y Reportes */}
      {tab === "estadisticas" && (() => {
        const publicados = tramites.filter(t => t.published).length;
        const despublicados = tramites.filter(t => !t.published).length;
        const prioritarios = tramites.filter(t => t.published && isStale(t.updatedAt)).length;
        const puntosActivos = puntos.filter(p => p.status === "activo").length;
        const puntosInactivos = puntos.filter(p => p.status !== "activo").length;
        const totalTramites = tramites.length;

        const StatCard = ({ label, value, color, icon: Icon, sub }: any) => (
          <div className={`bg-white rounded-2xl border-2 p-6 shadow-sm ${color}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-4xl font-black text-gray-900">{value}</p>
                {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-current/10">
                <Icon className="w-6 h-6" />
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-current opacity-60 transition-all duration-700"
                style={{ width: totalTramites > 0 ? `${Math.round((value / Math.max(totalTramites, puntosActivos + puntosInactivos, 1)) * 100)}%` : "0%" }}
              />
            </div>
          </div>
        );

        return (
          <div className="space-y-6">
            {/* Summary header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Panel de Estadísticas</h2>
                  <p className="text-xs text-slate-500">Resumen del estado actual de la plataforma</p>
                </div>
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-brand-secondary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-secondary-dark transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                Exportar reporte CSV
              </button>
            </div>

            {/* Tramites counters */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Trámites</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-4xl font-black text-gray-900">{totalTramites}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100" />
                </div>
                <div className="bg-white rounded-2xl border-2 border-green-200 p-6 shadow-sm">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Publicados</p>
                  <p className="text-4xl font-black text-gray-900">{publicados}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-green-400 transition-all duration-700" style={{ width: `${totalTramites > 0 ? Math.round(publicados/totalTramites*100) : 0}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-red-200 p-6 shadow-sm">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Despublicados</p>
                  <p className="text-4xl font-black text-gray-900">{despublicados}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-red-400 transition-all duration-700" style={{ width: `${totalTramites > 0 ? Math.round(despublicados/totalTramites*100) : 0}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-sm">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Prioritarios (+15 días)</p>
                  <p className="text-4xl font-black text-gray-900">{prioritarios}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-400 transition-all duration-700" style={{ width: `${totalTramites > 0 ? Math.round(prioritarios/totalTramites*100) : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Puntos & Usuarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Puntos de Atención</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border-2 border-green-200 p-6 shadow-sm">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Activos</p>
                    <p className="text-4xl font-black text-gray-900">{puntosActivos}</p>
                    <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-green-400" style={{ width: `${(puntosActivos+puntosInactivos) > 0 ? Math.round(puntosActivos/(puntosActivos+puntosInactivos)*100) : 0}%` }} />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-red-200 p-6 shadow-sm">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Fuera de servicio</p>
                    <p className="text-4xl font-black text-gray-900">{puntosInactivos}</p>
                    <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-red-400" style={{ width: `${(puntosActivos+puntosInactivos) > 0 ? Math.round(puntosInactivos/(puntosActivos+puntosInactivos)*100) : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Usuarios Registrados</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border-2 border-brand-primary/30 p-6 shadow-sm">
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">Total</p>
                    <p className="text-4xl font-black text-gray-900">{users.length}</p>
                    <div className="mt-4 h-2 rounded-full bg-brand-primary/20" />
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Funcionarios</p>
                    <p className="text-4xl font-black text-gray-900">{users.filter(u => u.role === "funcionario" || u.role === "developer").length}</p>
                    <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${users.length > 0 ? Math.round(users.filter(u => u.role !== "user").length/users.length*100) : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
