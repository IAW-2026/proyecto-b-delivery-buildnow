import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/prisma";
import { StatusDelivery } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("Error al obtener delivery:", error);
    return NextResponse.json(
      { error: "Error al obtener delivery" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el ID del delivery." },
        { status: 400 },
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Falta el estado a actualizar." },
        { status: 400 },
      );
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: { status: status as StatusDelivery },
    });

    return NextResponse.json(updatedDelivery, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el estado del delivery:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar el estado del delivery." },
      { status: 500 },
    );
  }
}
