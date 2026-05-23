/*
  Warnings:

  - Added the required column `storeName` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalItems` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `vehicleType` on the `Repartidor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('BICYCLE', 'MOTORBIKE', 'CAR');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "storeName" TEXT NOT NULL,
ADD COLUMN     "totalItems" INTEGER NOT NULL,
ADD COLUMN     "totalWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Repartidor" DROP COLUMN "vehicleType",
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;
