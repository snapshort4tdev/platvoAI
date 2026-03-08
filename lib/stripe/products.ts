import { stripeClient } from "../stripe";

const ALL_IN_ONE_PRODUCT_NAME = "PRO Plan";
const ALL_IN_ONE_PRICE_AMOUNT = 1499; // $14.99 in cents
const isValidStripePriceId = (priceId?: string): priceId is string =>
  Boolean(priceId && priceId.startsWith("price_"));

/**
 * Get or create the PRO product in Stripe
 */
export async function getOrCreateAllInOneProduct() {
  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  // Search for existing product
  const products = await stripeClient.products.search({
    query: `name:'${ALL_IN_ONE_PRODUCT_NAME}' AND active:'true'`,
  });

  let product = products.data[0];

  // Create product if it doesn't exist
  if (!product) {
    product = await stripeClient.products.create({
      name: ALL_IN_ONE_PRODUCT_NAME,
      description:
        "PRO Plan: 3,500 AI Credits/month, 120 AI Images/month, Full access to all Platvo tools, latest AI model versions, AI Advanced Search, Unlimited Notes, Community access, and Priority Support.", // Note: This is for Stripe product description, not user-facing UI
      metadata: {
        plan: "all_in_one",
        creditsLimit: "3500",
        imagesLimit: "120",
      },
    });
  }

  return product;
}

/**
 * Get or create the PRO price in Stripe
 */
export async function getOrCreateAllInOnePrice() {
  if (!stripeClient) {
    throw new Error("Stripe client not initialized");
  }

  const product = await getOrCreateAllInOneProduct();

  // Search for existing price
  const prices = await stripeClient.prices.list({
    product: product.id,
    active: true,
  });

  // Find monthly recurring price
  let price = prices.data.find(
    (p) =>
      p.recurring?.interval === "month" &&
      p.unit_amount === ALL_IN_ONE_PRICE_AMOUNT
  );

  // Create price if it doesn't exist
  if (!price) {
    price = await stripeClient.prices.create({
      product: product.id,
      unit_amount: ALL_IN_ONE_PRICE_AMOUNT,
      currency: "usd",
      recurring: {
        interval: "month",
      },
      metadata: {
        plan: "all_in_one",
      },
    });
  }

  return price;
}

/**
 * Get the PRO price ID (for use in checkout)
 */
export async function getAllInOnePriceId(): Promise<string> {
  // Use explicit env override for configured environments
  if (isValidStripePriceId(process.env.STRIPE_PRO_PLAN_PRICE_ID)) {
    return process.env.STRIPE_PRO_PLAN_PRICE_ID;
  }

  // Never auto-create in live mode
  if (process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")) {
    throw new Error(
      "STRIPE_PRO_PLAN_PRICE_ID is required in live mode and must start with 'price_'."
    );
  }

  // Local/test fallback only: auto-create a monthly recurring test price
  const price = await getOrCreateAllInOnePrice();
  return price.id;
}
