import { NextResponse } from "next/server";
import {
  generateMockPayoutCreated,
  generateInteractivePayoutHistory,
  pendingPayout,
} from "../../../lib/mockdata";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Extraer los datos del cuerpo de la petición (body)
    const body = await request.json();
    const { orderId, recipientId, recipientType, amount } = body;

    // 2. Validaciones básicas para asegurarnos de que el frontend envía todo lo necesario
    if (!orderId || !recipientId || !recipientType || amount === undefined) {
      return NextResponse.json(
        {
          error:
            "Faltan campos obligatorios: orderId, recipientId, recipientType o amount.",
        },
        { status: 400 },
      );
    }

    // =====================================================================
    // IMPLEMENTACIÓN FUTURA (Llamada real a la aplicación de Payments)
    // =====================================================================
    // const response = await fetch('/api/payments/payouts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ orderId, recipientId, recipientType, amount })
    // });
    // if (!response.ok) throw new Error('Error al registrar el payout en la app externa');
    // const data = await response.json();
    // return NextResponse.json(data, { status: 201 });

    // =====================================================================
    // MOCK ACTUAL (Simulación para avanzar con el frontend del repartidor)
    // =====================================================================

    // Simulamos un retraso de red para probar estados de carga (loaders) en el UI
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockResponse = generateMockPayoutCreated(
      orderId,
      recipientId,
      recipientType,
      amount,
    );

    return NextResponse.json(mockResponse, { status: 201 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al procesar el payout:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el pago." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    // Extraemos los query parameters de la URL
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get("recipientId");
    const recipientType = searchParams.get("recipientType");

    // Validación básica
    if (!recipientId || !recipientType) {
      return NextResponse.json(
        {
          error:
            "Faltan los parámetros de consulta: recipientId o recipientType.",
        },
        { status: 400 },
      );
    }

    // =====================================================================
    // IMPLEMENTACIÓN FUTURA (Llamada real a la aplicación de Payments)
    // =====================================================================
    // const response = await fetch(`/api/payments/payouts?recipientId={id}&recipientType={type}`);
    // if (!response.ok) throw new Error('Error al obtener el historial de payouts');
    // const data = await response.json();
    // return NextResponse.json(data, { status: 200 });

    // =====================================================================
    // MOCK ACTUAL (Para poder avanzar con tu Frontend del repartidor)
    // =====================================================================
    await new Promise((resolve) => setTimeout(resolve, 800)); // Retraso de red

    // 1. Primero buscamos al repartidor en la BD usando el ID de Clerk
    const repartidor = await prisma.repartidor.findFirst({
      where: { clerkUserId: recipientId },
    });

    if (!repartidor) return NextResponse.json([], { status: 200 });

    // 2. Buscamos los envíos (deliveries) reales usando el ID interno del repartidor
    const deliveries = await prisma.delivery.findMany({
      where: {
        delivyUserId: repartidor.id,
      },
    });

    // 3. Generamos los payouts mapeados a los envíos reales junto con los payout pendientes creados
    const mockPayouts = generateInteractivePayoutHistory(
      deliveries,
      recipientId,
      recipientType,
    );

    // 4. Agregamos el payout pendiente simulados
    mockPayouts.push(pendingPayout(recipientId, recipientType));

    return NextResponse.json(mockPayouts, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al consultar los payouts:", error);
    return NextResponse.json(
      { error: "Error interno al obtener el historial de pagos." },
      { status: 500 },
    );
  }
}
