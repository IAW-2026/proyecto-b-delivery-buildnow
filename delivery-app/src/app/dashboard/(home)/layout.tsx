import type { PropsWithChildren } from "react";
import { requireDeliveryUser } from "../../lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página principal de repartidor",
  description:
    "Bienvenido a tu panel de repartidor. Aquí podes ver los pedidos disponibles para entregar y gestionar tus entregas actuales.",
};

export default async function HomeLayout({ children }: PropsWithChildren) {
  await requireDeliveryUser();
  return <>{children}</>;
}
