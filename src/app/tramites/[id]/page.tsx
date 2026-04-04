import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import TramiteClient from "./TramiteClient";

const prisma = new PrismaClient();

export default async function TramitePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  const user = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { ageRange: true }
  }) : null;

  const tramite = await prisma.tramite.findUnique({
    where: { id: params.id },
    include: {
      pasos: { orderBy: { order: 'asc' } },
      requisitos: true,
      puntosAtencion: true,
      recomendaciones: true,
      categoria: true,
    }
  });

  if (!tramite) notFound();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 pb-4 border border-gray-100 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold tracking-wider">{tramite.code}</span>
            {tramite.isOnline && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">100% Online</span>}
            {tramite.categoria && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">{tramite.categoria.name}</span>}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{tramite.title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{tramite.description}</p>
      </div>

      <TramiteClient tramite={tramite} userAge={user?.ageRange} />
    </div>
  );
}
