import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

export async function requireDeliveryUser() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  let repartidor = await prisma.repartidor.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!repartidor) {
    // SINCRONIZACIÓN AUTOMÁTICA: 
    // Si el usuario existe en Clerk pero no en Prisma (ej: se borró con el seed), lo recreamos.
    try {
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)
      
      repartidor = await prisma.repartidor.create({
        data: {
          clerkUserId: userId,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Repartidor',
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
          vehicleType: 'MOTORBIKE', // Valor por defecto
          role: 'DELIVERY'
        }
      })
    } catch (error) {
      console.error('Error al sincronizar usuario de Clerk a Prisma:', error)
      redirect('/unauthorized')
    }
  }

  return repartidor
}
