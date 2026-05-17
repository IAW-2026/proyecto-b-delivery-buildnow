
import type { PropsWithChildren } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  )
}