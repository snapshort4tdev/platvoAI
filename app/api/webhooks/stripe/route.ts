import { NextRequest, NextResponse } from "next/server";
import { stripeClient } from "@/lib/stripe";
import { handleStripeWebhook } from "@/lib/stripe/webhooks";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  if (!stripeClient) {
    console.error("Stripe client not initialized");
    return NextResponse.json(
      { error: "Stripe client not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    const error = err as Error;
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    console.log("Processing Stripe webhook event:", {
      type: event.type,
      id: event.id,
    });
    await handleStripeWebhook(event);
    console.log("Webhook processed successfully:", event.type);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    console.error("Event details:", {
      type: event.type,
      id: event.id,
      error: error instanceof Error ? error.stack : String(error),
    });
    return NextResponse.json(
      {
        error: "Webhook handler failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
