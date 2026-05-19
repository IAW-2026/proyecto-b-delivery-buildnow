import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import { StatusDelivery } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

  
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'El campo "status" es requerido.' },
        { status: 400 }
      );
    }

    const allowedStatuses: StatusDelivery[] = ['ASSIGNED', 'ON_THE_WAY', 'DELIVERED'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Estado inválido. Los permitidos son: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const existingDelivery = await prisma.delivery.findUnique({
      where: { orderId: orderId },
    });

    if (!existingDelivery) {
      return NextResponse.json(
        { error: 'No se encontró una entrega asociada a ese pedido.' },
        { status: 404 }
      );
    }

    const updatedDelivery = await prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.update({
        where: { id: existingDelivery.id },
        data: { status: status as StatusDelivery },
      });

      await tx.sTATE_HISTORY.create({
        data: {
          deliveryId: delivery.id,
          status: status as StatusDelivery,
        },
      });

      return delivery;
    });

    // Unificación con seller app
    // await fetch(`https://api.seller-app.com/orders/${orderId}`, { ... })

    // 5. Responder al frontend con el formato solicitado
    return NextResponse.json({
      id: updatedDelivery.orderId,
      status: updatedDelivery.status,
      updatedAt: new Date().toISOString(), // Como no tienes updatedAt en tu schema, generamos la fecha actual
    }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al actualizar la orden:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar el estado.' },
      { status: 500 }
    );
  }
}