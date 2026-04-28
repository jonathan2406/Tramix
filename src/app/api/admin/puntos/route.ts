import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function requireStaff() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  return (user?.role === "developer" || user?.role === "funcionario") ? user : null;
}

// HU-14: Crear nuevo punto de atención
export async function POST(req: NextRequest) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const { address, city, schedule, phone, tramiteId, status } = body;

  if (!address || !city || !schedule || !phone || !tramiteId) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const punto = await prisma.puntoAtencion.create({
    data: { address, city, schedule, phone, tramiteId, status: status ?? "activo" },
  });

  return NextResponse.json(punto, { status: 201 });
}
