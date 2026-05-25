import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/src/app/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 },
      );
    }

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const repartidor = await prisma.repartidor.findUnique({
      where: { clerkUserId: userId },
    });

    return NextResponse.json(
      {
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        phone:
          clerkUser.primaryPhoneNumber?.phoneNumber || repartidor?.phone || "",
        vehicle: repartidor?.vehicleType || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
      },
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { error: error?.message || "Error interno al obtener perfil." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { firstName, lastName, phone, vehicle } = body;

    if (!firstName || !lastName || !phone || !vehicle) {
      return NextResponse.json(
        {
          error:
            "Faltan campos obligatorios: firstName, lastName, phone o vehicle.",
        },
        { status: 400 },
      );
    }

    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      firstName,
      lastName,
      // phoneNumber: phone ? [phone] : undefined,
    });

    await prisma.repartidor.updateMany({
      where: { clerkUserId: userId },
      data: {
        name: `${firstName} ${lastName}`,
        phone,
        vehicleType: vehicle,
        email: body.email,
      },
    });

    return NextResponse.json(
      { message: "Perfil actualizado correctamente." },
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { error: error?.message || "Error interno al actualizar perfil." },
      { status: 500 },
    );
  }
}
