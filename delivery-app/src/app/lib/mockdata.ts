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
    createdAt: new Date().toISOString(),
  },
  {
    id: "order_10124",
    storeName: "Ferretería Central S.A.",
    storeAddress: "Sarmiento 120, Bahía Blanca, Buenos Aires, Argentina",
    deliveryAddress: "O'Higgins 340, Bahía Blanca, Buenos Aires, Argentina",
    totalWeight: 2.0,
    totalItems: 4,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // Hace 15 minutos
  },
  {
    id: "order_10125",
    storeName: "Bahía Construcciones",
    storeAddress: "Alsina 250, Bahía Blanca, Buenos Aires, Argentina",
    deliveryAddress: "Zapiola 800, Bahía Blanca, Buenos Aires, Argentina",
    totalWeight: 0.8,
    totalItems: 1,
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
    .reduce((sum, payout) => sum + payout.amount, 0);

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
    const amount = 1500 + (delivery.totalWeight || 0) * 100;

    return {
      id: `payout_${delivery.id}`,
      orderId: delivery.orderId,
      recipientId: recipientId,
      recipientType: recipientType,
      amount: amount,
      // Si el envío está completado, asumimos que el pago también
      status: delivery.status === "DELIVERED" ? "COMPLETED" : "PENDING",
      // Usamos una fecha relacionada al delivery para darle realismo
      createdAt: delivery.createdAt || new Date().toISOString(),
    };
  });
};

// Agregamos un payout adicional simulado para mostrar cómo se vería un pago reciente pendiente
export const pendingPayout = (recipientId: string, recipientType: string) => {
  return {
    id: "payout_10125",
    orderId: "order_10125",
    recipientId: recipientId,
    recipientType: recipientType,
    amount: 1800,
    status: "PENDING",
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // Hace 10 minutos
  };
};
