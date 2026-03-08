import { stripeClient } from "../stripe";
import { getAllInOnePriceId } from "./products";
import Stripe from "stripe";

/**
 * Create a Stripe checkout session for the PRO subscription
 */
export async function createCheckoutSession(
  customerId: string | null,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  const priceId = await getAllInOnePriceId();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    client_reference_id: userId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      plan: "all_in_one",
    },
    subscription_data: {
      metadata: {
        userId,
        plan: "all_in_one",
      },
    },
  };

  // If customer exists, use it; otherwise Stripe will create one
  if (customerId) {
    sessionParams.customer = customerId;
  } else {
    sessionParams.customer_email = undefined; // Will be collected during checkout
  }

  try {
    const session = await stripeClient.checkout.sessions.create(sessionParams);
    return session;
  } catch (error) {
    const stripeError = error as Stripe.StripeRawError & { param?: string };
    const invalidCustomer =
      stripeError?.type === "invalid_request_error" &&
      stripeError?.param === "customer";

    // If stored customer ID is stale, retry once without customer ID.
    if (customerId && invalidCustomer) {
      const retryParams: Stripe.Checkout.SessionCreateParams = {
        ...sessionParams,
      };
      delete retryParams.customer;
      retryParams.customer_email = undefined;
      return stripeClient.checkout.sessions.create(retryParams);
    }

    throw error;
  }
}
