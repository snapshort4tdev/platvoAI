-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN IF NOT EXISTS "language" TEXT NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."generated_images" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageKitFileId" TEXT NOT NULL,
    "aspectRatio" TEXT NOT NULL DEFAULT '4:3',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "generated_images_userId_idx" ON "public"."generated_images"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "generated_images_createdAt_idx" ON "public"."generated_images"("createdAt");

-- AddForeignKey (only if constraint doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'generated_images_userId_fkey'
    ) THEN
        ALTER TABLE "public"."generated_images" 
        ADD CONSTRAINT "generated_images_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
