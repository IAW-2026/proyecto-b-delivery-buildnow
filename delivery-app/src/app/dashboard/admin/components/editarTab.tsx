"Use client";

import { Repartidor, VEHICLE_OPTIONS } from "../../../../types/index";
import { VehicleType } from "@prisma/client";

interface Props {
  selectedDriver: Repartidor | null;
  form: {
    name: string;
    email: string;
    vehicleType: VehicleType;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      vehicleType: VehicleType;
    }>
  >;
  handleUpdateDriver: () => Promise<void>;
}

export default function EditarTab({
  selectedDriver,
  form,
  setForm,
  handleUpdateDriver,
}: Props) {
  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Editar repartidor
        </h2>

        {selectedDriver ? (
          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleUpdateDriver();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nombre
              </label>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Vehículo
              </label>
              <select
                value={form.vehicleType}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    vehicleType: event.target.value as VehicleType,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm cursor-pointer"
              >
                {VEHICLE_OPTIONS.map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 cursor-pointer"
            >
              Guardar datos del repartidor
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Selecciona un repartidor para editar su información.
          </p>
        )}
      </div>
    </aside>
  );
}
