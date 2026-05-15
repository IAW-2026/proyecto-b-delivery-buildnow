import { NextResponse } from "next/server";
import { buildId, payouts } from "../../../lib/mockData";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const recipientId = url.searchParams.get("recipientId");
  const recipientType = url.searchParams.get("recipientType");

  const filtered = payouts.filter((item) => {
    if (recipientId && item.recipientId !== recipientId) return false;
    if (recipientType && item.recipientType !== recipientType) return false;
    return true;
  });

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const { orderId, recipientId, recipientType, amount } = payload;

  if (!orderId || !recipientId || !recipientType || typeof amount !== "number") {
    return NextResponse.json(
      { error: "Invalid payout payload. Required fields: orderId, recipientId, recipientType, amount." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      id: buildId("payout"),
      orderId,
      recipientId,
      recipientType,
      amount,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
