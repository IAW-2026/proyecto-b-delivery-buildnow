"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import { SignOutDialog } from "./sing-out-modal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import Image from "next/image";

export function DashboardHeader() {
  const { user } = useUser();
  const router = useRouter();
  const [isSignOutOpen, setIsSignOutOpen] = React.useState(false);
  const [selectValue, setSelectValue] = React.useState("");

  const handleAccountClick = () => {
    router.push(`/account`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-12 w-12 sm:h-15 sm:w-15 overflow-hidden rounded-md bg-gray-50">
            <Image
              src="/buildnow-logo.png"
              alt="Logo de buildNOW"
              fill
              sizes="180px"
              priority
              className="object-contain"
            />
          </div>
          <p className="text-lg sm:text-xl font-bold text-orange-900">
            buildNOW
          </p>
        </div>

        {/* CONTENEDOR DE BOTONES */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <button
              onClick={handleAccountClick}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 cursor-pointer flex items-center gap-2 transform transition duration-200 hover:bg-gray-100 focus:outline-none"
            >
              <div className="text-left">
                <p className="font-semibold">
                  Hola {user?.firstName ?? "Delivery"}
                </p>
                <p className="text-xs text-gray-500">Ver cuenta</p>
              </div>
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
            </button>
            <SignOutDialog />
          </div>

          <div className="block sm:hidden">
            <Select
              value={selectValue}
              onValueChange={(value) => {
                if (value === "cuenta") handleAccountClick();
                if (value === "salir") setIsSignOutOpen(true);

                setSelectValue("");
              }}
            >
              <SelectTrigger className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 cursor-pointer">
                <span className="font-semibold pr-1">
                  Hola {user?.firstName ?? "Delivery"}
                </span>
              </SelectTrigger>

              <SelectContent
                position="popper"
                align="end"
                className="bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <SelectItem
                  value="cuenta"
                  className="focus:bg-orange-50 focus:text-orange-900 cursor-pointer"
                >
                  Mi Cuenta (Ver perfil)
                </SelectItem>
                <SelectItem
                  value="salir"
                  className="focus:bg-red-50 focus:text-red-600 text-red-600 font-medium cursor-pointer"
                >
                  Cerrar Sesión
                </SelectItem>
              </SelectContent>
            </Select>

            <SignOutDialog
              isOpen={isSignOutOpen}
              setIsOpen={setIsSignOutOpen}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
