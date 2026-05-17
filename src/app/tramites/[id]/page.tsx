import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import TramiteClient from "./TramiteClient";

const prisma = new PrismaClient();

const AGE_ORDER = ["14-17", "18-25", "26-35", "36-59", "60+"];
const PRIVILEGED_ROLES = ["funcionario", "developer"];

export default async function TramitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const user = session.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { ageRange: true, role: true, id: true }
  }) : null;

  const tramite = await prisma.tramite.findUnique({
    where: { id },
    include: {
      pasos: { orderBy: { order: 'asc' } },
      requisitos: true,
      puntosAtencion: true,
      recomendaciones: true,
      categoria: true,
    }
  });

  if (!tramite) notFound();

  const isPrivileged = PRIVILEGED_ROLES.includes(user?.role ?? "");

  // HU-21: Verificar si el usuario tiene la edad requerida para ver este trámite
  if (!isPrivileged && tramite.targetAgeRange) {
    if (!user?.ageRange) {
      redirect("/profile?setup=age");
    }
    const userIdx = AGE_ORDER.indexOf(user.ageRange);
    const tramiteIdx = AGE_ORDER.indexOf(tramite.targetAgeRange);
    if (userIdx < tramiteIdx) {
      redirect("/dashboard?error=age");
    }
  }

  // HU-29: Verificar si el trámite ya está en favoritos del usuario
  let isFavorite = false;
  if (user?.id) {
    const fav = await prisma.favorito.findUnique({
      where: { userId_tramiteId: { userId: user.id, tramiteId: id } }
    });
    isFavorite = !!fav;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-brand-primary/10 p-10 border border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>

        <div className="flex flex-wrap gap-4 items-center mb-6 relative z-10">
          <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-black tracking-widest uppercase">{tramite.code}</span>
          {tramite.isOnline && <span className="px-4 py-1.5 bg-brand-secondary/20 text-brand-secondary-dark rounded-xl text-sm font-bold ring-1 ring-brand-secondary/30">100% Online</span>}
          {tramite.categoria && <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-bold">{tramite.categoria.name}</span>}
          {(tramite as any).estimatedTime && <span className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-bold flex items-center gap-1">⏳ {(tramite as any).estimatedTime}</span>}
          {(tramite as any).estimatedCost && <span className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold flex items-center gap-1">💰 {(tramite as any).estimatedCost}</span>}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-primary-dark leading-[1.1] mb-4 relative z-10 tracking-tight">{tramite.title}</h1>
        <p className="text-slate-600 text-xl leading-relaxed font-medium max-w-4xl relative z-10">{tramite.description}</p>
      </div>

      <TramiteClient tramite={tramite} userAge={user?.ageRange} isFavorite={isFavorite} tramiteId={id} />
    </div>
  );
}
