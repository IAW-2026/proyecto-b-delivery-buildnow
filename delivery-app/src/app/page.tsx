import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex items-center justify-center p-4 text-slate-900">
      <div className="w-full max-w-md flex flex-col items-center relative">
        <div className="absolute bottom-full mb-4 w-20 h-20">
          <Image
            src="/buildnow-logo-sin-fondo.png"
            alt="Logo de BuildNow"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-orange-900 sm:text-4xl">
            Delivery BuildNow
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Plataforma para repartidores. Regístrate como repartidor o inicia
            sesión para comenzar a recibir pedidos.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 shadow-sm shadow-orange-500/20"
            >
              Registrarme
            </Link>
            <Link
              href="/login"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Iniciar sesión
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            ¿Entraste por error?{" "}
            <Link
              href={process.env.NEXT_PUBLIC_BUYER_API_URL || "/"}
              className="text-orange-500 hover:underline font-medium"
            >
              Volver a la página principal
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
