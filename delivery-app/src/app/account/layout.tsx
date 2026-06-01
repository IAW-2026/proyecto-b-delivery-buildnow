import type { PropsWithChildren } from "react";
import { requireDeliveryUser } from "../lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Cuenta - Delivery App",
  description: "Gestiona tu cuenta de delivery, revisa tus envíos y ganancias.",
};

export default async function ProfileLayout({ children }: PropsWithChildren) {
  await requireDeliveryUser();
  return <>{children}</>;
}
