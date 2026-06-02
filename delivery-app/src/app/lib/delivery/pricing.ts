const BASE_FEE = 1200;
const PRICE_PER_KM = 500;

export function calculateDeliveryFee(distanceKm: number): number {
  const total = BASE_FEE + (distanceKm * PRICE_PER_KM);
  return Math.round(total / 10) * 10;
}