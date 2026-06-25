import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/src/app/lib/utils";
import type { Metadata } from "next";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Panel de Administración",
  description: "Control Center - Global Logistics",
  icons: {
    icon: "buildnow-logo-sin-fondo.png",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
