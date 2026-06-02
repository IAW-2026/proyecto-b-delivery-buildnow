import { VehicleType } from "@prisma/client";

import { ORS_PROFILES } from "./vehicleMapping";

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  vehicleUsed: VehicleType;
  latitude?: number;
  longitude?: number;
}

export async function calculateRoute(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  vehicle: VehicleType,
): Promise<RouteResult> {
  const apiKey = process.env.OPENROUTESERVICE_KEY;
  const profile = ORS_PROFILES[vehicle];
  const url = `https://api.openrouteservice.org/v2/directions/${profile}`;

  const body = {
    coordinates: [
      [startLon, startLat],
      [endLon, endLat],
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: apiKey!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();

  const summary = data.routes?.[0]?.summary;

  if (!summary) {
    throw new Error("Ruta no encontrada");
  }

  return {
    distanceKm: Number((summary.distance / 1000).toFixed(2)),
    durationMinutes: Number((summary.duration / 60).toFixed(1)),
    latitude: endLat,
    longitude: endLon,
    vehicleUsed: vehicle,
  };
}
