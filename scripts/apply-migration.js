const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    const migrationPath = path.join(__dirname, '../prisma/migrations/20260114_add_language_and_generated_images/migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration...');
    await prisma.$executeRawUnsafe(migrationSQL);
    console.log('Migration applied successfully!');
    
    // Mark migration as applied
    await prisma.$executeRaw`
      INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
      VALUES (gen_random_uuid(), '', NOW(), '20260114_add_language_and_generated_images', NULL, NULL, NOW(), 1)
      ON CONFLICT DO NOTHING;
    `;
    
    console.log('Migration marked as applied.');
  } catch (error) {
    console.error('Error applying migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();
