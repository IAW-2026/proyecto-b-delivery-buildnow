"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-gray-100">
            <span className="text-xl">🚚</span>
          </div>

          <div>
            <p className="text-xl font-bold text-gray-900">buildNOW</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <p className="font-semibold">
              Hola {user?.firstName ?? "Repartidor"}
            </p>

            <p className="text-xs text-gray-500">Rol: DELIVERY</p>
          </div>

          <SignOutButton>Salir</SignOutButton>
        </div>
      </div>
    </header>
  );
}
