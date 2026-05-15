import { NextResponse } from "next/server";
import { buildId, payments } from "../../lib/mockData";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  if (orderId) {
    const payment = payments.find((item) => item.orderId === orderId);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment);
  }

  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const { orderId, amount, method } = payload;

  if (!orderId || typeof amount !== "number" || !method) {
    return NextResponse.json(
      { error: "Invalid payment payload. Required fields: orderId, amount, method." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      id: buildId("payment"),
      orderId,
      status: "PENDING",
      amount,
      method,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
