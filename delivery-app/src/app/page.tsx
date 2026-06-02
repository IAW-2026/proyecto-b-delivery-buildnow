import Link from "next/link";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Delivery BuildNow
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Plataforma para repartidores. Regístrate como repartidor o inicia
          sesión para comenzar a recibir pedidos.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Registrarme
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
