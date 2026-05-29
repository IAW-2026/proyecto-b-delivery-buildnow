"Use client";

import { Repartidor, STATUS_OPTIONS } from "../../../../types/index";

interface Props {
  drivers: Repartidor[];
  selectedDriver: Repartidor | null;
  handleSelectDriver: (driver: Repartidor) => void;
  statusMap: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleStatusChange: (id: string, status: any) => void; // Ajusta 'any' por tu tipo StatusDelivery si es necesario
  handleUpdateDeliveryStatus: (id: string) => void;
}

export default function RepartidoresTab({
  drivers,
  selectedDriver,
  handleSelectDriver,
  statusMap,
  handleStatusChange,
  handleUpdateDeliveryStatus,
}: Props) {
  return (
    <section className="space-y-4">
      {/* --- SECCIÓN DE REPARTIDORES --- */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Repartidores</h2>
        <div className="mt-4 space-y-4">
          {drivers.map((driver) => {
            const driverCompleted = driver.deliveries.filter(
              (d) => d.status === "DELIVERED",
            ).length;
            const driverRevenue = driverCompleted * 2500;
            const isDriverActive = driver.deliveries.some(
              (d) => d.status === "ASSIGNED" || d.status === "ON_THE_WAY",
            );

            return (
              <button
                key={driver.id}
                type="button"
                onClick={() => handleSelectDriver(driver)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition cursor-pointer ${
                  selectedDriver?.id === driver.id
                    ? "border-orange-400 bg-orange-50"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {driver.name}
                    </p>
                    <p className="text-sm text-slate-600">{driver.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDriverActive && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700 uppercase tracking-wide">
                        Activo
                      </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {driver.deliveries.length} envíos
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center text-sm text-slate-500">
                  <span>
                    Vehículo:{" "}
                    <span className="font-medium text-slate-700">
                      {driver.vehicleType}
                    </span>
                  </span>
                  <span>
                    Generado:{" "}
                    <span className="font-medium text-slate-700">
                      ${driverRevenue.toLocaleString()}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SECCIÓN DE ENTREGAS POR REPARTIDOR --- */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Entrega por repartidor
        </h2>
        {selectedDriver ? (
          <div className="mt-4 space-y-4">
            {selectedDriver.deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {delivery.storeName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {delivery.pickupLocation}
                    </p>
                    <p className="text-sm text-slate-600">
                      {delivery.deliveryAddress}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm cursor-pointer"
                      value={statusMap[delivery.id]}
                      onChange={(event) =>
                        handleStatusChange(delivery.id, event.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 cursor-pointer"
                      onClick={() => handleUpdateDeliveryStatus(delivery.id)}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {selectedDriver.deliveries.length === 0 && (
              <p className="text-sm text-slate-500">
                Este repartidor no tiene envíos asignados aún.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Selecciona un repartidor para ver sus envíos.
          </p>
        )}
      </div>
    </section>
  );
}
