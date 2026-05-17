import { PrismaClient } from '@prisma/client';
import DashboardClient from './DashboardClient';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const PRIVILEGED_ROLES = ["funcionario", "developer"];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email as string },
    select: { ageRange: true, name: true, role: true }
  });

  // HU-21: Usuarios con rol normal deben configurar su rango de edad antes de acceder
  const isPrivileged = PRIVILEGED_ROLES.includes(user?.role ?? "");
  if (!isPrivileged && !user?.ageRange) {
    redirect("/profile?setup=age");
  }

  const categorias = await prisma.categoria.findMany();
  const tramites = await prisma.tramite.findMany({
    where: { published: true },
    include: { categoria: true }
  });

  const puntosAtencion = await prisma.puntoAtencion.findMany({
    include: { tramite: { select: { title: true, categoria: { select: { name: true } } } } }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Hola, {user?.name || "Usuario"}!</h1>
        <p className="text-gray-500 mt-2">Bienvenido a TRAMIX. Encuentra y gestiona tus trámites rápidamente.</p>
      </div>

      <DashboardClient
        categorias={categorias}
        tramites={tramites as any}
        userAge={user?.ageRange}
        userRole={user?.role}
        puntosAtencion={puntosAtencion as any}
      />
    </div>
  );
}
