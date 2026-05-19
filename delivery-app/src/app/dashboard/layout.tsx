import type { PropsWithChildren } from 'react'
import { requireDeliveryUser } from '../lib/auth'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  await requireDeliveryUser()
  return <>{children}</>
}