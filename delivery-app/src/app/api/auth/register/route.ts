import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const { firstName, lastName, email, password, phone } = body

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { error: 'Debe completar nombre, apellido, email y contraseña.' },
      { status: 400 }
    )
  }

  const existingEmail = await prisma.repartidor.findUnique({
    where: {
      email,
    },
  })

  if (existingEmail) {
    return NextResponse.json({ error: 'Ya existe un repartidor con ese email.' }, { status: 409 })
  }

  try {
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      password,
      publicMetadata: { role: 'delivery' },
      phoneNumber: phone ? [phone] : undefined,
    })

    if (!clerkUser.id) {
      return NextResponse.json({ error: 'No se pudo crear el usuario en Clerk.' }, { status: 500 })
    }

    await prisma.repartidor.create({
      data: {
        clerkUserId: clerkUser.id,
        name: `${firstName} ${lastName}`,
        email,
        phone: phone ?? '',
        vehicleType: 'Moto',
      },
    })

    return NextResponse.json({ message: 'Usuario creado correctamente.' }, { status: 201 })
  } catch (error: any) {
    // Registrar el error completo en consola para tener visibilidad
    console.error("Error al crear usuario en Clerk:", error.errors || error)
    
    // Clerk envía los detalles de validación en la propiedad "errors"
    const clerkError = error.errors?.[0]?.longMessage || error.errors?.[0]?.message
    
    // Usamos el mensaje detallado de Clerk si existe, de lo contrario usamos el mensaje general
    const message = clerkError || (error instanceof Error ? error.message : 'Error interno del servidor.')
    
    // Devolver un estado 400 si fue un error de validación de Clerk (status 422), sino 500
    const statusCode = error.status === 422 ? 400 : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
