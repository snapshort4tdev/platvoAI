export const PLAN_ENUM = {
  FREE: "free",
  ALL_IN_ONE: "all_in_one",
} as const;

export type PlanEnumType = (typeof PLAN_ENUM)[keyof typeof PLAN_ENUM];

export type PaidPlanEnumType = Exclude<PlanEnumType, "free">;

export const UPGRADEABLE_PLANS: PaidPlanEnumType[] = [PLAN_ENUM.ALL_IN_ONE];

export const PLANS = [
  {
    id: 0,
    name: PLAN_ENUM.FREE,
    price: 0,
    priceId: undefined, // No Stripe price ID for free plan
    features: [
      "30 AI Credits / month",
      "10 AI Images / month",
      "Unlimited Notes",
      "Basic Support",
      "Access to core features",
      "Community access",
    ],
    limits: {
      credits: 30,
      images: 10,
      generations: 30, // For backward compatibility
    },
  },
  {
    id: 1,
    name: PLAN_ENUM.ALL_IN_ONE,
    price: 14.99,
    priceId: undefined, // Will be set from Stripe
    features: [
      "3,500 AI Credits / month",
      "120 AI Images / month (Standard)",
      "Full access to all Platvo tools",
      "Access to latest AI model versions",
      "Access to latest AI models like Claude, GPT, and more",
      "Premium & advanced AI models included",
      "AI Advanced Search",
      "Unlimited Notes",
      "Community access",
      "Priority Support",
    ],
    limits: {
      credits: 3500,
      images: 120,
      generations: 3500, // For backward compatibility
    },
  },
];
