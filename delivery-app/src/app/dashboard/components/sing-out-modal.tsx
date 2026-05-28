import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/dialog";

import * as React from "react";
import { SignOutButton } from "@clerk/nextjs";

export function SignOutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer transition-colors hover:text-orange-700">
          Salir
        </button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>¿Cerrar sesión?</DialogTitle>

          <DialogDescription>
            Vas a salir de tu cuenta actual.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose>
            <button className="rounded-lg border px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
              Cancelar
            </button>
          </DialogClose>

          <SignOutButton>
            <button className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 cursor-pointer">
              Salir
            </button>
          </SignOutButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
