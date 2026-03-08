"use server";
import { myProvider } from "@/lib/ai/providers";
import { PLAN_ENUM, PLANS, PlanEnumType } from "@/lib/constant";
import prisma from "@/lib/prisma";
import { generateText, type UIMessage } from "ai";
import { checkCreditLimit, deductCredit } from "@/lib/credits/credit-manager";
import { checkImageLimit, deductImage } from "@/lib/credits/image-manager";
import { getCurrentSubscription } from "@/lib/subscription/current-subscription";

export async function generateTitleForUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  // Extract text content from message parts
  const userText = message.parts
    ?.filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim() || "";

  // Fallback: Use first 50 characters of user's message if AI generation fails
  const fallbackTitle = userText
    ? userText.slice(0, 50).trim() + (userText.length > 50 ? "..." : "")
    : "New Chat";

  if (!userText) {
    return fallbackTitle;
  }

  try {
    const { text } = await generateText({
      model: myProvider.languageModel("title-model"),
      system: `You are a helpful assistant that generates concise, descriptive titles for chat conversations based on the user's first message.

Rules:
- Generate a short, descriptive title (maximum 60 characters)
- The title should summarize the main topic or question from the user's message
- Do not use quotes, colons, or special formatting
- Make it clear and specific
- If the message is too short or unclear, create a meaningful title based on the context`,
      prompt: userText,
    });
    
    // Clean up the generated title
    const cleanTitle = text.trim().replace(/^["']|["']$/g, "").slice(0, 60);
    return cleanTitle || fallbackTitle;
  } catch (error) {
    console.log("Title generation error", error);
    return fallbackTitle;
  }
}

export async function createDefaultSubscription(
  userId: string
) {
  try {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        referenceId: userId,
      },
    });
    if (existingSubscription) {
      return {
        success: true,
        subscription: existingSubscription,
      };
    }

    // Get free plan limits from PLANS constant
    const freePlan = PLANS.find((p) => p.name === PLAN_ENUM.FREE);
    const defaultCreditsLimit = freePlan?.limits.credits || 30;
    const defaultImagesLimit = freePlan?.limits.images || 10;

    const subscription = await prisma.subscription.create({
      data: {
        referenceId: userId,
        plan: PLAN_ENUM.FREE,
        stripeCustomerId: null,
        status: "active",
        creditsUsed: 0,
        creditsLimit: defaultCreditsLimit,
        imagesUsed: 0,
        imagesLimit: defaultImagesLimit,
        lastResetDate: new Date(),
      },
    });

    return { success: true, subscription };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to create subscription",
    };
  }
}

export async function checkGenerationLimit(userId: string) {
  let subscription = await getCurrentSubscription(userId);

  // Auto-create free subscription if none exists (for testing without Stripe)
  if (!subscription) {
    try {
      // Get free plan limits from PLANS constant
      const freePlan = PLANS.find((p) => p.name === PLAN_ENUM.FREE);
      const defaultCreditsLimit = freePlan?.limits.credits || 30;
      const defaultImagesLimit = freePlan?.limits.images || 10;
      
      subscription = await prisma.subscription.create({
        data: {
          referenceId: userId,
          plan: PLAN_ENUM.FREE,
          stripeCustomerId: null,
          status: "active",
          creditsUsed: 0,
          creditsLimit: defaultCreditsLimit,
          imagesUsed: 0,
          imagesLimit: defaultImagesLimit,
          lastResetDate: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to create default subscription:", error);
      // If creation fails, return unlimited access for testing
      return {
        isAllowed: true,
        hasPaidSubscription: false,
        plan: PLAN_ENUM.FREE,
        generationsUsed: 0,
        generationsLimit: null,
        remainingGenerations: "Unlimited",
      };
    }
  }

  const plan = PLANS.find((p) => p.name === subscription.plan);
  if (!plan) {
    // Return unlimited if plan not found (for testing)
    return {
      isAllowed: true,
      hasPaidSubscription: false,
      plan: PLAN_ENUM.FREE,
      generationsUsed: 0,
      generationsLimit: null,
      remainingGenerations: "Unlimited",
    };
  }

  const periodStart = subscription.periodStart ?? new Date(0);
  const periodEnd = subscription.periodEnd ?? new Date();

  const generationCount = await prisma.message.count({
    where: {
      chat: { userId },
      role: "assistant",
      createdAt: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
  });

  const isAllowed =
    plan.limits.generations === Infinity ||
    generationCount < plan.limits.generations;

  const maxLimit = Math.max(0, plan.limits.generations - generationCount);

  const hasPaidSubscription = !!subscription.stripeSubscriptionId;

  return {
    isAllowed,
    hasPaidSubscription,
    plan: subscription.plan as PlanEnumType,
    generationsUsed: generationCount,
    generationsLimit:
      plan.limits.generations === Infinity ? null : plan.limits.generations,
    remainingGenerations:
      plan.limits.generations === Infinity ? "Unlimited" : maxLimit,
  };
}

export async function checkCreditLimitAction(userId: string) {
  return await checkCreditLimit(userId);
}

export async function deductCreditAction(
  userId: string,
  amount: number = 1
) {
  return await deductCredit(userId, amount);
}

export async function checkImageLimitAction(userId: string) {
  return await checkImageLimit(userId);
}

export async function deductImageAction(userId: string) {
  return await deductImage(userId);
}
