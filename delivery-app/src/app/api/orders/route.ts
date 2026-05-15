import { NextResponse } from "next/server";
import { buildId, calculateTotalAmount, calculateTotalWeight, sampleOrders } from "../../lib/mockData";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  if (status === "READY") {
    return NextResponse.json(sampleOrders.filter((order) => order.status === "READY"));
  }

  return NextResponse.json(sampleOrders);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const { buyerId, storeId, deliveryAddress, items } = payload;

  if (!buyerId || !storeId || !deliveryAddress || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Invalid order payload. Required fields: buyerId, storeId, deliveryAddress, items." },
      { status: 400 }
    );
  }

  const totalAmount = calculateTotalAmount(items);
  const totalWeight = calculateTotalWeight(items);
  const createdAt = new Date().toISOString();

  return NextResponse.json(
    {
      id: buildId("order"),
      totalAmount,
      status: "PENDING_PAYMENT",
      createdAt,
      storeId,
      deliveryAddress,
      buyerId,
      totalWeight,
      totalItems: items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
    },
    { status: 201 }
  );
}
