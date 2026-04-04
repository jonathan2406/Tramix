import { PrismaClient } from '@prisma/client';
import DashboardClient from './DashboardClient';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // HU-05: Age Range Recommendations for later use, but for dashboard we just fetch basics
  const user = await prisma.user.findUnique({
    where: { email: session.user!.email as string },
    select: { ageRange: true, name: true }
  });

  const categorias = await prisma.categoria.findMany();
  const tramites = await prisma.tramite.findMany({
    include: { categoria: true }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Hola, {user?.name || "Usuario"}! 👋</h1>
        <p className="text-gray-500 mt-2">Bienvenido a TRAMIX. Encuentra y gestiona tus trámites rápidamente.</p>
      </div>

      <DashboardClient categorias={categorias} tramites={tramites} userAge={user?.ageRange} />
    </div>
  );
}
