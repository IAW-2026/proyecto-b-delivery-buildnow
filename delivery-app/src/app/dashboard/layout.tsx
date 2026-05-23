import type { ReactNode } from "react";
import { DashboardHeader } from "./components/dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <DashboardHeader />

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
