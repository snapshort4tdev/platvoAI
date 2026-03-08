import prisma from "@/lib/prisma";
import { PLAN_ENUM } from "@/lib/constant";

export const ENTITLED_SUBSCRIPTION_STATUSES = [
  "active",
  "trialing",
  "past_due",
] as const;

export async function getCurrentSubscription(userId: string) {
  const paidSubscription = await prisma.subscription.findFirst({
    where: {
      referenceId: userId,
      status: { in: [...ENTITLED_SUBSCRIPTION_STATUSES] },
      stripeSubscriptionId: { not: null },
    },
    orderBy: [{ periodEnd: "desc" }],
  });

  if (paidSubscription) {
    return paidSubscription;
  }

  return prisma.subscription.findFirst({
    where: {
      referenceId: userId,
      status: { in: [...ENTITLED_SUBSCRIPTION_STATUSES] },
    },
    orderBy: [{ periodEnd: "desc" }],
  });
}

export async function getCurrentPaidSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      referenceId: userId,
      plan: PLAN_ENUM.ALL_IN_ONE,
      status: { in: [...ENTITLED_SUBSCRIPTION_STATUSES] },
      stripeSubscriptionId: { not: null },
    },
    orderBy: [{ periodEnd: "desc" }],
  });
}
