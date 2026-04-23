import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

async function requireDeveloper() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  return user?.role === "developer" ? user : null;
}

// HU-14: Crear nuevo punto de atención
export async function POST(req: NextRequest) {
  const dev = await requireDeveloper();
  if (!dev) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const { address, schedule, phone, tramiteId, status } = body;

  if (!address || !schedule || !phone || !tramiteId) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const punto = await prisma.puntoAtencion.create({
    data: { address, schedule, phone, tramiteId, status: status ?? "activo" },
  });

  return NextResponse.json(punto, { status: 201 });
}
