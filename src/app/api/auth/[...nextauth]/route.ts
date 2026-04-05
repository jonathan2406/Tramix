import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Not using PrismaAdapter for standard NextAuth because we have a custom user schema 
  // and we want session JWT handling without creating accounts automatically if we want custom flows.
  // Actually, we can use standard custom logic in callbacks to fulfill HU-02 "Match de cuenta"
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales incompletas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || (!user.password && credentials.password)) {
          throw new Error("Usuario no encontrado o debe usar Google Login");
        }

        // We check the password 
        const isValid = await bcrypt.compare(credentials.password, user.password as string);
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        // HU-02: Match de cuenta o registro si es primera vez
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          // HU-02: Register via Google initially
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Usuario Google",
              googleId: account.providerAccountId,
              // password is null
            }
          });
        } else if (!existingUser.googleId) {
          // HU-02: Match de cuenta - Asocia ID del proveedor externo a la cuenta local
          await prisma.user.update({
            where: { email: user.email },
            data: { googleId: account.providerAccountId }
          });
        }
        return true;
      }
      return true; // para credenciales que ya pasaron por `authorize`
    },
    async jwt({ token, user, trigger, session }) {
      // Add db user id to token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
