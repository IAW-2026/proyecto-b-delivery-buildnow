"use client";

import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-2 py-6 sm:px-4 sm:py-10">
      {/* Ajustamos el contenedor principal para que sea relativo */}
      <div className="relative flex flex-col md:flex-row justify-center items-center md:items-start gap-4 w-full max-w-fit">
        {/* Este botón ahora se posiciona en el centro superior en móviles y vuelve a su lugar en escritorio */}
        <Button
          onClick={() => router.push("/account")}
          className="absolute top-0 left-1/2 -translate-x-1/2 md:relative md:top-auto md:left-auto md:translate-x-0 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer md:mt-4 z-10"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>

        {/* El contenedor del perfil simplemente sube ligeramente para compensar */}
        <div className="pt-14 md:pt-0 w-full flex justify-center">
          <UserProfile />
        </div>
      </div>
    </main>
  );
}
