import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/src/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Llamada a la API real de la Seller App
    const baseUrl = process.env.SELLER_API_URL;
    const sellerApiUrl = new URL(`${baseUrl}/api/orders`);
    if (status) {
      sellerApiUrl.searchParams.append("status", status);
    }

    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie") || "";
    const authHeader = requestHeaders.get("authorization") || "";

    const res = await fetch(sellerApiUrl.toString(), {
      headers: {
        Cookie: cookieHeader,
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Falló la petición a la Seller App: ${res.statusText}`);
    }
    const allOrders = await res.json();

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
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      (order: any) => !takenOrderIds.has(order.id),
    );

    // Buscamos ordenes con status especificado
    const filteredOrders = status
      ? //eslint-disable-next-line @typescript-eslint/no-explicit-any
        availableOrders.filter((order: any) => order.status === status)
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
