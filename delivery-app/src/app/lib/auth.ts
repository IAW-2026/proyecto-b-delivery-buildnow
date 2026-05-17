import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

export async function requireDeliveryUser() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  const repartidor = await prisma.repartidor.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!repartidor) {
    redirect('/login')
  }

  return repartidor
}
