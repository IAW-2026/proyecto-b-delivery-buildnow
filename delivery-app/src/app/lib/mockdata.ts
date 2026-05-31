import { Role } from "@prisma/client";

// =====================================================================
// MOCKS DE SELLER APP (Pedidos)
// =====================================================================
export const mockAvailableOrders = [
  {
    id: "order_10122",
    storeName: "Corralón Don Bosco",
    storeAddress: "Av. Alem 1253, Bahía Blanca, Buenos Aires, Argentina",
    deliveryAddress: "San Martín 450, Bahía Blanca, Buenos Aires, Argentina",
    totalWeight: 1.5,
    totalItems: 3,
    status: "READY", // Agregado para poder actualizar el estado de la orden
    createdAt: new Date().toISOString(),
  },
  {
    id: "order_10120",
    storeName: "Ferretería Central S.A.",
    storeAddress: "Sarmiento 120, Bahía Blanca, Buenos Aires, Argentina",
    deliveryAddress: "O'Higgins 340, Bahía Blanca, Buenos Aires, Argentina",
    totalWeight: 2.0,
    totalItems: 4,
    status: "READY", // Agregado para poder actualizar el estado de la orden
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // Hace 15 minutos
  },
  {
    id: "order_10125",
    storeName: "Bahía Construcciones",
    storeAddress: "Alsina 250, Bahía Blanca, Buenos Aires, Argentina",
    deliveryAddress: "Zapiola 800, Bahía Blanca, Buenos Aires, Argentina",
    totalWeight: 0.8,
    totalItems: 1,
    status: "READY", // Agregado para poder actualizar el estado de la orden
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // Hace 5 minutos
  },
];

export const payoutCreated = [];

// =====================================================================
// MOCKS DE PAYMENTS APP (Pagos / Payouts)
// =====================================================================
/* POST /api/payments/payouts  Request: { "orderId": "string", "recipientId": "string", "recipientType": "SELLER | DELIVERY", "amount": 100.50 } Response(201 CREATED): { "id": "string", "status": "PENDING", "createdAt": "2026-05-04T12:12:09Z" } */
export const generateMockPayoutCreated = (
  orderId: string,
  recipientId: string,
  recipientType: Role,
  amount: number,
) => {
  return {
    id: "string",
    status: "PENDING",
    createdAt: "2026-05-04T12:12:09Z",
  };
};

/**
 * GET /api/payments/earnings?recipientId={id}&recipientType={type}
Quién llama: Seller / Delivery Response (200 OK): { "recipientId": "string", "recipientType": "SELLER | DELIVERY", "totalEarnings": 1000.0, "currency": "ARS" } **/
export const calculateTotalEarningsFromPayouts = (
  payouts: { status: string; amount: number }[],
) => {
  const total = payouts
    .filter((payout) => payout.status === "COMPLETED")
    .reduce((sum, payout) => sum + Number(payout.amount), 0);

  return parseFloat(total.toFixed(2));
};

export const generateMockEarnings = (
  recipientId: string,
  recipientType: string,
  payouts?: { status: string; amount: number }[],
) => ({
  recipientId: recipientId,
  recipientType: recipientType,
  totalEarnings: payouts
    ? calculateTotalEarningsFromPayouts(payouts)
    : parseFloat((Math.random() * 1000).toFixed(2)),
  currency: "ARS",
});

// =====================================================================
// MOCKS INTERACTIVOS BASADOS EN LA BASE DE DATOS (DELIVERIES REALES)
// =====================================================================

/**
 * Genera un historial de Payouts basado en los envíos reales del repartidor.
 */
export const generateInteractivePayoutHistory = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deliveries: any[],
  recipientId: string,
  recipientType: string,
) => {
  return deliveries.map((delivery) => {
    // Simulamos un cálculo de pago: $1500 base + $100 por peso (si aplica)
    // Si es uno de los deliveries de la seed o ya está entregado, el payout será COMPLETED
    const isCompleted = delivery.id === "dlv_001" || delivery.id === "dlv_002";

    return {
      id: `payout_${delivery.id}`,
      orderId: delivery.orderId,
      recipientId: recipientId,
      recipientType: recipientType,
      amount: delivery.amount || 1500 + delivery.totalWeight * 100, // Monto basado en el delivery real
      // Asignamos el estado dependiendo de si ya fue completado o no
      status: isCompleted ? "COMPLETED" : "PENDING",
      // Usamos una fecha relacionada al delivery para darle realismo
      createdAt: delivery.createdAt || new Date().toISOString(),
    };
  });
};
