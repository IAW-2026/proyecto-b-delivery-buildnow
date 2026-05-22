import { VehicleType } from '@prisma/client';

export const ORS_PROFILES: Record<VehicleType,string> = {
  BICYCLE: 'cycling-regular',
  MOTORBIKE: 'driving-car',
  CAR: 'driving-car'
};