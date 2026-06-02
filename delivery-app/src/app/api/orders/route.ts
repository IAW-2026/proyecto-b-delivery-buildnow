import { NextResponse } from "next/server";
import { mockAvailableOrders } from "../../lib/mockdata";
import { prisma } from "@/src/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const allOrders = mockAvailableOrders;

    // const res = await fetch(`<https://api.seller-app.com/orders?status=${status}>`);
    // const allOrders = await res.json();

    // Como no hay estado ASSIGNED en la app Seller App, simulamos que las órdenes que ya están tomadas
    // por repartidores en nuestra BD no aparecen como disponibles para tomar.
    const activeDeliveries = await prisma.delivery.findMany({
      where: {
        status: {
          in: ["ASSIGNED", "ON_THE_WAY", "DELIVERED"],
        },
      },
      select: { orderId: true },
    });

    const takenOrderIds = new Set(
      activeDeliveries.map((delivery) => delivery.orderId),
    );

    const availableOrders = allOrders.filter(
      (order) => !takenOrderIds.has(order.id),
    );

    // Buscamos ordenes con status especificado
    const filteredOrders = status
      ? availableOrders.filter((order) => order.status === status)
      : availableOrders;

    return NextResponse.json(filteredOrders, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las órdenes disponibles:", error);
    return NextResponse.json(
      { error: "Error interno al obtener las órdenes." },
      { status: 500 },
    );
  }
}
