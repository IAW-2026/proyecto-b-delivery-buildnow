import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    // Extraemos los query parameters de la petición
    const { searchParams } = new URL(request.url);
    const recipientType = searchParams.get("recipientType");

    // Validación básica
    if (!recipientType) {
      return NextResponse.json(
        {
          error: "Falta el parámetro de consulta: recipientId o recipientType.",
        },
        { status: 400 },
      );
    }

    // Llamada real a la API de Payments
    const baseUrl = process.env.PAYMENT_API_URL;
    const paymentsApiUrl = new URL(`${baseUrl}/api/payments/earnings`);

    paymentsApiUrl.searchParams.append(
      "recipientType",
      recipientType.toLowerCase(),
    );

    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie") || "";
    const authHeader = requestHeaders.get("authorization") || "";

    const response = await fetch(paymentsApiUrl.toString(), {
      headers: {
        Cookie: cookieHeader,
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.error ||
            `Error al obtener las ganancias: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al consultar las ganancias del delivery:", error);
    return NextResponse.json(
      { error: "Error interno al obtener las ganancias del delivery." },
      { status: 500 },
    );
  }
}
