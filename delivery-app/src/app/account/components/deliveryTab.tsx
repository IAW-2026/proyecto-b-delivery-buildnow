"Use client";

import { StatusDelivery } from "@prisma/client";
import { Calendar, Package } from "lucide-react";

type Delivery = {
  id: string;
  storeName: string;
  status: StatusDelivery;
  createdAt: string;
};

interface Props {
  deliveries: Delivery[];
}

export default function DeliveryTab({ deliveries }: Props) {
  return (
    <div className="space-y-3">
      {deliveries.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No tienes envíos completados.
        </p>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deliveries.map((del: any) => (
          <div
            key={del.id}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex shrink-0 items-center justify-center mt-1">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900 text-lg leading-none">
                  {del.storeName}
                </p>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {del.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                ID del pedido: {del.id}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Fecha:{" "}
                {new Date(del.createdAt).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
