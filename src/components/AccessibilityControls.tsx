"use client";

import { useState, useEffect, useRef } from "react";
import { Type, ZoomIn, ZoomOut, RotateCcw, Contrast, Volume2, VolumeX, Pause, Play, Square } from "lucide-react";

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState("normal");
  const [zoom, setZoom] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  // ─── HU-27: TalkBack ───────────────────────────────────────────────────────
  const [talkback, setTalkback] = useState(false);
  const [tbSpeaking, setTbSpeaking] = useState(false);
  const [tbPaused, setTbPaused] = useState(false);
  const tbUttRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Listener de click global para TalkBack
  useEffect(() => {
    if (!talkback) {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      setTbSpeaking(false);
      setTbPaused(false);
      return;
    }

    function handleClick(e: MouseEvent) {
      const el = e.target as HTMLElement;

      // Ignorar clicks dentro del propio panel de accesibilidad
      if (el.closest("[data-talkback-ignore]")) return;

      // Obtener el texto más relevante del elemento clickeado
      const text = (
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        el.innerText ||
        el.textContent ||
        ""
      ).trim();

      if (!text || text.length < 2) return;
      if (!("speechSynthesis" in window)) return;

      const readText = text.slice(0, 500); // límite razonable

      window.speechSynthesis.cancel();

      const utt = new SpeechSynthesisUtterance(readText);
      utt.rate = 0.9;

      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find((v) => v.lang.startsWith("es"));
      if (spanishVoice) utt.voice = spanishVoice;

      utt.onend = () => { setTbSpeaking(false); setTbPaused(false); tbUttRef.current = null; };
      utt.onerror = (ev) => {
        if (ev.error !== "interrupted" && ev.error !== "canceled") {
          setTbSpeaking(false);
        }
        setTbSpeaking(false);
        setTbPaused(false);
        tbUttRef.current = null;
      };

      tbUttRef.current = utt;
      window.speechSynthesis.speak(utt);
      setTbSpeaking(true);
      setTbPaused(false);
    }

    // Captura en fase de captura para interceptar antes que otros handlers
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [talkback]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  function tbPause() {
    window.speechSynthesis?.pause();
    setTbPaused(true);
  }
  function tbResume() {
    window.speechSynthesis?.resume();
    setTbPaused(false);
  }
  function tbStop() {
    window.speechSynthesis?.cancel();
    setTbSpeaking(false);
    setTbPaused(false);
    tbUttRef.current = null;
  }

  // ─── Accesibilidad visual ──────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === "large") root.style.fontSize = "125%";
    else if (fontSize === "small") root.style.fontSize = "85%";
    else root.style.fontSize = "100%";
  }, [fontSize]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.style.transform = `scale(${zoom})`;
      main.style.transformOrigin = "top center";
    }
  }, [zoom]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
  }, [highContrast]);

  const reset = () => {
    setFontSize("normal");
    setZoom(1);
    setHighContrast(false);
    setTalkback(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2" data-talkback-ignore>
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-brand-primary/20 flex flex-col gap-3">

        {/* Etiqueta */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-1">
          <Type className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-bold text-gray-500 uppercase">Accesibilidad</span>
        </div>

        {/* Tamaño de fuente */}
        <div className="flex gap-2">
          <button
            onClick={() => setFontSize("small")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${fontSize === "small" ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            title="Fuente Pequeña"
          >A-</button>
          <button
            onClick={() => setFontSize("normal")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${fontSize === "normal" ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            title="Fuente Normal"
          >A</button>
          <button
            onClick={() => setFontSize("large")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all ${fontSize === "large" ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            title="Fuente Grande"
          >A+</button>
        </div>

        {/* Zoom */}
        <div className="flex gap-2">
          <button
            onClick={() => setZoom(prev => Math.max(0.8, prev - 0.1))}
            className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all"
            title="Reducir Zoom"
          ><ZoomOut className="w-5 h-5" /></button>
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-bold">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
            className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all"
            title="Aumentar Zoom"
          ><ZoomIn className="w-5 h-5" /></button>
        </div>

        {/* Alto contraste */}
        <button
          onClick={() => setHighContrast(prev => !prev)}
          className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${highContrast ? "bg-gray-900 text-yellow-300 hover:bg-black" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          title="Alto Contraste"
        >
          <Contrast className="w-3.5 h-3.5" />
          {highContrast ? "Contraste: Alto" : "Alto Contraste"}
        </button>

        {/* HU-27: TalkBack */}
        <div className="border-t border-gray-100 pt-2 flex flex-col gap-2">
          <button
            onClick={() => setTalkback(prev => !prev)}
            className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${talkback ? "bg-brand-primary text-white hover:bg-brand-primary-dark" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            title="Leer en voz alta al hacer clic"
          >
            {talkback ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {talkback ? "Lectura activa" : "Activar lectura"}
          </button>

          {/* Controles de reproducción cuando TalkBack está leyendo */}
          {talkback && tbSpeaking && (
            <div className="flex gap-1.5 justify-center">
              {tbPaused ? (
                <button
                  onClick={tbResume}
                  className="flex-1 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-bold flex items-center justify-center gap-1 hover:bg-brand-primary/20 transition-all"
                >
                  <Play className="w-3 h-3" /> Reanudar
                </button>
              ) : (
                <button
                  onClick={tbPause}
                  className="flex-1 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold flex items-center justify-center gap-1 hover:bg-amber-100 transition-all"
                >
                  <Pause className="w-3 h-3" /> Pausar
                </button>
              )}
              <button
                onClick={tbStop}
                className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100 transition-all"
              >
                <Square className="w-3 h-3" /> Detener
              </button>
            </div>
          )}

          {talkback && !tbSpeaking && (
            <p className="text-xs text-center text-gray-400 italic">
              Haz clic en cualquier texto
            </p>
          )}
        </div>

        {/* Restablecer */}
        <button
          onClick={reset}
          className="w-full py-2 rounded-lg bg-brand-secondary/20 text-brand-secondary-dark text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary/30 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          Restablecer
        </button>
      </div>
    </div>
  );
}
