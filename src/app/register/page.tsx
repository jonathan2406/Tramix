"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    termsAccepted: false,
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  // HU-01: Contraseña de mínimo 8 caracteres alfanuméricos
  const isValidPassword = (pwd: string) => {
    return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  useEffect(() => {
    if (formData.email !== "" && !isValidEmail(formData.email)) {
      setEmailError("Formato de correo inválido");
    } else {
      setEmailError("");
    }

    if (formData.password !== "" && formData.password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
    } else if (formData.password !== "" && !isValidPassword(formData.password)) {
      setPasswordError("La contraseña debe ser alfanumérica");
    } else {
      setPasswordError("");
    }
  }, [formData.email, formData.password]);

  const isFormValid = formData.name !== "" && formData.email !== "" && formData.password !== "" && formData.termsAccepted && !emailError && !passwordError;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isFormValid) return;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Error al registrar");
    } else {
      // HU-01: limpia el formulario y muestra una alerta verde
      setFormData({ name: "", email: "", password: "", termsAccepted: false });
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4 relative overflow-hidden">
      {/* Decorative blobs for auth */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-brand-primary/5 p-10 border border-white relative z-10">
        <h1 className="text-3xl font-black text-brand-primary-dark text-center mb-8 tracking-tight">Crear Cuenta</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              required
              className={`mt-1 block w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none border-slate-200`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              required
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${emailError ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              required
              title="Mínimo 8 caracteres, al menos 1 letra y 1 número."
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${passwordError ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <div className="flex items-start mt-4">
            <input
              type="checkbox"
              id="terms"
              required
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              className="mt-1 h-5 w-5 text-brand-primary focus:ring-brand-primary border-slate-300 rounded-md cursor-pointer"
            />
            <label htmlFor="terms" className="ml-3 block text-sm text-slate-600 font-medium leading-relaxed">
              Acepto <button type="button" onClick={() => setShowTerms(true)} className="text-brand-primary font-bold hover:underline">términos y condiciones</button> y 
              <button type="button" onClick={() => setShowTerms(true)} className="text-brand-primary font-bold hover:underline ml-1">política de privacidad</button>.
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full mt-6 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] ${!isFormValid ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-brand-primary hover:bg-brand-primary-dark shadow-brand-primary/20"}`}
          >
            Registrarse
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesión</Link>
        </p>

        {showTerms && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Política de Privacidad y Términos</h2>
              <p className="text-sm text-gray-600 mb-4 h-48 overflow-y-auto">
                Al aceptar estos términos, consientes el tratamiento de tus datos personales,
                los cuales serán guardados y auditados (con timestamp) en nuestros servidores y base de datos con motivos de uso de TRAMIX.
                Uso de datos unicamente para facilitacion de tramites.
              </p>
              <button 
                onClick={() => setShowTerms(false)}
                className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-primary-dark transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
