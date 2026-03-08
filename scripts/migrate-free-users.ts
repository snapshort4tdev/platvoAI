/**
 * Migration script to update existing free plan users
 * from 0/0 limits to 30 credits and 10 images
 * 
 * Run with: npx tsx scripts/migrate-free-users.ts
 */

import { PrismaClient } from "@prisma/client";
import { PLAN_ENUM } from "../lib/constant";

const prisma = new PrismaClient();

async function migrateFreeUsers() {
  console.log("Starting migration of free plan users...");

  try {
    // Find all free plan subscriptions with 0 limits
    const freeSubscriptions = await prisma.subscription.findMany({
      where: {
        plan: PLAN_ENUM.FREE,
        OR: [
          { creditsLimit: 0 },
          { imagesLimit: 0 },
        ],
      },
    });

    console.log(`Found ${freeSubscriptions.length} free subscriptions to migrate`);

    let updated = 0;
    for (const subscription of freeSubscriptions) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          creditsLimit: 30,
          imagesLimit: 10,
          // Only update lastResetDate if it's not set or is very old
          lastResetDate: subscription.lastResetDate || new Date(),
        },
      });
      updated++;
    }

    console.log(`Successfully migrated ${updated} free subscriptions`);
    console.log("Migration completed!");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if script is executed directly
if (require.main === module) {
  migrateFreeUsers()
    .then(() => {
      console.log("Migration script finished successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateFreeUsers };
