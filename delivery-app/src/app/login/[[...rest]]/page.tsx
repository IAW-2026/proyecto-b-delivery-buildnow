'use client'

import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-600">Usa tus credenciales para ingresar a tu panel de repartidor.</p>
        <div className="mt-8">
          <SignIn path="/login" routing="path" signUpUrl="/register" />
        </div>
      </div>
    </div>
  )
}
