import Stripe from "stripe";

// Check if Stripe keys are valid (not placeholder/empty values)
const isValidStripeKey = (key: string | undefined): boolean => {
  if (!key || key.trim() === "") return false;
  // Check if it's a placeholder value
  if (
    key.includes("sk_test_...") ||
    key.includes("sk_live_...") ||
    key.includes("...") ||
    key.length < 20
  ) {
    return false;
  }
  return true;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const hasValidStripeKey = isValidStripeKey(stripeSecretKey);

// Only create Stripe client if STRIPE_SECRET_KEY is valid
export const stripeClient = hasValidStripeKey
  ? new Stripe(stripeSecretKey!, {
      apiVersion: "2025-08-27.basil",
      timeout: 20000,
      maxNetworkRetries: 3,
    })
  : null;
