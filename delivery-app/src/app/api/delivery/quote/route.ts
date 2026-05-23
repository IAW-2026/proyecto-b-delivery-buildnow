import { NextResponse } from 'next/server';
import { VehicleType } from '@prisma/client';
import { geocodeAddress } from '../../../lib/delivery/geocode';
import { calculateRoute } from '../../../lib/delivery/routing';
import { calculateDeliveryFee } from '../../../lib/delivery/pricing';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeAddress = searchParams.get('storeAddress');
    const deliveryAddress = searchParams.get('deliveryAddress');
    const vehicle = searchParams.get('vehicle');

    if (!storeAddress ||!deliveryAddress || !vehicle ) {
      return NextResponse.json(
        { error: 'Faltan datos'},
        { status: 400 }
      );
    }

    const pickup = await geocodeAddress(storeAddress);
    const delivery = await geocodeAddress(deliveryAddress);
    const route = await calculateRoute(pickup.lat,pickup.lon,delivery.lat,delivery.lon,vehicle as VehicleType);
    const price =calculateDeliveryFee(route.distanceKm);

    return NextResponse.json({
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
      price,
      latitude: pickup.lat,
      longitude: pickup.lon
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: 'Error cotizando envío'},
      {status: 500}
    );
  }
}