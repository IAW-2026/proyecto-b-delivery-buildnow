import { VehicleType } from "@prisma/client";

export const ORS_PROFILES: Record<VehicleType, string> = {
  BICYCLE: "cycling-regular",
  MOTORBIKE: "driving-car",
  CAR: "driving-car",
};

export const ORS_GOOGLE_MAPS_PROFILES: Record<VehicleType, string> = {
  BICYCLE: "dirflg=b",
  MOTORBIKE: "dirflg=d",
  CAR: "dirflg=d",
};
