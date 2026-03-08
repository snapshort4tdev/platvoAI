# Fix Prisma Client Error (P6001)

## Problem
The Prisma client is out of sync with your schema after adding the `FileProcessingStatus` enum and new fields to the `File` model.

## Solution

Run these commands in order:

### 1. First, push schema changes to database:
```bash
npx prisma db push
```

This will:
- Add the `FileProcessingStatus` enum to your database
- Add `extractedText`, `processedAt`, and `status` fields to the `files` table
- Add index on `status` field

### 2. Then, regenerate Prisma client:
```bash
npx prisma generate
```

This will regenerate the Prisma client TypeScript types to match your schema.

### 3. Restart your dev server

After running both commands, restart your Next.js dev server.

## Alternative: One Command

If you prefer, you can combine both:
```bash
npx prisma db push && npx prisma generate
```

## Why This Happened

After updating the Prisma schema (`prisma/schema.prisma`), you need to:
1. **Apply changes to database** (`db push` or `migrate`)
2. **Regenerate TypeScript types** (`generate`)

The error occurred because the generated Prisma client still has the old schema without the new enum and fields.
