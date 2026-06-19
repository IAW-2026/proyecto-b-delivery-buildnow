import { NextResponse } from "next/server";
import { calculateRoute } from "../../../lib/delivery/routing";
import { VehicleType } from "@prisma/client";
import { getCachedGeocode } from "@/src/app/lib/delivery/geocahe";
import { ORS_PROFILES } from "@/src/app/lib/delivery/vehicleMapping";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ vehicle: string }> },
) {
  try {
    const { vehicle } = await params;

    const { searchParams } = new URL(request.url);

    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "origin y destination son obligatorios" },
        { status: 400 },
      );
    }

    const originCoords = await getCachedGeocode(origin);
    const destinationCoords = await getCachedGeocode(destination);

    const route = await calculateRoute(
      originCoords.lat,
      originCoords.lon,
      destinationCoords.lat,
      destinationCoords.lon,
      vehicle as VehicleType,
    );

    return NextResponse.json({
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error calculando la ruta" },
      { status: 500 },
    );
  }
}
