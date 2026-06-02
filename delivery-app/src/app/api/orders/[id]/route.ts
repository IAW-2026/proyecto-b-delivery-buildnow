import { NextResponse } from "next/server";
import { mockAvailableOrders } from "../../../lib/mockdata";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'El campo "status" es requerido.' },
        { status: 400 },
      );
    }

    // Buscamos la orden en nuestros datos simulados (mocks)
    const orderIndex = mockAvailableOrders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: "No se encontró la orden especificada en los mocks." },
        { status: 404 },
      );
    }

    // Actualizamos el estado de la orden en el mock
    mockAvailableOrders[orderIndex].status = status;

    return NextResponse.json(
      {
        id: orderId,
        status: status,
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al actualizar la orden:", error);
    return NextResponse.json(
      {
        error:
          "Error interno del servidor al actualizar el estado de la orden.",
      },
      { status: 500 },
    );
  }
}
