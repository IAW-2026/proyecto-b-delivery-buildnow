import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // NOTA: Se quitaron los deleteMany para no borrar a los usuarios reales 
  // sincronizados con Clerk. En lugar de eso, usamos operaciones seguras
  // o asumimos que el entorno está limpio si usamos 'prisma migrate reset'.

  // Repartidores de prueba
  const rep1 = await prisma.repartidor.upsert({
    where: { email: 'martina03.moreno@gmail.com' }, // <-- Cambia a tu email real
    update: {},
    create: {
      clerkUserId: 'user_3DpGF63ZWlhye88fALbW6PWrEFL', // <-- Cambia por tu ID de Clerk
      name: 'Martina Moreno',
      email: 'martina03.moreno@gmail.com', // <-- Cambia a tu email real
      phone: '+14155552671',
      vehicleType: 'MOTORBIKE',
      role: 'DELIVERY',
    },
  });

  const rep2 = await prisma.repartidor.upsert({
    where: { email: 'laura.alvarez@delivery.com' },
    update: {},
    create: {
      clerkUserId: 'user_clerk_rep2',
      name: 'Laura Álvarez',
      email: 'laura.alvarez@delivery.com',
      phone: '+19183038953',
      vehicleType: 'BICYCLE',
      role: 'DELIVERY',
    },
  });

  // Envíos (Deliveries) de prueba
  const dlv1 = await prisma.delivery.upsert({
    where: { orderId: 'order_10123' },
    update: {},
    create: {
      id: 'dlv_001',
      orderId: 'order_10123',
      delivyUserId: rep1.id,
      status: 'DELIVERED',
      storeName: 'Corralón BuildNOW',
      pickupLocation : 'Av. Alem 1253, Bahía Blanca',
      deliveryAddress: 'San Martín 450, Bahía Blanca',
      totalItems: 5,
      totalWeight: 12.5,
      stateHistories: {
        create: [
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 60 * 60000) },
          { status: 'ON_THE_WAY', timestamp: new Date(Date.now() - 30 * 60000) },
          { status: 'DELIVERED', timestamp: new Date() },
        ],
      }
    },
  });

  // Simulación de una ruta en curso para el mapa del Dashboard
  await prisma.ubication.createMany({
    data: [
      { deliveryId: dlv1.id, latitude: -38.7183, longitude: -62.2662 },
      { deliveryId: dlv1.id, latitude: -38.7190, longitude: -62.2675 }, // Punto intermedio
      { deliveryId: dlv1.id, latitude: -38.7205, longitude: -62.2690 }, // Ubicación actual
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