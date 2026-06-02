import { NextResponse } from "next/server";
import { VehicleType } from "@prisma/client";
import { calculateRoute } from "../../../lib/delivery/routing";
import { calculateDeliveryFee } from "../../../lib/delivery/pricing";
import { getCachedGeocode } from "@/src/app/lib/delivery/geocahe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeAddress = searchParams.get("storeAddress");
    const deliveryAddress = searchParams.get("deliveryAddress");
    const vehicle = searchParams.get("vehicle");

    if (!storeAddress || !deliveryAddress || !vehicle) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const pickup = await getCachedGeocode(storeAddress);
    const delivery = await getCachedGeocode(deliveryAddress);

    console.log(
      "Calculando ruta",
      pickup.lat,
      pickup.lon,
      delivery.lat,
      delivery.lon,
      vehicle,
    );

    const route = await calculateRoute(
      pickup.lat,
      pickup.lon,
      delivery.lat,
      delivery.lon,
      vehicle as VehicleType,
    );
    const price = calculateDeliveryFee(route.distanceKm);

    return NextResponse.json({
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
      price,
      latitude: pickup.lat,
      longitude: pickup.lon,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error cotizando envío" },
      { status: 500 },
    );
  }
}
