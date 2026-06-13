import { VehicleType, StatusDelivery } from "@prisma/client";

export interface Order {
  id: string;
  storeName: string;
  storeAddress: string;
  deliveryAddress: string;
  totalWeight: number;
  totalItems: number;
  createdAt: string;
}

export type OrderWithQuote = Order & {
  quote?: {
    distanceKm: number;
    durationMinutes: number;
    price: number;
    latitude: number;
    longitude: number;
  };
};

export interface Delivery {
  id: string;
  orderId: string;
  storeName: string;
  pickupLocation: string;
  deliveryAddress: string;
  totalWeight: number;
  totalItems: number;
  amount: number;
  status: "ASSIGNED" | "ON_THE_WAY" | "DELIVERED";
}

export interface MapaEstaticoProps {
  latitud: number;
  longitud: number;
  zoom?: number;
  ancho?: number;
  alto?: number;
}

export interface Repartidor {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  vehicleType: VehicleType;
  role: "DELIVERY";
  deliveries: Delivery[];
}

export const STATUS_OPTIONS: StatusDelivery[] = [
  "ASSIGNED",
  "ON_THE_WAY",
  "DELIVERED",
];

export const VEHICLE_OPTIONS: VehicleType[] = ["BICYCLE", "MOTORBIKE", "CAR"];

export const APP_ROLES = {
  BUYER: "buyer",
  DELIVERY: "delivery",
  SELLER: "seller",
  ADMIN: "admin",
  PAYMENTS: "payments",
} as const;
