import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, termsAccepted } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json({ message: 'Debes aceptar los términos y condiciones' }, { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email }
    });

    if (exist) {
      return NextResponse.json({ message: 'El correo ya está registrado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: "Activo",
        termsAcceptedAt: new Date(), // HU-03 Audit Timestamp
        termsVersion: "v1.0", // HU-03 Audit Version
      }
    });

    return NextResponse.json({ message: 'Registro exitoso' }, { status: 201 });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
