import { NextResponse } from 'next/server';
import { VehicleType } from '@prisma/client';
import { calculateRoute } from '../../../lib/delivery/routing';

const VALID_VEHICLES = Object.values(VehicleType);


export async function GET(request: Request,context: { params: Promise<{vehicle: string;}>}) {
  try {
    const { vehicle } = await context.params;

    if (!VALID_VEHICLES.includes(vehicle as VehicleType)) {
      return NextResponse.json(
        { error: 'Vehículo inválido'},
        { status: 400});
    }

    const { searchParams } = new URL(request.url);
    const startLat = Number(searchParams.get('startLat'));
    const startLon = Number(searchParams.get('startLon'));
    const endLat = Number(searchParams.get('endLat'));
    const endLon = Number(searchParams.get('endLon'));

    // Validar coordenadas
    if (Number.isNaN(startLat) || Number.isNaN(startLon) ||Number.isNaN(endLat) ||Number.isNaN(endLon)) {
      return NextResponse.json(
        { error: 'Coordenadas inválidas' },
        { status: 400 }
      );
    }

    const result =
      await calculateRoute(
        startLat,
        startLon,
        endLat,
        endLon,
        vehicle as VehicleType
      );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error calculando ruta:',error);
    return NextResponse.json(
      { error: 'Error calculando ruta' },
      { status: 500 }
    );
  }
}