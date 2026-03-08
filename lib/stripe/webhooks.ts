import { stripeClient } from "../stripe";
import { syncSubscriptionFromStripe } from "./subscription-manager";
import { resetMonthlyUsage, shouldResetSubscription } from "../credits/reset-manager";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(
  event: Stripe.Event
) {
  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentSucceeded(invoice);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function resolveUserIdFromCustomer(customerId?: string | null) {
  if (!customerId) {
    return null;
  }

  const subscriptionUser = await prisma.subscription.findFirst({
    where: {
      stripeCustomerId: customerId,
    },
    select: {
      referenceId: true,
    },
    orderBy: [{ periodEnd: "desc" }],
  });

  if (subscriptionUser?.referenceId) {
    return subscriptionUser.referenceId;
  }

  const user = await prisma.user.findFirst({
    where: {
      stripeCustomerId: customerId,
    },
    select: {
      id: true,
    },
  });

  return user?.id ?? null;
}

async function resolveUserIdFromSubscription(subscription: Stripe.Subscription) {
  if (subscription.metadata?.userId) {
    return subscription.metadata.userId;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  return resolveUserIdFromCustomer(customerId);
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Processing checkout.session.completed webhook", {
    sessionId: session.id,
    subscriptionId: session.subscription,
    userId: session.metadata?.userId,
  });

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const userId =
    session.metadata?.userId ||
    session.client_reference_id ||
    (await resolveUserIdFromCustomer(customerId));
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) {
    console.error("Missing userId or subscriptionId in checkout session", {
      userId,
      subscriptionId,
      metadata: session.metadata,
    });
    return;
  }

  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  try {
    // Retrieve the subscription from Stripe
    const stripeSubscription = await stripeClient.subscriptions.retrieve(
      subscriptionId
    );

    console.log("Retrieved Stripe subscription", {
      subscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
      customerId: stripeSubscription.customer,
    });

    // Sync to database
    const dbSubscription = await syncSubscriptionFromStripe(
      stripeSubscription,
      userId
    );

    if (!dbSubscription) {
      console.error("Failed to sync subscription to database", {
        subscriptionId: stripeSubscription.id,
        userId,
      });
      return;
    }

    console.log("Subscription synced to database", {
      subscriptionId: dbSubscription.id,
      creditsLimit: dbSubscription.creditsLimit,
      imagesLimit: dbSubscription.imagesLimit,
      creditsUsed: dbSubscription.creditsUsed,
      imagesUsed: dbSubscription.imagesUsed,
    });
  } catch (error) {
    console.error("Error handling checkout completed:", error);
    throw error;
  }
}

/**
 * Handle subscription created/updated
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const userId = await resolveUserIdFromSubscription(subscription);

  console.log("Processing subscription updated webhook", {
    subscriptionId: subscription.id,
    status: subscription.status,
    userId,
  });

  if (!userId) {
    console.error("Missing userId for subscription", {
      subscriptionId: subscription.id,
      metadata: subscription.metadata,
    });
    return;
  }

  try {
    // Sync to database
    const dbSubscription = await syncSubscriptionFromStripe(
      subscription,
      userId
    );

    if (!dbSubscription) {
      console.error("Failed to sync subscription to database", {
        subscriptionId: subscription.id,
        userId,
      });
      return;
    }

    console.log("Subscription synced to database", {
      subscriptionId: dbSubscription.id,
      creditsLimit: dbSubscription.creditsLimit,
      imagesLimit: dbSubscription.imagesLimit,
    });

    // Check if we need to reset usage (new billing period)
    if (await shouldResetSubscription(dbSubscription.id)) {
      console.log("Resetting monthly usage for subscription", {
        subscriptionId: dbSubscription.id,
      });
      await resetMonthlyUsage(dbSubscription.id);
    }
  } catch (error) {
    console.error("Error handling subscription updated:", error);
    throw error;
  }
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: "canceled",
    },
  });
}

/**
 * Handle successful payment (monthly renewal)
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Access subscription property safely with type assertion
  const invoiceData = invoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription;
  };
  const subscriptionId = typeof invoiceData.subscription === "string" 
    ? invoiceData.subscription 
    : invoiceData.subscription?.id;

  if (!subscriptionId || typeof subscriptionId !== "string") {
    return;
  }

  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  // Retrieve subscription
  const stripeSubscription = await stripeClient.subscriptions.retrieve(
    subscriptionId as string
  );

  // Update subscription in database
  await handleSubscriptionUpdated(stripeSubscription);

  // Reset usage for new billing period
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscriptionId,
    },
  });

  if (dbSubscription) {
    await resetMonthlyUsage(dbSubscription.id);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Access subscription property safely with type assertion
  const invoiceData = invoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription;
  };
  const subscriptionId = typeof invoiceData.subscription === "string" 
    ? invoiceData.subscription 
    : invoiceData.subscription?.id;

  if (!subscriptionId) {
    return;
  }

  // Update subscription status
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscriptionId,
    },
    data: {
      status: "past_due",
    },
  });
}
