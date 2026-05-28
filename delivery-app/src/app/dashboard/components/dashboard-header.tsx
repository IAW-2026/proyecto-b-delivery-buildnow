"use client";

import { useUser } from "@clerk/nextjs";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import { SignOutDialog } from "./sing-out-modal";

export function DashboardHeader() {
  const { user } = useUser();
  const router = useRouter();

  const handleAccountClick = () => {
    router.push(`/account`);
  };

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
          <button
            onClick={handleAccountClick}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 cursor-pointer flex items-center gap-2 transform transition duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <div className="flex-1 text-left">
              <p className="font-semibold">
                Hola {user?.firstName ?? "Repartidor"}
              </p>
              {/* Agregar botón para ver cuenta */}
              <p className="text-xs text-gray-500">Ver cuenta</p>
            </div>
            <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500 items-center" />
          </button>

          <SignOutDialog />
        </div>
      </div>
    </header>
  );
}
