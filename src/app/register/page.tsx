"use client";
import { useState } from "react";
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  // HU-01: Contraseña de mínimo 8 caracteres alfanuméricos
  const isValidPassword = (pwd: string) => {
    return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidPassword(formData.password)) {
      setError("La contraseña debe tener al menos 8 caracteres, letras y números");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Error al registrar");
    } else {
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Crear Cuenta</h1>
        
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
              className={`mt-1 block w-full px-4 py-2 rounded-lg border focus:ring-blue-500 focus:border-blue-500`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              required
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${error.includes("correo") ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              required
              title="Mínimo 8 caracteres, al menos 1 letra y 1 número."
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${error.includes("contraseña") ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex items-start mt-4">
            <input
              type="checkbox"
              id="terms"
              required
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Acepto <button type="button" onClick={() => setShowTerms(true)} className="text-blue-600 underline">términos y condiciones</button> y 
              política de privacidad.
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
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
                className="w-full bg-blue-600 text-white py-2 rounded"
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
