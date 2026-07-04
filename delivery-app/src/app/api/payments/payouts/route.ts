import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, recipientType } = body;

    if (!orderId || !recipientType) {
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios: orderId o recipientType.",
        },
        { status: 400 },
      );
    }

    // Llamada real a la aplicación de Payments
    const baseUrl = process.env.PAYMENT_API_URL;
    const apiUrl = `${baseUrl}/api/payments/payouts`;

    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie") || "";
    const authHeader = requestHeaders.get("authorization") || "";

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        Authorization: authHeader,
      },
      body: JSON.stringify({ orderId, recipientType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.error ||
            `Error al registrar el payout: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

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
    const recipientType = searchParams.get("recipientType");

    // Validación básica
    if (!recipientType) {
      return NextResponse.json(
        {
          error: "Falta el parámetro de consulta: recipientType.",
        },
        { status: 400 },
      );
    }

    // Llamada real a la aplicación de Payments
    const baseUrl = process.env.PAYMENT_API_URL;
    const paymentsApiUrl = new URL(`${baseUrl}/api/payments/payouts`);

    paymentsApiUrl.searchParams.append("recipientType", recipientType);

    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie") || "";
    const authHeader = requestHeaders.get("authorization") || "";

    const response = await fetch(paymentsApiUrl.toString(), {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.error ||
            `Error al obtener el historial de payouts: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const normalizedData = data?.data ?? data;

    return NextResponse.json(normalizedData, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al consultar los payouts:", error);
    return NextResponse.json(
      { error: "Error interno al obtener el historial de pagos." },
      { status: 500 },
    );
  }
}
