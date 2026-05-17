'use client'

import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="mt-8">
      <SignIn path="/login" routing="path" signUpUrl="/register" />
    </div>
  )
}
