export interface Order {
  id: string;
  storeName: string;
  storeAddress: string;
  deliveryAddress: string;
  totalWeight: number;
  totalItems: number;
  createdAt: string;
}