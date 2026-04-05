"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    let newErrors: Record<string, string> = {};

    // Validate empty fields locally 
    if (!formData.name) newErrors.name = "Este campo es requerido";
    if (!formData.surname) newErrors.surname = "Este campo es requerido";
    if (!formData.documentType) newErrors.documentType = "Este campo es requerido";
    if (!formData.documentNumber) newErrors.documentNumber = "Este campo es requerido";
    if (!formData.ageRange) newErrors.ageRange = "Debes seleccionar un rango de edad para personalizar tu experiencia";

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

      <div className="bg-brand-primary px-8 py-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-3xl font-black tracking-tight">Mi Perfil</h1>
        <p className="text-white/80 text-sm mt-2 font-medium">Configura tus datos para recibir una experiencia personalizada en <span className="font-bold">TRAMIX</span>.</p>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombres *</label>
            <input
              type="text"
            className={`block w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none ${errors.name || errors.surname || errors.documentType || errors.documentNumber || errors.ageRange ? 'border-red-500' : 'border-slate-200'}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos *</label>
            <input
              type="text"
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${errors.surname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none`}
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
            {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Documento *</label>
            <select
              className={`mt-1 block w-full px-4 py-2 rounded-lg border bg-white ${errors.documentType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none`}
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            >
              <option value="">Seleccione una opción</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
            </select>
            {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Documento *</label>
            <input
              type="text"
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${errors.documentNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none`}
              value={formData.documentNumber}
              onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
            />
            {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
          </div>

        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            Rango de Edad {errors.ageRange && <span className="text-red-500">⚠️</span>}
          </label>
          <p className="text-xs text-gray-500 mb-2">Se utilizará para personalizar las recomendaciones.</p>
          <select
            className={`block w-full md:w-1/2 px-4 py-2 rounded-lg border bg-white ${errors.ageRange ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none`}
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
          >
            <option value="">Seleccione una opción</option>
            <option value="14-17">14 a 17 años</option>
            <option value="18-25">18 a 25 años</option>
            <option value="26-35">26 a 35 años</option>
            <option value="36-59">36 a 59 años</option>
            <option value="60+">60 años o más</option>
          </select>
          {errors.ageRange && <p className="text-red-500 text-xs mt-1">{errors.ageRange}</p>}
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            className="bg-brand-primary text-white font-bold px-10 py-4 rounded-xl min-h-[44px] min-w-[44px] hover:bg-brand-primary-dark transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
          >
            Guardar y Actualizar
          </button>
        </div>

      </form>
    </div>
  );
}
