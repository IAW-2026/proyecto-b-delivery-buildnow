"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/dist/client/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col items-center justify-center px-4 relative text-slate-900">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al inicio
        </Link>
      </div>

      <div className="flex flex-col items-center relative mt-16">
        <div className="absolute bottom-full mb-6 flex flex-col items-center gap-2">
          <div className="w-16 h-16 relative">
            <Image
              src="/buildnow-logo-sin-fondo.png"
              alt="Logo de BuildNow"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold tracking-tight text-orange-900">
            Delivery BuildNow
          </span>
        </div>

        <SignIn path="/login" routing="path" signUpUrl="/register" />
      </div>
    </main>
  );
}
