"use client";

import { useState, useEffect } from "react";
import { Type, ZoomIn, ZoomOut, RotateCcw, Contrast } from "lucide-react";

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState("normal");
  const [zoom, setZoom] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === "large") {
      root.style.fontSize = "125%";
    } else if (fontSize === "small") {
      root.style.fontSize = "85%";
    } else {
      root.style.fontSize = "100%";
    }
  }, [fontSize]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.style.transform = `scale(${zoom})`;
      main.style.transformOrigin = "top center";
    }
  }, [zoom]);

  // HU-15: Alto contraste — alterna atributo en <html>
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.setAttribute("data-contrast", "high");
    } else {
      root.removeAttribute("data-contrast");
    }
  }, [highContrast]);

  const reset = () => {
    setFontSize("normal");
    setZoom(1);
    setHighContrast(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-brand-primary/20 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-1">
          <Type className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-bold text-gray-500 uppercase">Accesibilidad</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setFontSize("small")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${fontSize === "small" ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title="Fuente Pequeña"
          >
            A-
          </button>
          <button 
            onClick={() => setFontSize("normal")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${fontSize === "normal" ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title="Fuente Normal"
          >
            A
          </button>
          <button 
            onClick={() => setFontSize("large")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all ${fontSize === "large" ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title="Fuente Grande"
          >
            A+
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setZoom(prev => Math.max(0.8, prev - 0.1))}
            className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all"
            title="Reducir Zoom"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-bold">
            {Math.round(zoom * 100)}%
          </div>
          <button 
            onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
            className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        {/* HU-15: Toggle Alto Contraste */}
        <button
          onClick={() => setHighContrast((prev) => !prev)}
          className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            highContrast
              ? "bg-gray-900 text-yellow-300 hover:bg-black"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title="Alto Contraste"
        >
          <Contrast className="w-3.5 h-3.5" />
          {highContrast ? "Contraste: Alto" : "Alto Contraste"}
        </button>

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
