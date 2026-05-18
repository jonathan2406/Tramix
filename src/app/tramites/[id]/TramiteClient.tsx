"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2, Circle, MapPin, Clock, Phone, AlertCircle, FileText,
  ChevronDown, ChevronUp, ShieldCheck, ExternalLink,
  Volume2, Pause, Play, Square,
  Heart, HeartOff, Calendar, X
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type TramiteProps = {
  tramite: any;
  userAge?: string | null;
  isFavorite?: boolean;
  tramiteId?: string;
};

// ─── HU-27: Texto que se leerá según la pestaña activa ───────────────────────
function getTabText(tramite: any, activeTab: string, userAge?: string | null): string {
  if (activeTab === "pasos") {
    return tramite.pasos.map((p: any, i: number) => `Paso ${i + 1}: ${p.title}. ${p.description}`).join(". ");
  }
  if (activeTab === "requisitos") {
    if (tramite.requisitos.length === 0) return "Este trámite no requiere documentación previa.";
    return "Documentos requeridos: " + tramite.requisitos.map((r: any) => r.title).join(", ") + ".";
  }
  if (activeTab === "puntos") {
    if (tramite.isOnline) return "Este trámite es cien por ciento en línea. No requiere asistencia presencial.";
    const activos = tramite.puntosAtencion.filter((p: any) => !p.status || p.status === "activo");
    return activos.map((p: any) => `${p.address}. Horario: ${p.schedule}. Teléfono: ${p.phone}.`).join(" ");
  }
  if (activeTab === "tips") {
    return tramite.recomendaciones.map((r: any) => r.text).join(". ");
  }
  return "";
}

export default function TramiteClient({ tramite, userAge, isFavorite: initialFavorite = false, tramiteId = "" }: TramiteProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("pasos");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null);

  // ─── HU-27: TTS state ──────────────────────────────────────────────────────
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsPaused, setTtsPaused] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = typeof window !== "undefined" && "speechSynthesis" in window
      ? window.speechSynthesis
      : null;
    return () => { synthRef.current?.cancel(); };
  }, []);

  useEffect(() => {
    synthRef.current?.cancel();
    setTtsActive(false);
    setTtsPaused(false);
    setTtsError(null);
  }, [activeTab]);

  function ttsStart() {
    setTtsError(null);

    if (!synthRef.current) {
      setTtsError("Tu navegador no soporta lectura en voz alta.");
      return;
    }

    const text = getTabText(tramite, activeTab, userAge);
    if (!text) return;

    synthRef.current.cancel();

    // Chrome bug: speak() inmediatamente después de cancel() a veces falla
    setTimeout(() => {
      const utt = new SpeechSynthesisUtterance(text);
      // No forzar locale — el navegador usa la voz disponible en español
      // es-CO no existe en la mayoría de sistemas; usar "es" es más compatible
      utt.lang = "es";
      utt.rate = 0.95;
      utt.onend = () => { setTtsActive(false); setTtsPaused(false); };
      utt.onerror = (e) => {
        // "interrupted" es normal cuando el usuario detiene manualmente
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setTtsError("No se pudo iniciar la lectura. Verifica que tu dispositivo tenga voces instaladas.");
        }
        setTtsActive(false);
        setTtsPaused(false);
      };
      uttRef.current = utt;
      synthRef.current!.speak(utt);
      setTtsActive(true);
      setTtsPaused(false);
    }, 150);
  }

  function ttsPause() {
    synthRef.current?.pause();
    setTtsPaused(true);
  }

  function ttsResume() {
    synthRef.current?.resume();
    setTtsPaused(false);
  }

  function ttsStop() {
    synthRef.current?.cancel();
    setTtsActive(false);
    setTtsPaused(false);
  }

  // ─── HU-29: Favoritos state ────────────────────────────────────────────────
  const [favorite, setFavorite] = useState(initialFavorite);
  const [favLoading, setFavLoading] = useState(false);
  const [favToast, setFavToast] = useState<string | null>(null);

  function showFavToast(msg: string) {
    setFavToast(msg);
    setTimeout(() => setFavToast(null), 3000);
  }

  async function toggleFavorite() {
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (favorite) {
        const res = await fetch(`/api/favoritos/${tramiteId}`, { method: "DELETE" });
        if (res.ok) { setFavorite(false); showFavToast("Trámite eliminado de favoritos."); }
      } else {
        const res = await fetch("/api/favoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tramiteId }),
        });
        if (res.ok) { setFavorite(true); showFavToast("Trámite guardado en favoritos."); }
        else if (res.status === 409) showFavToast("Este trámite ya está en tus favoritos.");
      }
    } catch {
      showFavToast("Error de conexión.");
    } finally {
      setFavLoading(false);
    }
  }

  // ─── HU-33: Calendario state ───────────────────────────────────────────────
  const [calModal, setCalModal] = useState(false);
  const [calDate, setCalDate] = useState("");
  const [calTime, setCalTime] = useState("09:00");
  const [calSynced, setCalSynced] = useState(false);
  const [calError, setCalError] = useState("");

  // Verificar si ya fue sincronizado (localStorage)
  useEffect(() => {
    if (typeof window !== "undefined" && tramiteId) {
      setCalSynced(!!localStorage.getItem(`tramix_cal_${tramiteId}`));
    }
  }, [tramiteId]);

  function openCalModal() {
    setCalError("");
    if (calSynced) {
      setCalError("Ya sincronizaste este trámite con tu calendario.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    setCalDate(today);
    setCalModal(true);
  }

  function syncCalendar() {
    if (!calDate) { setCalError("Selecciona una fecha para el recordatorio."); return; }
    try {
      const startDate = new Date(`${calDate}T${calTime}:00`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      const fmt = (d: Date) =>
        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      const url = new URL("https://www.google.com/calendar/render");
      url.searchParams.set("action", "TEMPLATE");
      url.searchParams.set("text", `Trámite: ${tramite.title}`);
      url.searchParams.set("dates", `${fmt(startDate)}/${fmt(endDate)}`);
      url.searchParams.set("details", tramite.description ?? "");
      url.searchParams.set("sf", "true");

      window.open(url.toString(), "_blank", "noopener,noreferrer");

      localStorage.setItem(`tramix_cal_${tramiteId}`, "1");
      setCalSynced(true);
      setCalModal(false);
    } catch {
      setCalError("No se pudo abrir el calendario. Verifica tu conexión o permisos del navegador.");
    }
  }

  const toggleReq = (id: string) => setCheckedReqs(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleVenue = (id: string) => setExpandedVenue(prev => prev === id ? null : id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Toast de favoritos */}
      {favToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-brand-primary-dark text-white px-6 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fade-in-down">
          {favToast}
        </div>
      )}

      {/* Modal de calendario */}
      {calModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Agregar al Calendario</h3>
              <button onClick={() => setCalModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-600">Se creará un recordatorio para <strong>{tramite.title}</strong>.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha</label>
                <input type="date" value={calDate} min={new Date().toISOString().split("T")[0]} onChange={e => setCalDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Hora</label>
                <input type="time" value={calTime} onChange={e => setCalTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
              </div>
            </div>
            {calError && <p className="text-red-600 text-sm">{calError}</p>}
            <p className="text-xs text-gray-400">Se abrirá Google Calendar para confirmar el evento.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setCalModal(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={syncCalendar} className="flex-1 bg-brand-primary text-white rounded-xl py-2.5 text-sm font-bold hover:bg-brand-primary-dark transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* ENLACE EXTERNO */}
      {tramite.externalLink && (
        <div className="bg-brand-secondary/10 p-4 border-b border-brand-secondary/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-brand-secondary-dark font-bold text-sm uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5" />
            Acceso Directo Oficial
          </div>
          <a href={tramite.externalLink} target="_blank" rel="noopener noreferrer"
            className="bg-brand-secondary text-brand-primary-dark font-bold px-6 py-2 rounded-xl hover:bg-brand-secondary-dark transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm">
            Consultar Estado de Documento en Registraduría
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* BARRA DE ACCIONES: TTS + Favorito + Calendario */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        {/* HU-27: Controles TTS */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {!ttsActive ? (
              <button onClick={ttsStart} title="Leer en voz alta"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-dark transition-all min-h-[36px]">
                <Volume2 className="w-4 h-4" /> {t.tramite.listenSection}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {ttsPaused ? (
                  <button onClick={ttsResume} title="Reanudar" className="p-2 rounded-xl bg-brand-primary text-white hover:bg-brand-primary-dark transition-all">
                    <Play className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={ttsPause} title="Pausar" className="p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all">
                    <Pause className="w-4 h-4" />
                  </button>
                )}
                <button onClick={ttsStop} title="Detener" className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all">
                  <Square className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 font-medium">{ttsPaused ? "Pausado" : "Leyendo..."}</span>
              </div>
            )}
          </div>
          {ttsError && (
            <p className="text-xs text-red-600 max-w-[280px]">{ttsError}</p>
          )}
        </div>

        {/* HU-29 + HU-33: Favorito y Calendario */}
        <div className="flex items-center gap-2">
          {/* HU-33: Botón calendario */}
          <div className="relative">
            <button onClick={openCalModal} title={calSynced ? "Ya sincronizado" : "Agregar al calendario"}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[36px] border ${
                calSynced
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
              }`}>
              <Calendar className="w-4 h-4" />
              {calSynced ? t.tramite.synced : t.tramite.addCalendar}
            </button>
            {calError && !calModal && (
              <div className="absolute top-full mt-1 right-0 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 whitespace-nowrap shadow-md z-10">
                {calError}
              </div>
            )}
          </div>

          {/* HU-29: Botón favorito */}
          <button onClick={toggleFavorite} disabled={favLoading} title={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[36px] border ${
              favorite
                ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                : "bg-white text-gray-700 border-gray-200 hover:border-rose-400 hover:text-rose-500"
            }`}>
            {favorite ? <HeartOff className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            {favorite ? t.tramite.removeFavorite : t.tramite.saveFavorite}
          </button>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {["pasos", "requisitos", "puntos", "tips"].map((tab) => {
          if (tab === "tips" && tramite.recomendaciones.length === 0) return null;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 text-sm font-bold min-h-[44px] min-w-[120px] transition capitalize
                ${activeTab === tab ? "text-brand-primary bg-brand-primary/10 border-b-2 border-brand-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}>
              {tab === "pasos" && t.tramite.procedure}
              {tab === "requisitos" && t.tramite.requirements}
              {tab === "puntos" && t.tramite.offices}
              {tab === "tips" && t.tramite.tips}
            </button>
          );
        })}
      </div>

      <div className="p-8">
        {/* HU-08: Pasos */}
        {activeTab === "pasos" && (
          <div>
            {tramite.pasos.length === 0 ? (
              <div className="bg-brand-primary/5 text-brand-primary-dark p-6 rounded-xl border border-brand-primary/10 text-center font-medium">
                El procedimiento detallado para este trámite se encuentra en construcción o no está disponible actualmente.
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col gap-4 border-l-2 border-gray-200 ml-3 pl-6">
                  {tramite.pasos.map((paso: any, idx: number) => (
                    <button key={paso.id} onClick={() => setCurrentStepIndex(idx)}
                      className={`relative text-left font-bold transition min-h-[44px] ${idx === currentStepIndex ? "text-brand-primary" : "text-slate-400 hover:text-slate-600"}`}>
                      <span className={`absolute -left-[35px] top-1 w-4 h-4 rounded-full border-2 bg-white ${idx === currentStepIndex ? "border-brand-primary" : "border-slate-300"}`}></span>
                      {`Paso ${idx + 1}`}
                    </button>
                  ))}
                </div>
                <div className="md:w-2/3 bg-gray-50 rounded-2xl p-8 border border-gray-100 relative min-h-[250px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tramite.pasos[currentStepIndex].title}</h3>
                    <p className="text-gray-600 leading-relaxed">{tramite.pasos[currentStepIndex].description}</p>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setCurrentStepIndex(i => Math.max(0, i - 1))} disabled={currentStepIndex === 0}
                      className="px-6 py-2 bg-white border border-gray-300 rounded font-semibold text-gray-700 disabled:opacity-50 min-h-[44px] min-w-[44px]">{t.tramite.previous}</button>
                    <button onClick={() => setCurrentStepIndex(i => Math.min(tramite.pasos.length - 1, i + 1))} disabled={currentStepIndex === tramite.pasos.length - 1}
                      className="px-8 py-2 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary-dark disabled:opacity-50 min-h-[44px] min-w-[44px] shadow-md transition-all active:scale-95">{t.tramite.next}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HU-09: Requisitos */}
        {activeTab === "requisitos" && (
          <div>
            {tramite.requisitos.length === 0 ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center font-medium flex items-center justify-center gap-2">
                <CheckCircle2 /> Este trámite no requiere presentar documentación previa.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">Marca los documentos que ya tienes listos:</p>
                {tramite.requisitos.map((req: any) => (
                  <button key={req.id} onClick={() => toggleReq(req.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition text-left min-h-[60px]
                      ${checkedReqs[req.id] ? "bg-green-50 border-green-500 text-green-900" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                    <div className="flex gap-4 items-center">
                      <FileText className={checkedReqs[req.id] ? "text-green-600" : "text-gray-400"} />
                      <span className="font-semibold text-lg">{req.title}</span>
                    </div>
                    {checkedReqs[req.id] ? <CheckCircle2 className="w-8 h-8 text-green-600" /> : <Circle className="w-8 h-8 text-gray-300" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HU-10: Puntos de Atención */}
        {activeTab === "puntos" && (
          <div>
            {tramite.isOnline ? (
              <div className="bg-brand-primary/5 text-brand-primary-dark p-8 rounded-xl border border-brand-primary/10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-brand-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-brand-secondary-dark" />
                </div>
                <h2 className="text-xl font-bold mb-2">Este trámite es 100% en línea.</h2>
                <p>No requiere asistencia presencial en ninguna sede.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tramite.puntosAtencion.filter((p: any) => !p.status || p.status === "activo").map((punto: any) => (
                  <div key={punto.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button onClick={() => toggleVenue(punto.id)} className="w-full flex items-center justify-between p-6 bg-white min-h-[44px]">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-gray-400" />
                        <span className="font-bold text-gray-900">{punto.address}</span>
                      </div>
                      {expandedVenue === punto.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </button>
                    {expandedVenue === punto.id && (
                      <div className="p-6 border-t border-gray-200 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-slate-700">
                          <Clock className="w-5 h-5 text-brand-secondary" />
                          <span className="font-medium">Horario: {punto.schedule}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                          <Phone className="w-5 h-5 text-brand-secondary" />
                          <span className="font-medium">Teléfono: {punto.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HU-11: Recomendaciones */}
        {activeTab === "tips" && (
          <div>
            {tramite.recomendaciones.length === 0 ? (
              <div className="bg-gray-50 text-gray-700 p-6 rounded-xl border border-gray-200 text-center font-medium">
                No hay recomendaciones adicionales registradas.
              </div>
            ) : (
              <ul className="space-y-4 list-none pl-0">
                {tramite.recomendaciones.map((rec: any) => {
                  const isTargeted = rec.targetAgeRange && rec.targetAgeRange === userAge;
                  return (
                    <li key={rec.id} className={`p-6 rounded-xl flex gap-4 ${isTargeted ? "bg-yellow-50 border-2 border-yellow-400" : "bg-gray-50 border border-gray-200"}`}>
                      <div className="flex-shrink-0 mt-1">
                        <AlertCircle className={isTargeted ? "text-yellow-600" : "text-gray-400"} />
                      </div>
                      <div>
                        {isTargeted && <span className="block text-yellow-800 font-bold text-sm mb-1 uppercase tracking-wide">Tip personalizado: Atención preferencial disponible para su edad</span>}
                        <p className={isTargeted ? "text-yellow-900 font-medium" : "text-gray-700 font-medium"}>{rec.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
