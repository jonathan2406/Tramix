import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, surname: true, documentType: true, documentNumber: true, ageRange: true }
  });
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const { name, surname, documentType, documentNumber, ageRange } = body;

  if (!name || !surname || !documentType || !documentNumber || !ageRange) {
     return NextResponse.json({ message: "Todos los campos obligatorios deben estar llenos" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: { name, surname, documentType, documentNumber, ageRange }
  });

  return NextResponse.json({ message: "Datos actualizados correctamente" });
}
