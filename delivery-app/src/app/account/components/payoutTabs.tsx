"Use client";
import { Calendar, CheckCircle } from "lucide-react";

type Payout = { id: string; status: string; amount: number; createdAt: string };
type Earning = {
  id: string;
  amount: number;
  description: string;
};

interface Props {
  payouts: Payout[];
  earnings: Earning[];
}

export default function PayoutTabs({ payouts, earnings }: Props) {
  if (payouts.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        No hay payouts registrados.
      </p>
    );
  }

  if (earnings.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        No hay ganancias registradas.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {earnings.map((earning) => (
        <div
          key={earning.id}
          className="bg-orange-50 p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-orange-600  font-semibold">
              {earning.description}
            </p>
            <p className="text-xs text-orange-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />{" "}
              {new Date().toLocaleDateString("es-ES")} a las{" "}
              {new Date().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <p className="text-lg font-bold text-orange-600">
            +${earning.amount}
          </p>
        </div>
      ))}
      {payouts.map((p) => (
        <div
          key={p.id}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
        >
          {p.status === "COMPLETED" && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Transferencia enviada
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />{" "}
                  {new Date(p.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          )}

          {p.status === "PENDING" && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Transferencia pendiente
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />{" "}
                  {new Date(p.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          )}

          <p className="text-lg font-bold text-gray-900">${p.amount}</p>
        </div>
      ))}
    </div>
  );
}
