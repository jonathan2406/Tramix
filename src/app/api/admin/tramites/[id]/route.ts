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
    select: { role: true },
  });
  return user?.role === "developer" ? user : null;
}

// HU-13: Actualizar campos de un trámite (y despublicar)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dev = await requireDeveloper();
  if (!dev) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { title, description, estimatedTime, estimatedCost, type, published } = body;

  const tramite = await prisma.tramite.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(estimatedTime !== undefined && { estimatedTime }),
      ...(estimatedCost !== undefined && { estimatedCost }),
      ...(type !== undefined && { type }),
      ...(published !== undefined && { published }),
    },
  });

  return NextResponse.json(tramite);
}
