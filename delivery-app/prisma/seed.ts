import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // NOTA: Se quitaron los deleteMany para no borrar a los usuarios reales
  // sincronizados con Clerk. En lugar de eso, usamos operaciones seguras
  // o asumimos que el entorno está limpio si usamos 'prisma migrate reset'.

  // Repartidores de prueba
  const rep1 = await prisma.repartidor.upsert({
    where: { email: "delivery_1@gmail.com" },
    update: {
      clerkUserId: "user_3EPaQy8573olgQt01UdOCS17s83", // Forzar actualizacion ID de Clerk
    },
    create: {
      clerkUserId: "user_3EPaQy8573olgQt01UdOCS17s83",
      name: "Delivery Prueba1",
      email: "delivery_1@gmail.com",
      phone: "+14155552671",
      vehicleType: "MOTORBIKE",
      role: "DELIVERY",
    },
  });

  const rep2 = await prisma.repartidor.upsert({
    where: { email: "laura.alvarez@delivery.com" },
    update: {},
    create: {
      clerkUserId: "user_clerk_rep2",
      name: "Laura Álvarez",
      email: "laura.alvarez@delivery.com",
      phone: "+19183038953",
      vehicleType: "BICYCLE",
      role: "DELIVERY",
    },
  });

  // Envíos (Deliveries) de prueba
  const dlv1 = await prisma.delivery.upsert({
    where: { orderId: "order_10123" },
    update: {
      delivyUserId: rep1.id, // Forzar asignación al repartidor rep1
    },
    create: {
      id: "dlv_001",
      orderId: "order_10123",
      delivyUserId: rep1.id,
      status: "DELIVERED",
      storeName: "Corralón BuildNOW",
      pickupLocation: "Av. Alem 1253, Bahía Blanca",
      deliveryAddress: "San Martín 450, Bahía Blanca",
      totalItems: 5,
      totalWeight: 12.5,
      stateHistories: {
        create: [
          { status: "ASSIGNED", timestamp: new Date(Date.now() - 60 * 60000) },
          {
            status: "ON_THE_WAY",
            timestamp: new Date(Date.now() - 30 * 60000),
          },
          { status: "DELIVERED", timestamp: new Date() },
        ],
      },
    },
  });

  const dlv2 = await prisma.delivery.upsert({
    where: { orderId: "order_10124" },
    update: {
      delivyUserId: rep1.id, // Forzar asignación al repartidor rep1
    },
    create: {
      id: "dlv_002",
      orderId: "order_10124",
      delivyUserId: rep1.id,
      status: "DELIVERED",
      storeName: "Ferretería Central S.A.",
      pickupLocation: "Sarmiento 120, Bahía Blanca",
      deliveryAddress: "O'Higgins 340, Bahía Blanca, Buenos Aires, Argentina",
      totalItems: 4,
      totalWeight: 2.0,
      stateHistories: {
        create: [
          { status: "ASSIGNED", timestamp: new Date(Date.now() - 60 * 60000) },
          {
            status: "ON_THE_WAY",
            timestamp: new Date(Date.now() - 30 * 60000),
          },
          { status: "DELIVERED", timestamp: new Date() },
        ],
      },
    },
  });

  // Simulación de una ruta en curso para el mapa del Dashboard
  await prisma.ubication.createMany({
    data: [
      { deliveryId: dlv1.id, latitude: -38.7183, longitude: -62.2662 },
      { deliveryId: dlv1.id, latitude: -38.719, longitude: -62.2675 }, // Punto intermedio
      { deliveryId: dlv1.id, latitude: -38.7205, longitude: -62.269 }, // Ubicación actual
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
