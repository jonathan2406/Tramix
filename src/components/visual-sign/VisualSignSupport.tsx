"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { getVisualSequence } from "@/lib/visual-sign-dictionary";
import { useTextSelection } from "@/components/visual-sign/useTextSelection";

type VisualSignItem = {
  key: string;
  label: string;
  imageUrl: string;
  alt: string;
  isPlaceholder?: boolean;
};

export default function VisualSignSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeText, setActiveText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const { selectionText, position, clearSelection } = useTextSelection({
    disabled: isOpen,
    minLength: 2,
  });

  const sequence = useMemo(() => getVisualSequence(activeText), [activeText]) as VisualSignItem[];
  const currentItem = sequence[currentIndex];
  const canAutoPlay = !prefersReducedMotion && sequence.length > 1;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    setCurrentIndex(0);
    setIsPlaying(false);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [isOpen, activeText]);

  useEffect(() => {
    if (!canAutoPlay && isPlaying) setIsPlaying(false);
  }, [canAutoPlay, isPlaying]);

  useEffect(() => {
    if (!isOpen || !isPlaying || !canAutoPlay) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sequence.length);
    }, 2500);
    return () => window.clearInterval(interval);
  }, [isOpen, isPlaying, canAutoPlay, sequence.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    if (!selectionText) return;
    setActiveText(selectionText);
    clearSelection();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsPlaying(false);
    lastActiveRef.current?.focus();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sequence.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sequence.length);
  };

  const togglePlay = () => {
    if (!canAutoPlay) return;
    setIsPlaying((prev) => !prev);
  };

  const hasSelection = selectionText.length >= 2 && position;

  return (
    <>
      {hasSelection && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed z-[90] px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-primary-dark transition-all"
          style={{ left: position.x, top: position.y }}
          aria-label="Ver apoyo visual"
          data-visual-sign-ignore
        >
          Ver apoyo visual
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/40 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="visual-sign-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
          data-visual-sign-ignore
        >
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-brand-primary/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 id="visual-sign-title" className="text-lg font-bold text-gray-900">
                  Apoyo visual
                </h2>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                  Apoyo visual basado en signos e imagenes. Esta funcion esta en beta y no reemplaza una interpretacion certificada.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Cerrar
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2">
                  Texto seleccionado
                </p>
                <p className="text-sm text-gray-700">{activeText}</p>
              </div>

              {sequence.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    No tenemos apoyo visual para este texto todavia.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Puedes intentar seleccionar una palabra mas corta o una frase comun.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-6">
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center">
                    <div className="w-full max-w-md aspect-[4/3] bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                      {currentItem && (
                        <img
                          src={currentItem.imageUrl}
                          alt={currentItem.alt}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-bold text-gray-900">{currentItem?.label}</p>
                      {currentItem?.isPlaceholder && (
                        <p className="text-xs text-amber-600 font-semibold mt-1">Placeholder</p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                      </button>
                      <button
                        type="button"
                        onClick={togglePlay}
                        disabled={!canAutoPlay}
                        aria-pressed={isPlaying}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          canAutoPlay
                            ? "bg-brand-primary text-white border-brand-primary hover:bg-brand-primary-dark"
                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? "Pausar" : "Reproducir"}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Paso {currentIndex + 1} de {sequence.length}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-3">
                      Secuencia
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {sequence.map((item, index) => (
                        <button
                          key={`${item.key}-${index}`}
                          type="button"
                          onClick={() => setCurrentIndex(index)}
                          className={`rounded-xl border p-2 text-left transition-all ${
                            index === currentIndex
                              ? "border-brand-primary bg-white shadow-sm"
                              : "border-gray-200 bg-white hover:border-brand-primary/40"
                          }`}
                        >
                          <div className="w-full aspect-[4/3] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                              src={item.imageUrl}
                              alt={item.alt}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs font-semibold text-gray-700 mt-2">{item.label}</p>
                          {item.isPlaceholder && (
                            <p className="text-[10px] text-amber-600 font-semibold">Placeholder</p>
                          )}
                        </button>
                      ))}
                    </div>
                    {!canAutoPlay && prefersReducedMotion && (
                      <p className="text-[11px] text-gray-400 mt-3">
                        Auto desactivado por preferencias de movimiento.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
