# DEPLOYMENT GUIDE (TRAMIX MVP)

## Requisitos Previos (Variables de Entorno)
Antes de desplegar, debes generar las credenciales de NextAuth y Google OAuth, y configurar tu base de datos de producción (por ejemplo Vercel Postgres, Supabase, etc).

En tu proveedor (Vercel o Render), debes agregar las siguientes variables de entorno:

```env
DATABASE_URL="postgresql://usuario:password@host:port/dbname" # O reemplázalo si sigues usando sqlite en prod (no recomendado por persistencia)
# Genera un secreto random usando `openssl rand -base64 32` en tu terminal
NEXTAUTH_SECRET="tu_secreto_generado"
NEXTAUTH_URL="https://tramix-mvp.vercel.app" # La URL real a la que esté apuntando
GOOGLE_CLIENT_ID="tu_google_client_id"
GOOGLE_CLIENT_SECRET="tu_google_client_secret"
```

## Opción 1: Despliegue Rápido en Vercel (Recomendado)

1. Sube tu código a GitHub.
2. Ingresa a [Vercel](https://vercel.com/) y haz clic en "Add New..." -> "Project".
3. Conecta el repositorio de GitHub donde subiste **TRAMIX**.
4. Vercel detectará automáticamente que es un proyecto **Next.js**.
5. Ve a **Environment Variables** en Vercel y pega las variables de tu archivo `.env`.
6. (Opcional) En Build Command, Vercel usa `pnpm run build` por defecto. Al compilar Next.js, ejecutaremos `prisma generate` automáticamente porque `package.json` lo incluye.
    * _Nota: El script de `build` ahora incluye `prisma generate && next build` para asegurar que el cliente de Prisma esté siempre actualizado._
7. Haz clic en **Deploy**. ¡Listo hoy mismo!

## Opción 2: Despliegue en Render (Web Service + PostgreSQL)

1. En Render.com, crea una **PostgreSQL Database** para obtener tu `DATABASE_URL`.
2. Sube tu proyecto a GitHub.
3. En Render, crea un nuevo **Web Service** y enlaza tu repositorio.
4. Elije el entorno de Node.js.
5. Usa los siguientes comandos en Render:
   * **Build Command:** `pnpm install && pnpm build` (El build ya incluye `prisma generate`).
   * **Start Command:** `pnpm start`.
6. En variables de entorno, añade todas las credenciales incluyendo la base de datos de Render.
7. Haz clic en **Create Web Service**.
