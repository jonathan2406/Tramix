import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm text-center px-4 rounded-[3rem] mt-4 border border-brand-primary/5 shadow-xl shadow-brand-primary/5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 max-w-3xl">
         <h1 className="text-5xl md:text-7xl font-black tracking-tight text-brand-primary-dark mb-8 leading-[1.1]">
           Gestiona tus trámites con <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary">TRAMIX</span>
         </h1>
         <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
           La plataforma digital inteligente para gestionar tus trámites sociales, académicos y gubernamentales de forma sencilla y eficiente.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {session ? (
              <Link 
                href="/dashboard"
                className="bg-brand-primary text-white font-bold text-lg px-12 py-5 rounded-2xl min-h-[44px] min-w-[44px] hover:bg-brand-primary-dark transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Ir a mi Dashboard
                <div className="bg-brand-secondary rounded-full p-1 ml-1">
                   <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="bg-brand-primary text-white font-bold text-lg px-12 py-5 rounded-2xl min-h-[44px] min-w-[44px] hover:bg-brand-primary-dark transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 w-full sm:w-auto"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/register"
                  className="bg-white border-2 border-brand-secondary/30 text-brand-primary-dark font-bold text-lg px-12 py-5 rounded-2xl min-h-[44px] min-w-[44px] hover:border-brand-secondary hover:bg-brand-bg transition-all shadow-sm w-full sm:w-auto"
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
