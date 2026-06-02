import { prisma } from "@/src/app/lib/prisma";
import { geocodeAddress } from "./geocode";

export async function getCachedGeocode(address: string) {
  const cached = await prisma.geocodeCache.findUnique({
    where: {
      address,
    },
  });

  if (cached) {
    return {
      lat: cached.latitude,
      lon: cached.longitude,
      displayName: cached.displayName ?? address,
    };
  }

  const result = await geocodeAddress(address);

  await prisma.geocodeCache.create({
    data: {
      address,
      latitude: result.lat,
      longitude: result.lon,
      displayName: result.displayName,
    },
  });

  return result;
}
