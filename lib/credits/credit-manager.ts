import prisma from "@/lib/prisma";
import { PLANS, PLAN_ENUM } from "@/lib/constant";
import { getCurrentSubscription } from "@/lib/subscription/current-subscription";

export interface CreditCheckResult {
  hasCredits: boolean;
  creditsRemaining: number;
  creditsLimit: number;
  creditsUsed: number;
}

/**
 * Check if user has credits available
 */
export async function checkCreditLimit(
  userId: string
): Promise<CreditCheckResult> {
  let subscription = await getCurrentSubscription(userId);

  if (!subscription) {
    // Create default free subscription if none exists
    const freePlan = PLANS.find((p) => p.name === PLAN_ENUM.FREE);
    const defaultCreditsLimit = freePlan?.limits.credits || 30;
    
    subscription = await prisma.subscription.create({
      data: {
        referenceId: userId,
        plan: PLAN_ENUM.FREE,
        status: "active",
        creditsUsed: 0,
        creditsLimit: defaultCreditsLimit,
        imagesUsed: 0,
        imagesLimit: freePlan?.limits.images || 10,
        lastResetDate: new Date(),
      },
    });
  }

  const creditsRemaining = Math.max(
    0,
    subscription.creditsLimit - subscription.creditsUsed
  );

  return {
    hasCredits: creditsRemaining > 0,
    creditsRemaining,
    creditsLimit: subscription.creditsLimit,
    creditsUsed: subscription.creditsUsed,
  };
}

/**
 * Deduct credits from user's subscription
 * @param userId - User ID
 * @param amount - Amount of credits to deduct (default: 1)
 * @returns true if deduction was successful, false if insufficient credits
 */
export async function deductCredit(
  userId: string,
  amount: number = 1
): Promise<boolean> {
  const subscription = await getCurrentSubscription(userId);

  if (!subscription) {
    return false;
  }

  // Check if user has enough credits
  if (subscription.creditsUsed + amount > subscription.creditsLimit) {
    return false;
  }

  // Deduct credits
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      creditsUsed: {
        increment: amount,
      },
    },
  });

  return true;
}

/**
 * Get credit usage statistics for a user
 */
export async function getCreditStats(userId: string) {
  const subscription = await getCurrentSubscription(userId);

  if (!subscription) {
    return {
      creditsUsed: 0,
      creditsLimit: 0,
      creditsRemaining: 0,
      percentageUsed: 0,
    };
  }

  const creditsRemaining = Math.max(
    0,
    subscription.creditsLimit - subscription.creditsUsed
  );
  const percentageUsed =
    subscription.creditsLimit > 0
      ? (subscription.creditsUsed / subscription.creditsLimit) * 100
      : 0;

  return {
    creditsUsed: subscription.creditsUsed,
    creditsLimit: subscription.creditsLimit,
    creditsRemaining,
    percentageUsed: Math.min(100, percentageUsed),
  };
}
