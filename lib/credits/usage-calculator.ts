import { getCreditStats } from "./credit-manager";
import { getImageStats } from "./image-manager";
import { getCurrentSubscription } from "@/lib/subscription/current-subscription";

export interface UsageStats {
  credits: {
    used: number;
    limit: number;
    remaining: number;
    percentageUsed: number;
  };
  images: {
    used: number;
    limit: number;
    remaining: number;
    percentageUsed: number;
  };
  daysUntilReset: number | null;
  subscriptionStatus: string | null;
  plan: string | null;
  periodEnd?: string | null;
}

/**
 * Calculate comprehensive usage statistics for a user
 */
export async function getUsageStats(userId: string): Promise<UsageStats> {
  const subscription = await getCurrentSubscription(userId);

  const creditStats = await getCreditStats(userId);
  const imageStats = await getImageStats(userId);

  let daysUntilReset: number | null = null;
  if (subscription?.periodEnd) {
    const now = new Date();
    const periodEnd = subscription.periodEnd;
    const diffTime = periodEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysUntilReset = Math.max(0, diffDays);
  }

  return {
    credits: {
      used: creditStats.creditsUsed,
      limit: creditStats.creditsLimit,
      remaining: creditStats.creditsRemaining,
      percentageUsed: creditStats.percentageUsed,
    },
    images: {
      used: imageStats.imagesUsed,
      limit: imageStats.imagesLimit,
      remaining: imageStats.imagesRemaining,
      percentageUsed: imageStats.percentageUsed,
    },
    daysUntilReset,
    subscriptionStatus: subscription?.status || null,
    plan: subscription?.plan || null,
    periodEnd: subscription?.periodEnd ? subscription.periodEnd.toISOString() : null,
  };
}
