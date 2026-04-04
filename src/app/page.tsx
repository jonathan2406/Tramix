import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4 rounded-3xl mt-4 border border-gray-100 shadow-sm relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 max-w-3xl">
         <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
           Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">TRAMIX</span>
         </h1>
         <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
           La plataforma digital inteligente para gestionar y consultar tus trámites sociales, académicos y gubernamentales sin complicaciones.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           {session ? (
             <Link 
               href="/dashboard"
               className="bg-blue-600 text-white font-bold text-lg px-10 py-5 rounded-2xl min-h-[44px] min-w-[44px] hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
             >
               Ir a mi Dashboard
             </Link>
           ) : (
             <>
               <Link 
                 href="/login"
                 className="bg-blue-600 text-white font-bold text-lg px-10 py-5 rounded-2xl min-h-[44px] min-w-[44px] hover:bg-blue-700 transition shadow-lg w-full sm:w-auto"
               >
                 Iniciar Sesión
               </Link>
               <Link 
                 href="/register"
                 className="bg-white border-2 border-gray-200 text-gray-800 font-bold text-lg px-10 py-5 rounded-2xl min-h-[44px] min-w-[44px] hover:border-gray-300 hover:bg-gray-50 transition shadow-sm w-full sm:w-auto"
               >
                 Registrarse
               </Link>
             </>
           )}
         </div>
      </div>
    </div>
  );
}
