import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/prisma";
import crypto from "crypto";
import { StatusDelivery } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = await auth(); // Si quisieras asociarlo al repartidor logueado

    const existingDelivery = await prisma.delivery.findUnique({
      where: { orderId: body.orderId },
    });

    if (existingDelivery) {
      return NextResponse.json(existingDelivery, { status: 200 });
    }

    const newDelivery = await prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.create({
        data: {
          id: crypto.randomUUID(), // Generar un ID único
          orderId: body.orderId,
          storeName: body.storeName,
          pickupLocation: body.storeAddress,
          deliveryAddress: body.deliveryAddress,
          totalItems: body.totalItems,
          totalWeight: body.totalWeight,
          status: "ASSIGNED",
          delivyUserId: userId,
          amount: body.amount,
        },
      });

      await tx.sTATE_HISTORY.create({
        data: {
          deliveryId: delivery.id,
          status: "ASSIGNED",
        },
      });

      return delivery;
    });

    // Aquí podrías agregar el llamado (fetch) a la Seller App para notificar que la orden fue aceptada
    return NextResponse.json(newDelivery, { status: 201 });
  } catch (error) {
    console.error("Error al crear el delivery:", error);
    return NextResponse.json(
      {
        error: "Error al registrar el envío",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

//Obtener deliveries con estado DELIVERED para mostrar en info de Account
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deliveryId = searchParams.get("deliveryId");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (deliveryId) {
      const delivery = await prisma.delivery.findUnique({
        where: { id: deliveryId },
      });
      if (!delivery) {
        return NextResponse.json(
          { error: "No se encontró el delivery." },
          { status: 404 },
        );
      }
      return NextResponse.json(delivery, { status: 200 });
    }

    if (userId) {
      // Primero buscamos al repartidor real usando el ID de Clerk
      const repartidor = await prisma.repartidor.findUnique({
        where: { clerkUserId: userId },
      });

      if (!repartidor) return NextResponse.json([], { status: 200 });

      const deliveries = await prisma.delivery.findMany({
        where: {
          OR: [{ delivyUserId: repartidor.id }, { delivyUserId: userId }],
          ...(status ? { status: status as StatusDelivery } : {}),
        },
        include: {
          stateHistories: true,
        },
      });

      return NextResponse.json(deliveries, { status: 200 });
    }

    return NextResponse.json(
      { error: "Faltan parámetros: debe proporcionar deliveryId o userId." },
      { status: 400 },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener el delivery:", error);
    return NextResponse.json(
      { error: "Error interno al obtener el delivery." },
      { status: 500 },
    );
  }
}
