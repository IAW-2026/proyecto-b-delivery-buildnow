import type { ReactNode } from "react";
import { requireDeliveryUser } from "../../lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Administración",
  description:
    "Bienvenido al panel de administración. Aquí puedes gestionar los pedidos, asignar entregas a los repartidores y supervisar el estado de las entregas en tiempo real.",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDeliveryUser();
  return <>{children}</>;
}
