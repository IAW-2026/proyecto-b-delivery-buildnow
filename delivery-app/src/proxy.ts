import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definimos qué rutas de nuestra aplicación serán públicas
const isPublicRoute = createRouteMatcher([
  "/", // La landing page principal
  "/login(.*)", // Todas las sub-rutas de login
  "/register(.*)", // Todas las sub-rutas de registro
  "/api/auth/register", // Endpoint para crear el usuario en la BD local
  "/api/geocode(.*)", // Endpoint de geocodificación (si quieres que sea público)
  "/api/geocode", // Por seguridad, aseguramos que la ruta base exacta sea pública
  "/api/distance/(.*)", // Endpoint de cálculo de distancia (si quieres que sea público)
  "/account/security(.*)",
  "/api/delivery/quote(.*)", // Endpoint de cotización de delivery
  "/api/orders/(.*)/tracking", // Endpoint para el tracking de órdenes con ID dinámico
]);

// Generamos el middleware de Clerk y lo guardamos en una constante
const clerk = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const { userId, sessionClaims } = await auth();
  const url = request.nextUrl.clone();

  if (userId && url.pathname === "/") {
    const role = sessionClaims?.metadata?.role;

    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function middleware(request: any, event: any) {
  return clerk(request, event);
}

export const config = {
  matcher: [
    // Ignorar archivos estáticos e internos de Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    // Ejecutar el middleware siempre en las rutas de la API
    "/(api|trpc)(.*)",
  ],
};
