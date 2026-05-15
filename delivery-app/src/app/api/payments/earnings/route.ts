import { NextResponse } from "next/server";
import { payouts } from "../../../lib/mockData";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const recipientId = url.searchParams.get("recipientId");
  const recipientType = url.searchParams.get("recipientType");

  if (!recipientId || !recipientType) {
    return NextResponse.json(
      { error: "recipientId and recipientType are required query parameters." },
      { status: 400 }
    );
  }

  const totalEarnings = payouts
    .filter((item) => item.recipientId === recipientId && item.recipientType === recipientType)
    .reduce((sum, item) => sum + item.amount, 0);

  return NextResponse.json({
    recipientId,
    recipientType,
    totalEarnings,
    currency: "ARS",
  });
}
