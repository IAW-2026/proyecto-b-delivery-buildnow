"Use client";

import { Users, Activity, DollarSign, PackageCheck } from "lucide-react";

interface Props {
  totalDrivers: number;
  activeDrivers: number;
  completedDeliveries: number;
  totalRevenue: number;
}

export default function MetricasTab({
  totalDrivers,
  activeDrivers,
  completedDeliveries,
  totalRevenue,
}: Props) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Repartidores</p>
          <p className="text-2xl font-bold text-slate-900">{totalDrivers}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Activos Ahora</p>
          <p className="text-2xl font-bold text-slate-900">{activeDrivers}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <PackageCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Entregas</p>
          <p className="text-2xl font-bold text-slate-900">
            {completedDeliveries}
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <DollarSign className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Ingresos (Aprox)</p>
          <p className="text-2xl font-bold text-slate-900">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
