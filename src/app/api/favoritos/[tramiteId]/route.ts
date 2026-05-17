import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// HU-29: Eliminar trámite de favoritos
export async function DELETE(_req: Request, { params }: { params: Promise<{ tramiteId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { tramiteId } = await params;

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });

  await prisma.favorito.deleteMany({ where: { userId: user.id, tramiteId } });

  return NextResponse.json({ message: "Trámite eliminado de favoritos." });
}
