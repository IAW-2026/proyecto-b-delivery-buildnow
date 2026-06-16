import { NextResponse } from "next/server";
import { VehicleType } from "@prisma/client";
import { calculateRoute } from "../../../lib/delivery/routing";
import { calculateDeliveryFee } from "../../../lib/delivery/pricing";
import { getCachedGeocode } from "@/src/app/lib/delivery/geocahe";
import { prisma } from "@/src/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { APP_ROLES } from "@/src/types";

export async function GET(request: Request) {
  try {
    const { sessionClaims, userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 },
      );
    }

    const role = (
      sessionClaims as
        | {
            metadata?: {
              role?: string;
            };
          }
        | undefined
    )?.metadata?.role;

    if (
      !role ||
      (role !== APP_ROLES.DELIVERY &&
        role !== APP_ROLES.ADMIN &&
        role !== APP_ROLES.BUYER)
    ) {
      return NextResponse.json(
        { error: "No autorizado. Debes tener un rol válido." },
        { status: 403 },
      );
    } else {
      // Caso payments (en esta app no se inicia sesión)
      return await getQuoteFromOrderId(request);
    }

    if (role === APP_ROLES.BUYER || role === APP_ROLES.ADMIN) {
      return await getQuoteFromAddresses(request);
    }

    if (role === APP_ROLES.DELIVERY || role === APP_ROLES.ADMIN) {
      return await getQuoteForDelivery(request);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error cotizando envío" },
      { status: 500 },
    );
  }
}

async function getQuoteFromOrderId(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const apiKey = request.headers.get("X-API-KEY");

  if (apiKey !== process.env.PAYMENTS_API_KEY) {
    return NextResponse.json({ error: "API Key inválida" }, { status: 401 });
  }

  if (!orderId) {
    return NextResponse.json({ error: "Falta el orderId" }, { status: 400 });
  }

  try {
    const savedQuote = await prisma.quote.findUnique({
      where: { orderId },
    });

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
    console.error(error);
    return NextResponse.json(
      { error: "Error cotizando envío" },
      { status: 500 },
    );
  }
}

async function getQuoteForDelivery(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeAddress = searchParams.get("storeAddress");
  const deliveryAddress = searchParams.get("deliveryAddress");
  const vehicle = "CAR";

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
    console.error(dbError);
  }

  return NextResponse.json({
    amount: price,
  });
}
