import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request,{ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.delivery.findUnique({
    where: { id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json([
    {
      orderId: order.id,
      status: "ON_THE_WAY",
      estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      courierName: "Reparto Rápido",
    },
  ]);
}
