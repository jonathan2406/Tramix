"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import VisualSignSupport from "@/components/visual-sign/VisualSignSupport";

function ProfileForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAgeSetup = searchParams.get("setup") === "age";
  const { lang, setLang, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    documentType: "",
    documentNumber: "",
    ageRange: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            surname: data.surname || "",
            documentType: data.documentType || "",
            documentNumber: data.documentNumber || "",
            ageRange: data.ageRange || "",
          });
          setLoading(false);
        });
    }
  }, [status, router]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = t.profile.required;
    if (!formData.surname) newErrors.surname = t.profile.required;
    if (!formData.documentType) newErrors.documentType = t.profile.required;
    if (!formData.documentNumber) newErrors.documentNumber = t.profile.required;
    if (!formData.ageRange) newErrors.ageRange = t.profile.required;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Error al guardar", "error");
      } else {
        showToast(data.message || "Información guardada exitosamente", "success");
        // HU-21: Redirigir al dashboard después de configurar la edad
        if (isAgeSetup && formData.ageRange) {
          setTimeout(() => router.push("/dashboard"), 1200);
        }
      }
    } catch {
      showToast("Error de conexión", "error");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-8 relative">
      {toast && (
        <div className={`absolute top-4 right-4 px-6 py-3 rounded-xl shadow-xl z-50 text-white font-bold animate-fade-in-down ${toast.type === "success" ? "bg-brand-secondary" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

      {/* HU-21: Aviso cuando viene a configurar su edad antes de acceder al dashboard */}
      {isAgeSetup && (
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-4 flex items-start gap-3">
          <span className="text-amber-500 text-xl leading-none mt-0.5">!</span>
          <p className="text-amber-800 text-sm font-medium">{t.profile.ageSetupNotice}</p>
        </div>
      )}

      <div className="bg-brand-primary px-8 py-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-3xl font-black tracking-tight">{t.profile.title}</h1>
        <p className="text-white/80 text-sm mt-2 font-medium">{t.profile.subtitle}</p>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium text-gray-700">{t.profile.name} *</label>
            <input
              type="text"
              className={`block w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none ${errors.name ? "border-red-500" : "border-slate-200"}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{t.profile.required}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t.profile.surname} *</label>
            <input
              type="text"
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${errors.surname ? "border-red-500" : "border-gray-300"} focus:outline-none`}
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
            {errors.surname && <p className="text-red-500 text-xs mt-1">{t.profile.required}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t.profile.docType} *</label>
            <select
              className={`mt-1 block w-full px-4 py-2 rounded-lg border bg-white ${errors.documentType ? "border-red-500" : "border-gray-300"} focus:outline-none`}
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            >
              <option value="">{t.profile.selectOption}</option>
              <option value="CC">{t.profile.docOptions.cc}</option>
              <option value="TI">{t.profile.docOptions.ti}</option>
              <option value="CE">{t.profile.docOptions.ce}</option>
            </select>
            {errors.documentType && <p className="text-red-500 text-xs mt-1">{t.profile.required}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t.profile.docNumber} *</label>
            <input
              type="text"
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${errors.documentNumber ? "border-red-500" : "border-gray-300"} focus:outline-none`}
              value={formData.documentNumber}
              onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
            />
            {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{t.profile.required}</p>}
          </div>

        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            {t.profile.ageRange} {errors.ageRange && <span className="text-red-500">⚠</span>}
          </label>
          <p className="text-xs text-gray-500 mb-2">{t.profile.ageRangeHint}</p>
          <select
            className={`block w-full md:w-1/2 px-4 py-2 rounded-lg border bg-white ${errors.ageRange ? "border-red-500" : "border-gray-300"} focus:outline-none`}
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
          >
            <option value="">{t.profile.selectOption}</option>
            {Object.entries(t.profile.ageOptions).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          {errors.ageRange && <p className="text-red-500 text-xs mt-1">{t.profile.required}</p>}
        </div>

        {/* HU-36: Selector de idioma en el perfil */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700">{t.profile.language}</label>
          <p className="text-xs text-gray-500 mb-2">{t.profile.languageHint}</p>
          <div className="flex gap-3">
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  lang === l
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary/50"
                }`}
              >
                {t.profile.langOptions[l]}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            className="bg-brand-primary text-white font-bold px-10 py-4 rounded-xl min-h-[44px] min-w-[44px] hover:bg-brand-primary-dark transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
          >
            {t.profile.saveButton}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando perfil...</div>}>
      <>
        <ProfileForm />
        <VisualSignSupport />
      </>
    </Suspense>
  );
}
