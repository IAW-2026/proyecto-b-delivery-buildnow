import { NextResponse } from "next/server";
import { sampleOrders } from "../../../../lib/mockData";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const order = sampleOrders.find((item) => item.id === params.id);

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
