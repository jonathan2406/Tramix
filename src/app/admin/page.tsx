import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, name: true },
  });

  if (user?.role !== "developer") redirect("/dashboard");

  const tramites = await prisma.tramite.findMany({
    include: { categoria: true, puntosAtencion: true },
    orderBy: { createdAt: "desc" },
  });

  const allPuntos = await prisma.puntoAtencion.findMany({
    include: { tramite: { select: { title: true } } },
    orderBy: { tramiteId: "asc" },
  });

  const tramitesList = tramites.map((t) => ({ id: t.id, title: t.title }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-2">Desarrollador: {user?.name}. Gestiona trámites y puntos de atención.</p>
      </div>
      <AdminClient tramites={tramites as any} puntos={allPuntos as any} tramitesList={tramitesList} />
    </div>
  );
}
