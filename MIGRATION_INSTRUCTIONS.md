# Database Migration Instructions

## Issue: Migration Drift Detected

Your database schema is out of sync with your migration history. This is common when:
- Database was created manually or with `prisma db push`
- Migrations were applied on a different environment
- Database was reset without updating migrations

## Solution: Use `prisma db push`

**Recommended approach** - This will sync your schema without losing data:

```bash
npx prisma db push
```

This command will:
- ✅ Add the new fields to the `File` model (extractedText, processedAt, status)
- ✅ Create the `FileProcessingStatus` enum
- ✅ Add the index on `status` field
- ✅ **NOT** delete any existing data
- ✅ **NOT** require a database reset

## Alternative: Create Baseline Migration

If you prefer to use migrations (recommended for production):

1. Mark existing migrations as applied:
   ```bash
   npx prisma migrate resolve --applied 20250915165619_init
   npx prisma migrate resolve --applied 20250915170557_init
   npx prisma migrate resolve --applied 20250920002325_init
   ```

2. Then create a new migration:
   ```bash
   npx prisma migrate dev --name add_file_processing_fields
   ```

## What Changed

The `File` model now includes:
- `extractedText` (TEXT, nullable) - Stores extracted text from PDFs/Word docs
- `processedAt` (DateTime, nullable) - Timestamp when processing completed
- `status` (enum: pending | processed | failed) - Processing status
- Index on `status` field for faster queries

The new `FileProcessingStatus` enum was added.

## After Migration

1. Regenerate Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Restart your dev server

3. Test file upload and processing
