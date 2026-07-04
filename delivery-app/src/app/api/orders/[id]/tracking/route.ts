import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/prisma";
import { geocodeAddress } from "@/src/app/lib/delivery/geocode";
import { calculateRoute } from "@/src/app/lib/delivery/routing";
import { VehicleType } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    const delivery = await prisma.delivery.findUnique({
      where: { orderId: orderId },
    });

    if (!delivery) {
      return NextResponse.json(
        {
          error:
            "No hay información de tracking o el pedido aún no fue tomado.",
        },
        { status: 404 },
      );
    }

    if (!delivery.delivyUserId) {
      return NextResponse.json(
        { error: "El pedido aún no tiene un repartidor asignado." },
        { status: 404 },
      );
    }

    const repartidor = await prisma.repartidor.findUnique({
      where: { id: delivery.delivyUserId },
    });

    let estimatedArrival = new Date(Date.now() + 30 * 60000).toISOString(); // Fallback de 30 mins por si la API falla

    if (
      delivery.status !== "DELIVERED" &&
      delivery.pickupLocation &&
      delivery.deliveryAddress &&
      repartidor?.vehicleType
    ) {
      try {
        const pickup = await geocodeAddress(delivery.pickupLocation);
        const dropoff = await geocodeAddress(delivery.deliveryAddress);
        const route = await calculateRoute(
          pickup.lat,
          pickup.lon,
          dropoff.lat,
          dropoff.lon,
          repartidor.vehicleType as VehicleType,
        );

        estimatedArrival = new Date(
          Date.now() + route.durationMinutes * 60000,
        ).toISOString();
      } catch (err) {
        console.warn(
          "Fallo al calcular ETA en vivo, usando fallback de 30m:",
          err,
        );
      }
    } else if (delivery.status === "DELIVERED") {
      estimatedArrival = new Date().toISOString();
    }

    const trackingResponse = [
      {
        orderId: orderId,
        status: delivery.status, // ej: "ON_THE_WAY"
        estimatedArrival: estimatedArrival,
        curierName: repartidor?.name || "Repartidor",
      },
    ];

    return NextResponse.json(trackingResponse, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener la información de tracking:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el tracking." },
      { status: 500 },
    );
  }
}
