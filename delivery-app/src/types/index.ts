export interface Order {
  id: string;
  storeName: string;
  storeAddress: string;
  deliveryAddress: string;
  totalWeight: number;
  totalItems: number;
  createdAt: string;
}

export type OrderWithQuote =
  Order & {
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
  status: 'ASSIGNED' | 'ON_THE_WAY' | 'DELIVERED';
}

export interface MapaEstaticoProps {
  latitud: number;
  longitud: number;
  zoom?: number;  
  ancho?: number;
  alto?: number;
}