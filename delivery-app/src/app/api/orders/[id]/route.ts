import { NextResponse } from "next/server";
import { sampleOrders } from "../../../lib/mockData";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payload = await request.json();
  const { status } = payload;
  const order = sampleOrders.find((item) => item.id === params.id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!status) {
    return NextResponse.json({ error: "Missing status field" }, { status: 400 });
  }

  return NextResponse.json({ id: order.id, status, updatedAt: new Date().toISOString() });
}
