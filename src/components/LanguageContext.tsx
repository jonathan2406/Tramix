"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "@/lib/translations";

type T = typeof translations[Language];

type LanguageContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: T;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  setLang: () => {},
  t: translations.es as T,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("es");

  // HU-36: Al montar, primero localStorage (instantáneo), luego sincroniza con DB
  useEffect(() => {
    const stored = localStorage.getItem("tramix_lang") as Language | null;
    if (stored === "es" || stored === "en") setLangState(stored);

    // Sincronizar desde DB (cubre el caso cross-device)
    fetch("/api/profile/language")
      .then(r => r.json())
      .then(({ preferredLanguage }) => {
        if (preferredLanguage === "es" || preferredLanguage === "en") {
          setLangState(preferredLanguage);
          localStorage.setItem("tramix_lang", preferredLanguage);
        }
      })
      .catch(() => {});
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem("tramix_lang", l);
    // Sincronizar con DB si el usuario está autenticado (best-effort)
    fetch("/api/profile/language", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredLanguage: l }),
    }).catch(() => {});
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as T }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
