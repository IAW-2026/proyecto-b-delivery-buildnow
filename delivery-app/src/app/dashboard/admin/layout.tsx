import type { ReactNode } from "react";
import { requireDeliveryUser } from "../../lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDeliveryUser();
  return <>{children}</>;
}
