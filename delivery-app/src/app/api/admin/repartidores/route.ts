import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/prisma";

export async function GET() {
  const repartidores = await prisma.repartidor.findMany({
    where: { role: "DELIVERY" },
    orderBy: { name: "asc" },
  });

  const data = await Promise.all(
    repartidores.map(async (repartidor) => {
      const deliveries = await prisma.delivery.findMany({
        where: { delivyUserId: repartidor.id },
        orderBy: { createdAt: "desc" },
      });

      return {
        ...repartidor,
        deliveries,
      };
    }),
  );

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, name, email, vehicleType } = body;

  if (!id || !name || !vehicleType) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios para actualizar el repartidor." },
      { status: 400 },
    );
  }

  const updated = await prisma.repartidor.update({
    where: { id },
    data: {
      name,
      email,
      vehicleType,
    },
  });

  return NextResponse.json(updated);
}
