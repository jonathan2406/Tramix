import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// HU-36: Actualizar idioma preferido en DB
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { preferredLanguage } = await request.json();
  if (!["es", "en"].includes(preferredLanguage)) {
    return NextResponse.json({ message: "Idioma no válido" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { preferredLanguage },
  });

  return NextResponse.json({ message: "Idioma actualizado." });
}

// HU-36: Obtener idioma guardado en DB para sincronizar al iniciar sesión
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ preferredLanguage: "es" });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { preferredLanguage: true },
  });

  return NextResponse.json({ preferredLanguage: user?.preferredLanguage ?? "es" });
}
