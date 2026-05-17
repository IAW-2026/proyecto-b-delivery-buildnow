import { NextResponse } from "next/server";
import { payments } from "../../../lib/mockData";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;
  const payment = payments.find((item) => item.id === paymentId);

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}
