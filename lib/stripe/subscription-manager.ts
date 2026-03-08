import { stripeClient } from "../stripe";
import prisma from "@/lib/prisma";
import { initializeSubscriptionUsage } from "../credits/reset-manager";
import { PLAN_ENUM, PLANS } from "@/lib/constant";
import Stripe from "stripe";

/**
 * Create or update subscription in database from Stripe subscription
 */
export async function syncSubscriptionFromStripe(
  stripeSubscription: Stripe.Subscription,
  userId: string
) {
  const customerId = stripeSubscription.customer as string;
  const subscriptionId = stripeSubscription.id;
  const status = stripeSubscription.status;
  
  // Safely convert Unix timestamps to Date objects
  // Stripe timestamps are in seconds, so multiply by 1000 to get milliseconds
  // Access properties safely with type assertion (Stripe types may not include all properties)
  const stripeSub = stripeSubscription as Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
    cancel_at_period_end?: boolean;
  };
  
  const periodStart = stripeSub.current_period_start
    ? new Date(stripeSub.current_period_start * 1000)
    : null;
  const periodEnd = stripeSub.current_period_end
    ? new Date(stripeSub.current_period_end * 1000)
    : null;
  const cancelAtPeriodEnd = stripeSub.cancel_at_period_end ?? false;

  // Find existing subscription - check by subscription ID first, then by user ID
  let subscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: subscriptionId },
        { referenceId: userId, status: "active" },
      ],
    },
  });

  // Get plan limits from constants
  const allInOnePlan = PLANS.find((p) => p.name === PLAN_ENUM.ALL_IN_ONE);
  const defaultCreditsLimit = allInOnePlan?.limits.credits || 3500;
  const defaultImagesLimit = allInOnePlan?.limits.images || 120;

  const subscriptionData = {
    plan: PLAN_ENUM.ALL_IN_ONE,
    referenceId: userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    status,
    periodStart,
    periodEnd,
    cancelAtPeriodEnd,
    creditsLimit: defaultCreditsLimit,
    imagesLimit: defaultImagesLimit,
  };

  if (subscription) {
    // Update existing subscription - ensure credits/images limits are set
    console.log("Updating existing subscription", {
      subscriptionId: subscription.id,
      userId,
      currentCreditsLimit: subscription.creditsLimit,
      currentImagesLimit: subscription.imagesLimit,
      currentPlan: subscription.plan,
      creditsUsed: subscription.creditsUsed,
      imagesUsed: subscription.imagesUsed,
    });
    
    // Check if upgrading from FREE to ALL_IN_ONE
    const isUpgradingFromFree = subscription.plan === PLAN_ENUM.FREE && subscriptionData.plan === PLAN_ENUM.ALL_IN_ONE;
    
    // Always set limits to default for ALL_IN_ONE plan, or if current limits are 0
    const updateData = {
      ...subscriptionData,
      creditsLimit: subscription.creditsLimit === 0 || subscription.plan !== PLAN_ENUM.ALL_IN_ONE ? defaultCreditsLimit : subscriptionData.creditsLimit,
      imagesLimit: subscription.imagesLimit === 0 || subscription.plan !== PLAN_ENUM.ALL_IN_ONE ? defaultImagesLimit : subscriptionData.imagesLimit,
      // Reset usage to 0 when upgrading from FREE to ALL_IN_ONE to give full credits
      ...(isUpgradingFromFree ? {
        creditsUsed: 0,
        imagesUsed: 0,
      } : {}),
    };
    
    subscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: updateData,
    });
    
    // If credits/images were 0, initialize them
    if (subscription.creditsLimit === 0 || subscription.imagesLimit === 0) {
      await initializeSubscriptionUsage(subscription.id, defaultCreditsLimit, defaultImagesLimit);
      // Refetch to get updated values
      subscription = await prisma.subscription.findUnique({
        where: { id: subscription.id },
      })!;
    }
    
    // Refetch after upgrade to ensure we have latest values for logging
    if (isUpgradingFromFree && subscription) {
      const subscriptionId = subscription.id;
      const refetchedSubscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });
      
      if (refetchedSubscription) {
        subscription = refetchedSubscription;
        console.log("User upgraded from FREE to ALL_IN_ONE - reset usage to 0", {
          subscriptionId: subscription.id,
          userId,
          newCreditsLimit: subscription.creditsLimit,
          newImagesLimit: subscription.imagesLimit,
          creditsUsed: subscription.creditsUsed,
          imagesUsed: subscription.imagesUsed,
        });
      }
    }
  } else {
    // Create new subscription
    console.log("Creating new subscription", {
      userId,
      stripeSubscriptionId: subscriptionId,
      plan: PLAN_ENUM.ALL_IN_ONE,
    });
    subscription = await prisma.subscription.create({
      data: {
        ...subscriptionData,
        creditsUsed: 0,
        imagesUsed: 0,
        lastResetDate: new Date(),
      },
    });

    console.log("Subscription created, initializing usage", {
      subscriptionId: subscription.id,
      creditsLimit: defaultCreditsLimit,
      imagesLimit: defaultImagesLimit,
    });

    // Initialize usage
    await initializeSubscriptionUsage(subscription.id, defaultCreditsLimit, defaultImagesLimit);

    // Verify the subscription was updated correctly
    const verified = await prisma.subscription.findUnique({
      where: { id: subscription.id },
    });
    console.log("Verified subscription after initialization", {
      subscriptionId: verified?.id,
      creditsLimit: verified?.creditsLimit,
      creditsUsed: verified?.creditsUsed,
      imagesLimit: verified?.imagesLimit,
      imagesUsed: verified?.imagesUsed,
    });
    
    if (verified) {
      subscription = verified;
    }
  }

  // Final safety check - ensure limits are never 0 for ALL_IN_ONE plan
  if (subscription && subscription.plan === PLAN_ENUM.ALL_IN_ONE) {
    if (subscription.creditsLimit === 0 || subscription.imagesLimit === 0) {
      console.warn("Subscription has 0 limits for ALL_IN_ONE plan, fixing...", {
        subscriptionId: subscription.id,
        currentCreditsLimit: subscription.creditsLimit,
        currentImagesLimit: subscription.imagesLimit,
      });
      
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          creditsLimit: defaultCreditsLimit,
          imagesLimit: defaultImagesLimit,
        },
      });
    }
  }

  return subscription;
}

/**
 * Cancel a subscription (set to cancel at period end)
 */
export async function cancelSubscription(
  stripeSubscriptionId: string
): Promise<void> {
  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  await stripeClient.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  // Update database
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId },
    data: { cancelAtPeriodEnd: true },
  });
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(
  stripeSubscriptionId: string
): Promise<void> {
  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  await stripeClient.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  // Update database
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId },
    data: { cancelAtPeriodEnd: false },
  });
}

/**
 * Get Stripe customer ID for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    // Avoid an extra network call on every upgrade request.
    // Stripe will reject unknown customer IDs during checkout if invalid.
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripeClient.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  // Update user with customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
