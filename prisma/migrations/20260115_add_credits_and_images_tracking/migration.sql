-- AlterEnum
ALTER TYPE "public"."Plan" ADD VALUE 'all_in_one';

-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN "creditsUsed" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "public"."subscriptions" ADD COLUMN "creditsLimit" INTEGER NOT NULL DEFAULT 1500;
ALTER TABLE "public"."subscriptions" ADD COLUMN "imagesUsed" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "public"."subscriptions" ADD COLUMN "imagesLimit" INTEGER NOT NULL DEFAULT 100;
ALTER TABLE "public"."subscriptions" ADD COLUMN "lastResetDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "subscriptions_referenceId_idx" ON "public"."subscriptions"("referenceId");
CREATE INDEX IF NOT EXISTS "subscriptions_lastResetDate_idx" ON "public"."subscriptions"("lastResetDate");

-- CreateEnum
CREATE TYPE "public"."UsageType" AS ENUM ('chat', 'image');

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."usage_tracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."UsageType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hour" TEXT NOT NULL,

    CONSTRAINT "usage_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "usage_tracking_userId_idx" ON "public"."usage_tracking"("userId");
CREATE INDEX IF NOT EXISTS "usage_tracking_hour_idx" ON "public"."usage_tracking"("hour");
CREATE INDEX IF NOT EXISTS "usage_tracking_type_idx" ON "public"."usage_tracking"("type");
