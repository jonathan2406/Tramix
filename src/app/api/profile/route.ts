import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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

  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  const isFirstTime = currentUser?.profileStatus === "Incompleto";

  await prisma.user.update({
    where: { email: session.user.email },
    data: { name, surname, documentType, documentNumber, ageRange, profileStatus: "Completo" }
  });

  revalidatePath('/dashboard');

  const responseMessage = isFirstTime ? "Información guardada exitosamente" : "Datos actualizados correctamente";
  return NextResponse.json({ message: responseMessage });
}
