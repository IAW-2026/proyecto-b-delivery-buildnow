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
    createdAt: new Date().toISOString()
  },
  {
    id: "order_10124",
    storeName: "Ferretería Central S.A.",
    storeAddress: "Sarmiento 120, Bahía Blanca, Buenos Aires, Argentina",
    deliveryAddress: "O'Higgins 340, Bahía Blanca, Buenos Aires, Argentina",
    totalWeight: 2.0,
    totalItems: 4,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString() // Hace 15 minutos
  },
  {
    id: "order_10125",
    storeName: "Bahía Construcciones",
    storeAddress: "Alsina 250, Bahía Blanca, Buenos Aires, Argentina",
    deliveryAddress: "Zapiola 800, Bahía Blanca, Buenos Aires, Argentina",
    totalWeight: 0.8,
    totalItems: 1,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString() // Hace 5 minutos
  }
];

// =====================================================================
// MOCKS DE PAYMENTS APP (Pagos / Payouts)
// =====================================================================
export const generateMockPayoutCreated = () => ({
  id: `payout_${Math.random().toString(36).substring(2, 9)}`,
  status: "PENDING",
  createdAt: new Date().toISOString()
});

export const generateMockPayoutHistory = (recipientId: string, recipientType: string) => ([
  {
    id: `payout_${Math.random().toString(36).substring(2, 9)}`,
    orderId: "order_10123",
    recipientId: recipientId,
    recipientType: recipientType,
    amount: 50.0,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 86400000).toISOString() // Simula fecha de ayer
  }
]);