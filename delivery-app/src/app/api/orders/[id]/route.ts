import { NextResponse } from "next/server";

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

    // Llamada a la API real de la Seller App
    const baseUrl = process.env.SELLER_API_URL;
    const sellerApiUrl = `${baseUrl}/api/orders/${orderId}`;
    const res = await fetch(sellerApiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.error ||
            `Falló la actualización en Seller App: ${res.statusText}`,
        },
        { status: res.status },
      );
    }

    const updatedOrder = await res.json();

    return NextResponse.json(updatedOrder, { status: 200 });

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
