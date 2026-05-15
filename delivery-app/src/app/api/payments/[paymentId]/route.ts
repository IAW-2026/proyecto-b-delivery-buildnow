import { NextResponse } from "next/server";
import { payments } from "../../../mockData";

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  const payment = payments.find((item) => item.id === params.paymentId);

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}
