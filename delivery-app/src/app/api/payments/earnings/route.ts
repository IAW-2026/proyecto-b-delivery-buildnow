import { NextResponse } from "next/server";
import {
  generateMockEarnings,
  generateInteractivePayoutHistory,
} from "../../../lib/mockdata";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    // Extraemos los query parameters de la petición
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get("recipientId");
    const recipientType = searchParams.get("recipientType");

    // Validación básica
    if (!recipientId || !recipientType) {
      return NextResponse.json(
        {
          error: "Falta el parámetro de consulta: recipientId o recipientType.",
        },
        { status: 400 },
      );
    }
    // =====================================================================
    // IMPLEMENTACIÓN FUTURA (Llamada real a la aplicación de Payments)
    // =====================================================================
    // const response = await fetch(`/api/payments/earnings?recipientId={id}&recipientType={type}`);
    // if (!response.ok) throw new Error('Error al obtener las ganancias del delivery');
    // const data = await response.json();
    // return NextResponse.json(data, { status: 200 });

    // =====================================================================
    // MOCK ACTUAL (Simulación para avanzar con tu Frontend del repartidor)
    // =====================================================================
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulamos un retraso de red

    const repartidor = await prisma.repartidor.findFirst({
      where: { clerkUserId: recipientId },
    });

    if (!repartidor) {
      const mockEarnings = generateMockEarnings(recipientId, recipientType, []);
      return NextResponse.json(mockEarnings, { status: 200 });
    }

    const deliveries = await prisma.delivery.findMany({
      where: {
        delivyUserId: repartidor.id,
      },
    });

    const mockPayouts = generateInteractivePayoutHistory(
      deliveries,
      recipientId,
      recipientType,
    );

    const mockEarnings = generateMockEarnings(
      recipientId,
      recipientType,
      mockPayouts,
    );

    return NextResponse.json(mockEarnings, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al consultar las ganancias del delivery:", error);
    return NextResponse.json(
      { error: "Error interno al obtener las ganancias del delivery." },
      { status: 500 },
    );
  }
}
