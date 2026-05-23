import { NextResponse } from 'next/server';
import { prisma } from '@/src/app/lib/prisma';
import crypto from 'crypto';
// import { auth } from '@clerk/nextjs/server'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // const { userId } = auth(); // Si quisieras asociarlo al repartidor logueado

    const existingDelivery = await prisma.delivery.findUnique({
      where: { orderId: body.orderId }
    });

    if (existingDelivery) {
      return NextResponse.json(existingDelivery, { status: 200 });
    }

    const newDelivery = await prisma.delivery.create({
      data: {
        id: crypto.randomUUID(), // Generar un ID único
        orderId: body.orderId,
        storeName: body.storeName,
        pickupLocation: body.storeAddress,
        deliveryAddress: body.deliveryAddress,
        totalItems: body.totalItems,
        totalWeight: body.totalWeight,
        status: 'ASSIGNED',
        // delivyUserId: userId
      }
    });

    return NextResponse.json(newDelivery, { status: 201 });
  } catch (error) {
    console.error('Error al crear el delivery:', error);
    return NextResponse.json(
      { error: 'Error al registrar el envío', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}