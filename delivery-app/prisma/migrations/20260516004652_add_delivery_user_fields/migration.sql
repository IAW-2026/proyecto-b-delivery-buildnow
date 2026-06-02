/*
  Warnings:

  - You are about to drop the `Repartido` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DELIVERY');

-- DropTable
DROP TABLE "Repartido";

-- CreateTable
CREATE TABLE "Repartidor" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DELIVERY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repartidor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repartidor_clerkUserId_key" ON "Repartidor"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Repartidor_email_key" ON "Repartidor"("email");
