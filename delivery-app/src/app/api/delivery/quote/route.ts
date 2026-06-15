import { NextResponse } from "next/server";
import { VehicleType } from "@prisma/client";
import { calculateRoute } from "../../../lib/delivery/routing";
import { calculateDeliveryFee } from "../../../lib/delivery/pricing";
import { getCachedGeocode } from "@/src/app/lib/delivery/geocahe";
import { prisma } from "@/src/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { APP_ROLES } from "@/src/types";

export async function GET(request: Request) {
  const authHeader =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");
  let sessionClaims: unknown;
  let userId: string | null | undefined;

  try {
    // Debug: log incoming Authorization header for troubleshooting external apps
    console.log("[quote.route] Authorization header:", authHeader);

    const authResult = await auth();
    sessionClaims = authResult.sessionClaims;
    userId = authResult.userId;
    console.log("[quote.route] Clerk auth result:", { userId, sessionClaims });

    if (!userId) {
      // If caller added ?debug=1 return extra debug info (do not enable in production)
      const { searchParams } = new URL(request.url);
      if (searchParams.get("debug") === "1") {
        return NextResponse.json(
          {
            error: "No autorizado. Debes iniciar sesión.",
            authHeader,
            sessionClaims,
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 },
      );
    }

    // Extraemos el rol directamente desde los metadatos seguros del token
    const role = sessionClaims?.metadata?.role as string | undefined;

    if (
      !role ||
      (role !== APP_ROLES.DELIVERY &&
        role !== APP_ROLES.ADMIN &&
        role !== APP_ROLES.BUYER &&
        role !== APP_ROLES.PAYMENTS)
    ) {
      return NextResponse.json(
        { error: "No autorizado. Debes tener un rol válido." },
        { status: 403 },
      );
    }

    console.log("[quote.route] role:", role);
    if (role === APP_ROLES.PAYMENTS || role === APP_ROLES.ADMIN) {
      return await getQuoteFromOrderId(request);
    }

    // @ts-expect-error admin puede hacer todos
    if (role === APP_ROLES.BUYER || role === APP_ROLES.ADMIN) {
      return await getQuoteFromAddresses(request);
    }

    if (role === APP_ROLES.DELIVERY || role === APP_ROLES.ADMIN) {
      return await getQuoteForDelivery(request);
    }
  } catch (error) {
    console.error("[quote.route] uncaught error", error);
    const { searchParams } = new URL(request.url);
    if (searchParams.get("debug") === "1") {
      return NextResponse.json(
        {
          error: "Error cotizando envío",
          detail:
            error instanceof Error ? error.message : JSON.stringify(error),
          stack: error instanceof Error ? error.stack : undefined,
          authHeader,
          sessionClaims,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Error cotizando envío" },
      { status: 500 },
    );
  }
}

async function getQuoteFromOrderId(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  console.log("[quote.route] getQuoteFromOrderId orderId:", orderId);

  if (!orderId) {
    return NextResponse.json({ error: "Falta el orderId" }, { status: 400 });
  }

  try {
    const savedQuote = await prisma.quote.findUnique({
      where: { orderId },
    });

    console.log("[quote.route] getQuoteFromOrderId savedQuote:", savedQuote);

    if (!savedQuote) {
      return NextResponse.json(
        {
          error: "No se encontró la cotización para el orderId proporcionado.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        amount:
          savedQuote.amount instanceof Object &&
          typeof savedQuote.amount.toNumber === "function"
            ? savedQuote.amount.toNumber()
            : savedQuote.amount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[quote.route] getQuoteFromOrderId error", error);
    if (searchParams.get("debug") === "1") {
      return NextResponse.json(
        {
          error: "Error leyendo cotización de orderId",
          detail:
            error instanceof Error ? error.message : JSON.stringify(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Error cotizando envío" },
      { status: 500 },
    );
  }
}

// La temporalmente aunque sea codigo repetido, es hasta confirmar que la comunicación entre las apps funciona bien, luego se puede refactorizar
async function getQuoteForDelivery(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeAddress = searchParams.get("storeAddress");
  const deliveryAddress = searchParams.get("deliveryAddress");
  const vehicle = "CAR"; // Forzamos a CAR para evitar problemas a las otras aplicaciones. Agrega complejidad de más tener distintos tipos de montos para el mismo delivery.

  if (!storeAddress || !deliveryAddress) {
    return NextResponse.json(
      { error: "Faltan storeAddress o deliveryAddress" },
      { status: 400 },
    );
  }

  const pickup = await getCachedGeocode(storeAddress);
  const delivery = await getCachedGeocode(deliveryAddress);

  const route = await calculateRoute(
    pickup.lat,
    pickup.lon,
    delivery.lat,
    delivery.lon,
    vehicle as VehicleType,
  );
  const price = calculateDeliveryFee(route.distanceKm);

  return NextResponse.json({
    distanceKm: route.distanceKm,
    durationMinutes: route.durationMinutes,
    amount: price,
    latitude: pickup.lat,
    longitude: pickup.lon,
  });
}

async function getQuoteFromAddresses(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeAddress = searchParams.get("storeAddress");
  const deliveryAddress = searchParams.get("deliveryAddress");
  const orderId = searchParams.get("orderId");
  const vehicle = "CAR"; // Forzamos a CAR para evitar problemas a las otras aplicaciones. Agrega complejidad de más tener distintos tipos de montos para el mismo delivery.

  if (!storeAddress || !deliveryAddress) {
    return NextResponse.json(
      { error: "Faltan storeAddress o deliveryAddress" },
      { status: 400 },
    );
  }

  if (!orderId) {
    return NextResponse.json({ error: "Falta el orderId" }, { status: 400 });
  }

  const pickup = await getCachedGeocode(storeAddress);
  const delivery = await getCachedGeocode(deliveryAddress);
  const route = await calculateRoute(
    pickup.lat,
    pickup.lon,
    delivery.lat,
    delivery.lon,
    vehicle as VehicleType,
  );
  const price = calculateDeliveryFee(route.distanceKm);
  // Guardamos la cotización en la base de datos para futuras consultas.
  // Si la base de datos no está disponible (entorno local sin migraciones,
  // o credenciales incorrectas) no queremos hacer fallar la petición al
  // cliente: registramos el error y continuamos devolviendo el monto.
  try {
    await prisma.quote.upsert({
      where: { orderId },
      update: {
        storeAddress,
        deliveryAddress,
        amount: price,
      },
      create: {
        orderId,
        storeAddress,
        deliveryAddress,
        amount: price,
      },
    });
  } catch (dbError) {
    console.error("Error guardando cotización en BD:", dbError);
  }

  return NextResponse.json({
    amount: price,
  });
}
