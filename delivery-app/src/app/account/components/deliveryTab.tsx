"use client";

import { StatusDelivery } from "@prisma/client";
import { Calendar, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            onClick={() => toggleExpand(del.id)}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-orange-300 transition-all duration-200"
          >
            {/* Encabezado del Delivery */}
            <div className="flex items-start gap-4">
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
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Fecha:{" "}
                    {new Date(del.createdAt).toLocaleDateString("es-AR", {
                      timeZone: "UTC",
                    })}
                  </p>
                  {expandedId === del.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Detalle Expandible */}
            {expandedId === del.id && (
              <div className="pt-4 mt-3 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">
                      Items
                    </p>
                    <p className="font-bold text-gray-900">
                      {del.totalItems || "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">
                      Peso
                    </p>
                    <p className="font-bold text-gray-900">
                      {del.totalWeight ? `${del.totalWeight}kg` : "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">
                      Monto
                    </p>
                    <p className="font-bold text-green-600">
                      ${del.amount || "-"}
                    </p>
                  </div>
                </div>

                {/* Historial de Estados (Si existe) */}
                {del.stateHistories && del.stateHistories.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                      Historial de Estados
                    </p>
                    <div className="space-y-2 border-l-2 border-gray-200 ml-2 pl-3">
                      {/*eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {del.stateHistories.map((hist: any, index: number) => (
                        <div key={index} className="relative text-xs">
                          <div className="absolute -left-4.25 top-1.5 w-2 h-2 rounded-full bg-orange-400"></div>
                          <p className="font-semibold text-gray-700">
                            {hist.status}
                          </p>
                          <p className="text-gray-400">
                            {hist.timestamp
                              ? new Date(hist.timestamp).toLocaleString(
                                  "es-AR",
                                  {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "Fecha no registrada"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
