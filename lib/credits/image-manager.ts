import prisma from "@/lib/prisma";
import { PLANS, PLAN_ENUM } from "@/lib/constant";
import { getCurrentSubscription } from "@/lib/subscription/current-subscription";

export interface ImageCheckResult {
  hasImages: boolean;
  imagesRemaining: number;
  imagesLimit: number;
  imagesUsed: number;
}

/**
 * Check if user has image allowance available
 */
export async function checkImageLimit(
  userId: string
): Promise<ImageCheckResult> {
  let subscription = await getCurrentSubscription(userId);

  if (!subscription) {
    // Create default free subscription if none exists
    const freePlan = PLANS.find((p) => p.name === PLAN_ENUM.FREE);
    const defaultImagesLimit = freePlan?.limits.images || 10;
    
    subscription = await prisma.subscription.create({
      data: {
        referenceId: userId,
        plan: PLAN_ENUM.FREE,
        status: "active",
        creditsUsed: 0,
        creditsLimit: freePlan?.limits.credits || 30,
        imagesUsed: 0,
        imagesLimit: defaultImagesLimit,
        lastResetDate: new Date(),
      },
    });
  }

  const imagesRemaining = Math.max(
    0,
    subscription.imagesLimit - subscription.imagesUsed
  );

  return {
    hasImages: imagesRemaining > 0,
    imagesRemaining,
    imagesLimit: subscription.imagesLimit,
    imagesUsed: subscription.imagesUsed,
  };
}

/**
 * Deduct image allowance from user's subscription
 * All images count as 1 (no HD distinction)
 * @param userId - User ID
 * @returns true if deduction was successful, false if insufficient allowance
 */
export async function deductImage(userId: string): Promise<boolean> {
  const subscription = await getCurrentSubscription(userId);

  if (!subscription) {
    return false;
  }

  // Check if user has enough images
  if (subscription.imagesUsed + 1 > subscription.imagesLimit) {
    return false;
  }

  // Deduct 1 image (all images count equally)
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      imagesUsed: {
        increment: 1,
      },
    },
  });

  return true;
}

/**
 * Get image usage statistics for a user
 */
export async function getImageStats(userId: string) {
  const subscription = await getCurrentSubscription(userId);

  if (!subscription) {
    return {
      imagesUsed: 0,
      imagesLimit: 0,
      imagesRemaining: 0,
      percentageUsed: 0,
    };
  }

  const imagesRemaining = Math.max(
    0,
    subscription.imagesLimit - subscription.imagesUsed
  );
  const percentageUsed =
    subscription.imagesLimit > 0
      ? (subscription.imagesUsed / subscription.imagesLimit) * 100
      : 0;

  return {
    imagesUsed: subscription.imagesUsed,
    imagesLimit: subscription.imagesLimit,
    imagesRemaining,
    percentageUsed: Math.min(100, percentageUsed),
  };
}
