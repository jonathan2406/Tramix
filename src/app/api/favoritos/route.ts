import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// HU-29: Listar favoritos del usuario autenticado
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });

  const favoritos = await prisma.favorito.findMany({
    where: { userId: user.id },
    include: {
      tramite: {
        select: { id: true, title: true, description: true, code: true, isOnline: true, categoria: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favoritos);
}

// HU-29: Agregar trámite a favoritos (evita duplicados)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { tramiteId } = await request.json();
  if (!tramiteId) return NextResponse.json({ message: "tramiteId requerido" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });

  try {
    await prisma.favorito.create({ data: { userId: user.id, tramiteId } });
    return NextResponse.json({ message: "Trámite guardado en favoritos." }, { status: 201 });
  } catch (e: any) {
    // P2002 = unique constraint violation → ya existe
    if (e?.code === "P2002") {
      return NextResponse.json({ message: "Este trámite ya está en tus favoritos." }, { status: 409 });
    }
    return NextResponse.json({ message: "Error al guardar favorito." }, { status: 500 });
  }
}
