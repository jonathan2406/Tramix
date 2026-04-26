import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function requireDeveloper() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });
  return user?.role === "developer" ? user : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dev = await requireDeveloper();
  if (!dev) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { role } = body;

  if (!role) {
    return NextResponse.json({ error: "Falta el rol" }, { status: 400 });
  }

  // Prevención de auto-bloqueo
  if (dev.id === id) {
    return NextResponse.json({ error: "Por seguridad, no puedes eliminar tu propio rol administrativo" }, { status: 403 });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return NextResponse.json({ id: updatedUser.id, role: updatedUser.role });
}
