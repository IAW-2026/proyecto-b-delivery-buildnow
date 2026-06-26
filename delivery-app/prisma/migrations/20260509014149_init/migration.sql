-- CreateEnum
CREATE TYPE "StatusDelivery" AS ENUM ('ASSIGNED', 'ON_THE_WAY', 'DELIVERED');

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "delivyUserId" TEXT,
    "status" "StatusDelivery" NOT NULL DEFAULT 'ASSIGNED',
    "pickupLocation" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repartido" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,

    CONSTRAINT "Repartido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "STATE_HISTORY" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "status" "StatusDelivery" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "STATE_HISTORY_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubication" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ubication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");

-- AddForeignKey
ALTER TABLE "STATE_HISTORY" ADD CONSTRAINT "STATE_HISTORY_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubication" ADD CONSTRAINT "Ubication_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
