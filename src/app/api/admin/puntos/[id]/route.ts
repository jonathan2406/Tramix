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

// HU-14: Actualizar estado de un punto de atención
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dev = await requireDeveloper();
  if (!dev) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  const punto = await prisma.puntoAtencion.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(punto);
}

// HU-14: Eliminar un punto de atención
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dev = await requireDeveloper();
  if (!dev) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  await prisma.puntoAtencion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
