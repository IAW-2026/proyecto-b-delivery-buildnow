"use client";

import { useEffect, useState } from "react";
import { StatusDelivery, VehicleType } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Repartidor } from "../../../types/index";
import MetricasTab from "./components/metricasTab";
import RepartidoresTab from "./components/repartidoresTab";
import EditarTab from "./components/editarTab";

export default function AdminDashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [drivers, setDrivers] = useState<Repartidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Repartidor | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, StatusDelivery>>({
    ASSIGNED: "ASSIGNED",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    vehicleType: "MOTORBIKE" as VehicleType,
  });

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/repartidores");
      const data = await res.json();
      setDrivers(data);
      const initialStatus: Record<string, StatusDelivery> = {};
      data.forEach((driver: Repartidor) => {
        driver.deliveries.forEach((delivery) => {
          initialStatus[delivery.id] = delivery.status;
        });
      });
      setStatusMap(initialStatus);
    } catch (error) {
      console.error("Error cargando repartidores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDriver = (driver: Repartidor) => {
    setSelectedDriver(driver);
    setForm({
      name: driver.name,
      email: driver.email,
      vehicleType: driver.vehicleType,
    });
  };

  const handleUpdateDriver = async () => {
    if (!selectedDriver) return;

    const res = await fetch("/api/admin/repartidores", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedDriver.id,
        ...form,
      }),
    });

    if (!res.ok) {
      console.error("Error actualizando repartidor");
      return;
    }

    await loadDrivers();
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || user?.publicMetadata?.role !== "admin") {
      router.replace("/dashboard");
    }

    const inicializadorCarga = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await loadDrivers();
    };
    inicializadorCarga();
  }, [isLoaded, isSignedIn, user, router]);

  const handleStatusChange = (deliveryId: string, status: StatusDelivery) => {
    setStatusMap((prev) => ({ ...prev, [deliveryId]: status }));
  };

  const handleUpdateDeliveryStatus = async (deliveryId: string) => {
    const status = statusMap[deliveryId];
    const res = await fetch(`/api/delivery/${deliveryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      console.error("Error actualizando estado de delivery");
      return;
    }
    await loadDrivers();
  };

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter((driver) =>
    driver.deliveries.some(
      (del) => del.status === "ASSIGNED" || del.status === "ON_THE_WAY",
    ),
  ).length;
  const totalDeliveries = drivers
    .flatMap((d) => d.deliveries)
    .filter((del) => del.status === "DELIVERED").length;

  const completedDeliveries = drivers
    .flatMap((d) => d.deliveries)
    .filter((del) => del.status === "DELIVERED");
  const totalRevenue = completedDeliveries.reduce(
    (sum, del) => sum + Number(del.amount || 0),
    0,
  );

  if (!isLoaded || (loading && drivers.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Cargando panel de administración...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 pb-24">
          <h1 className="text-3xl font-bold text-slate-900">Panel Admin</h1>

          {loading ? (
            <div className="mt-10 text-center text-slate-500">
              Cargando repartidores...
            </div>
          ) : (
            <>
              {/* Métricas Generales */}
              <MetricasTab
                totalDrivers={totalDrivers}
                activeDrivers={activeDrivers}
                completedDeliveries={totalDeliveries}
                totalRevenue={totalRevenue}
              />

              <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
                {/* Info repartidores */}
                <RepartidoresTab
                  drivers={drivers}
                  selectedDriver={selectedDriver}
                  handleSelectDriver={handleSelectDriver}
                  statusMap={statusMap}
                  handleStatusChange={handleStatusChange}
                  handleUpdateDeliveryStatus={handleUpdateDeliveryStatus}
                />
                {/* Editar información personal repartidor */}
                <EditarTab
                  selectedDriver={selectedDriver}
                  form={form}
                  setForm={setForm}
                  handleUpdateDriver={handleUpdateDriver}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
