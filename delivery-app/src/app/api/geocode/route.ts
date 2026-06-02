import { NextResponse } from 'next/server';
import { geocodeAddress } from '../../lib/delivery/geocode';

export async function GET(request: Request) {
  try {
    const { searchParams } =new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Falta address' },
        { status: 400 }
      );
    }

    const result = await geocodeAddress(address);
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      { error: 'Error geocodificando' },
      { status: 500 }
    );
  }
}