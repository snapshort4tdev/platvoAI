import prisma from "@/lib/prisma";
import { getCurrentSubscription } from "@/lib/subscription/current-subscription";

/**
 * Reset monthly usage (credits and images) for a subscription
 * This is typically called when a subscription period renews
 */
export async function resetMonthlyUsage(subscriptionId: string): Promise<void> {
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      creditsUsed: 0,
      imagesUsed: 0,
      lastResetDate: new Date(),
    },
  });
}

/**
 * Reset monthly usage for a user's active subscription
 */
export async function resetUserMonthlyUsage(userId: string): Promise<void> {
  const subscription = await getCurrentSubscription(userId);

  if (subscription) {
    await resetMonthlyUsage(subscription.id);
  }
}

/**
 * Initialize credits and images for a new subscription
 */
export async function initializeSubscriptionUsage(
  subscriptionId: string,
  creditsLimit: number = 3500,
  imagesLimit: number = 120
): Promise<void> {
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      creditsUsed: 0,
      creditsLimit,
      imagesUsed: 0,
      imagesLimit,
      lastResetDate: new Date(),
    },
  });
}

/**
 * Check if a subscription needs to be reset based on period end date
 * Returns true if reset is needed
 */
export async function shouldResetSubscription(
  subscriptionId: string
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription || !subscription.periodEnd) {
    return false;
  }

  // Check if period has ended and we haven't reset yet
  const now = new Date();
  const periodEnd = subscription.periodEnd;
  const lastReset = subscription.lastResetDate;

  // If period has ended and either:
  // 1. No reset has happened yet, or
  // 2. Last reset was before the period end
  if (now >= periodEnd) {
    if (!lastReset || lastReset < periodEnd) {
      return true;
    }
  }

  return false;
}
