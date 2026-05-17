import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Definimos qué rutas de nuestra aplicación serán públicas
const isPublicRoute = createRouteMatcher([
  '/',                  // La landing page principal
  '/login(.*)',         // Todas las sub-rutas de login
  '/register(.*)',      // Todas las sub-rutas de registro
  '/api/auth/register'  // Tu endpoint para crear el usuario en la BD local
])

// Generamos el middleware de Clerk y lo guardamos en una constante
const clerk = clerkMiddleware(async (auth, request) => {
  // Si la ruta NO es pública, obligamos al usuario a estar autenticado
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

// Exportamos una función llamada 'middleware' explícitamente para que Next.js no dé error
export default function middleware(request: any, event: any) {
  return clerk(request, event)
}

export const config = {
  matcher: [
    // Ignorar archivos estáticos e internos de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Ejecutar el middleware siempre en las rutas de la API
    '/(api|trpc)(.*)',
  ],
}
