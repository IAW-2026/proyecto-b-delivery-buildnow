import { NextResponse } from 'next/server';
import { mockAvailableOrders } from '../../lib/mockdata';

export async function GET(request: Request) {
  try {
    // =====================================================================
    // IMPLEMENTACIÓN FUTURA (Cuando la Seller App esté lista)
    // =====================================================================
    // const response = await fetch('https://api.empresa-restaurante.com/api/orders?status=READY');
    // if (!response.ok) throw new Error('Error al obtener pedidos de la Seller App');
    // const data = await response.json();
    // return NextResponse.json(data, { status: 200 });

    // =====================================================================
    // MOCK ACTUAL (Para poder avanzar con tu Frontend de Repartidor hoy)
    // =====================================================================
    // Simulamos un pequeño retraso de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json(mockAvailableOrders, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al consultar pedidos disponibles:", error);
    return NextResponse.json(
      { error: 'Error interno al intentar obtener los pedidos disponibles.' },
      { status: 500 }
    );
  }
}