-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RouteStopStatus" AS ENUM ('PENDING', 'ACTIVE', 'DELIVERED', 'MISSED');

-- CreateEnum
CREATE TYPE "MissedAttemptReason" AS ENUM ('CUSTOMER_UNAVAILABLE', 'ACCESS_ISSUE', 'ADDRESS_ISSUE', 'CUSTOMER_REQUESTED_LATER_DELIVERY', 'PAYMENT_ISSUE', 'OTHER');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('ROUTE_ASSIGNED', 'ROUTE_STARTED', 'STOP_DELIVERED', 'MISSED_SUBMITTED', 'MISSED_REVIEWED', 'ADMIN_CORRECTION', 'ROUTE_COMPLETED');

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "status" "RouteStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "deliveryId" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" "RouteStopStatus" NOT NULL DEFAULT 'PENDING',
    "activeAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "missedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryAttempt" (
    "id" TEXT NOT NULL,
    "routeStopId" TEXT NOT NULL,
    "reason" "MissedAttemptReason" NOT NULL,
    "riderNote" TEXT,
    "adminNote" TEXT,
    "callAttempted" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deliveryId" TEXT,
    "routeStopId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "eventType" "AuditEventType" NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_riderId_status_idx" ON "Route"("riderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_deliveryId_key" ON "RouteStop"("deliveryId");

-- CreateIndex
CREATE INDEX "RouteStop_routeId_status_idx" ON "RouteStop"("routeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeId_sequence_key" ON "RouteStop"("routeId", "sequence");

-- CreateIndex
CREATE INDEX "DeliveryAttempt_routeStopId_createdAt_idx" ON "DeliveryAttempt"("routeStopId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingToken_tokenHash_key" ON "TrackingToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingToken_routeStopId_key" ON "TrackingToken"("routeStopId");

-- CreateIndex
CREATE INDEX "TrackingToken_deliveryId_idx" ON "TrackingToken"("deliveryId");

-- CreateIndex
CREATE INDEX "AuditEvent_actorUserId_idx" ON "AuditEvent"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditEvent_eventType_createdAt_idx" ON "AuditEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_targetEntity_targetEntityId_idx" ON "AuditEvent"("targetEntity", "targetEntityId");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_routeStopId_fkey" FOREIGN KEY ("routeStopId") REFERENCES "RouteStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingToken" ADD CONSTRAINT "TrackingToken_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingToken" ADD CONSTRAINT "TrackingToken_routeStopId_fkey" FOREIGN KEY ("routeStopId") REFERENCES "RouteStop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
