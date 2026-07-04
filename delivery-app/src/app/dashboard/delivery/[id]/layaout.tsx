import type { PropsWithChildren } from "react";
import { requireDeliveryUser } from "../../../lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle del Envío",
  description:
    "Visualiza los detalles completos de un envío específico, incluyendo la ruta en el mapa, información del pedido y opciones para gestionar la entrega.",
};

export default async function DeliveryLayout({ children }: PropsWithChildren) {
  await requireDeliveryUser();
  return <>{children}</>;
}
