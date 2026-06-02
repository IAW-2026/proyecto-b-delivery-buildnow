import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // NOTA: Se quitaron los deleteMany para no borrar a los usuarios reales
  // sincronizados con Clerk. En lugar de eso, usamos operaciones seguras
  // o asumimos que el entorno está limpio si usamos 'prisma migrate reset'.

  // Repartidores de prueba
  const rep1 = await prisma.repartidor.upsert({
    where: {
      clerkUserId: "user_3EPaQy8573olgQt01UdOCS17s83",
    },
    update: {
      email: "delivery1+clerk_test@iaw.com",
      name: "Delivery DeliveryCuenta_1",
      phone: "+14155552671",
      vehicleType: "CAR",
    },
    create: {
      clerkUserId: "user_3EPaQy8573olgQt01UdOCS17s83",
      name: "Delivery DeliveryCuenta_1",
      email: "delivery1+clerk_test@iaw.com",
      phone: "+14155552671",
      vehicleType: "CAR",
      role: "DELIVERY",
    },
  });

  const rep2 = await prisma.repartidor.upsert({
    where: { email: "delivery2+clerk_test@iaw.com" },
    update: {
      clerkUserId: "user_3EYRqMKQgvlLGxfIeMO1zWJCzXM",
    },
    create: {
      clerkUserId: "user_3EYRqMKQgvlLGxfIeMO1zWJCzXM",
      name: "Delivery DeliveryCuenta_2",
      email: "delivery2+clerk_test@iaw.com",
      phone: "+14155552672",
      vehicleType: "CAR",
      role: "DELIVERY",
    },
  });

  const rep3 = await prisma.repartidor.upsert({
    where: { email: "delivery3+clerk_test@iaw.com" },
    update: {
      clerkUserId: "user_3EYRtHah4IB3yW4sZNNo1ZiJo1I",
    },
    create: {
      clerkUserId: "user_3EYRtHah4IB3yW4sZNNo1ZiJo1I",
      name: "Delivery DeliveryCuenta_3",
      email: "delivery3+clerk_test@iaw.com",
      phone: "+14155552673",
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
      amount: 1850.0,
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
      amount: 1200.0,
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

  const dlv3 = await prisma.delivery.upsert({
    where: { orderId: "order_10125" },
    update: {
      delivyUserId: rep1.id,
    },
    create: {
      id: "dlv_003",
      orderId: "order_10125",
      delivyUserId: rep1.id,
      status: "ASSIGNED",
      storeName: "Corralón El Constructor",
      pickupLocation: "Donado 850, Bahía Blanca",
      deliveryAddress: "Zelarrayán 1200, Bahía Blanca, Buenos Aires, Argentina",
      totalItems: 8,
      totalWeight: 12.5,
      amount: 4500.0,
      stateHistories: {
        create: [
          {
            status: "ASSIGNED",
            timestamp: new Date(),
          },
        ],
      },
    },
  });

  const dlv4 = await prisma.delivery.upsert({
    where: { orderId: "order_10126" },
    update: {
      delivyUserId: rep1.id,
    },
    create: {
      id: "dlv_004",
      orderId: "order_10126",
      delivyUserId: rep1.id,
      status: "ON_THE_WAY",
      storeName: "Pinturería Color Hogar",
      pickupLocation: "Vieytes 420, Bahía Blanca",
      deliveryAddress: "Estomba 1550, Bahía Blanca, Buenos Aires, Argentina",
      totalItems: 6,
      totalWeight: 7.2,
      amount: 3200.0,
      stateHistories: {
        create: [
          {
            status: "ASSIGNED",
            timestamp: new Date(Date.now() - 40 * 60000),
          },
          {
            status: "ON_THE_WAY",
            timestamp: new Date(Date.now() - 15 * 60000),
          },
        ],
      },
    },
  });

  const dlv5 = await prisma.delivery.upsert({
    where: { orderId: "order_10127" },
    update: {
      delivyUserId: rep2.id,
    },
    create: {
      id: "dlv_005",
      orderId: "order_10127",
      delivyUserId: rep2.id,
      status: "DELIVERED",
      storeName: "Materiales del Sur",
      pickupLocation: "Brown 230, Bahía Blanca",
      deliveryAddress: "Paraguay 890, Bahía Blanca, Buenos Aires, Argentina",
      totalItems: 3,
      totalWeight: 4.3,
      amount: 1800.0,
      stateHistories: {
        create: [
          {
            status: "ASSIGNED",
            timestamp: new Date(Date.now() - 90 * 60000),
          },
          {
            status: "ON_THE_WAY",
            timestamp: new Date(Date.now() - 50 * 60000),
          },
          {
            status: "DELIVERED",
            timestamp: new Date(Date.now() - 10 * 60000),
          },
        ],
      },
    },
  });

  const dlv6 = await prisma.delivery.upsert({
    where: { orderId: "order_10128" },
    update: {
      delivyUserId: rep2.id,
    },
    create: {
      id: "dlv_006",
      orderId: "order_10128",
      delivyUserId: rep2.id,
      status: "ON_THE_WAY",
      storeName: "TodoFerretería Bahía",
      pickupLocation: "Av. Alem 1050, Bahía Blanca",
      deliveryAddress: "Rondeau 1780, Bahía Blanca, Buenos Aires, Argentina",
      totalItems: 10,
      totalWeight: 18.0,
      amount: 6200.0,
      stateHistories: {
        create: [
          {
            status: "ASSIGNED",
            timestamp: new Date(Date.now() - 70 * 60000),
          },
          {
            status: "ON_THE_WAY",
            timestamp: new Date(Date.now() - 20 * 60000),
          },
        ],
      },
    },
  });

  const dlv7 = await prisma.delivery.upsert({
    where: { orderId: "order_10129" },
    update: {
      delivyUserId: rep1.id,
    },
    create: {
      id: "dlv_007",
      orderId: "order_10129",
      delivyUserId: rep1.id,
      status: "DELIVERED",
      storeName: "Electricidad Industrial SRL",
      pickupLocation: "Chiclana 640, Bahía Blanca",
      deliveryAddress: "Thompson 320, Bahía Blanca, Buenos Aires, Argentina",
      totalItems: 5,
      totalWeight: 9.8,
      amount: 3900.0,
      stateHistories: {
        create: [
          {
            status: "ASSIGNED",
            timestamp: new Date(Date.now() - 120 * 60000),
          },
          {
            status: "ON_THE_WAY",
            timestamp: new Date(Date.now() - 80 * 60000),
          },
          {
            status: "DELIVERED",
            timestamp: new Date(Date.now() - 25 * 60000),
          },
        ],
      },
    },
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
