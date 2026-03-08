# Stripe Live Account Setup Guide

This guide will help you connect your live Stripe account to the Platvo application.

## Prerequisites

- A Stripe account (sign up at https://stripe.com if you don't have one)
- Access to your Stripe Dashboard
- Your production domain URL (e.g., https://yourdomain.com)

## Step 1: Get Your Live Stripe API Keys

1. **Log in to Stripe Dashboard**: https://dashboard.stripe.com
2. **Switch to Live Mode**: Click the toggle in the top right to switch from "Test mode" to "Live mode"
3. **Get Your API Keys**:
   - Go to **Developers** → **API keys**
   - Copy your **Publishable key** (starts with `pk_live_...`)
   - Copy your **Secret key** (starts with `sk_live_...`)
   - ⚠️ **Keep these keys secure! Never commit them to version control.**

## Step 2: Set Up Environment Variables

Add your live Stripe keys to your production environment variables:

### For Vercel:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```env
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### For Other Hosting:
Add these to your production `.env` file (never commit this file):

```env
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 3: Create Product and Price in Stripe Dashboard

The application will automatically create the product and price if they don't exist, but you can also create them manually:

### Option A: Manual Creation (Recommended for Production)

1. **Create Product**:
   - Go to **Products** → **Add product**
   - Name: `PRO Plan`
   - Description: `3,500 AI Credits/month, 120 AI Images/month, Full access to all Platvo tools, latest AI model versions, AI Advanced Search, Unlimited Notes, Community access, Priority Support`
   - Click **Save product**

2. **Create Price**:
   - On the product page, click **Add price**
   - Pricing model: **Recurring**
   - Price: `$14.99 USD`
   - Billing period: **Monthly**
   - Click **Add price**
   - Copy the **Price ID** (starts with `price_...`)

### Option B: Automatic Creation

The application will automatically create the product and price when the first checkout session is created. The system will:
- Create a product named "PRO Plan"
- Create a monthly recurring price of $14.99 USD
- Use the correct metadata (3500 credits, 120 images)

## Step 4: Set Up Webhooks

Webhooks are essential for subscription management. They notify your application when subscription events occur.

1. **Go to Webhooks**: **Developers** → **Webhooks**
2. **Add Endpoint**:
   - Click **Add endpoint**
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Description: `Platvo Subscription Webhooks`
   - Click **Add endpoint**

3. **Select Events to Listen To**:
   Select these events:
   - `checkout.session.completed` - When a user completes checkout
   - `customer.subscription.created` - When a subscription is created
   - `customer.subscription.updated` - When a subscription is updated
   - `customer.subscription.deleted` - When a subscription is canceled
   - `invoice.payment_succeeded` - When payment succeeds
   - `invoice.payment_failed` - When payment fails

4. **Get Webhook Secret**:
   - After creating the endpoint, click on it
   - Click **Reveal** next to "Signing secret"
   - Copy the webhook secret (starts with `whsec_...`)
   - Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 5: Verify Configuration

1. **Check Environment Variables**: Ensure all Stripe keys are set in production
2. **Test Webhook Endpoint**: 
   - In Stripe Dashboard, go to your webhook endpoint
   - Click **Send test webhook**
   - Select an event type (e.g., `checkout.session.completed`)
   - Check your application logs to ensure the webhook is received

3. **Test Checkout Flow**:
   - Try creating a test subscription from your application
   - Verify that:
     - Checkout session is created successfully
     - After payment, subscription is created in your database
     - User receives 3,500 credits and 120 images
     - Webhook events are being processed

## Step 6: Important Notes

### Security
- ✅ Never commit Stripe keys to version control
- ✅ Use environment variables for all sensitive data
- ✅ Keep your webhook secret secure
- ✅ Use HTTPS for all webhook endpoints

### Testing
- Before going live, test thoroughly with Stripe test mode
- Use Stripe's test cards: https://stripe.com/docs/testing
- Test webhook delivery in test mode first

### Monitoring
- Monitor webhook delivery in Stripe Dashboard
- Check application logs for webhook processing errors
- Set up alerts for failed payments

## Troubleshooting

### Webhook Not Receiving Events
- Verify the webhook URL is correct and accessible
- Check that the webhook secret matches in both Stripe and your environment
- Ensure your server is running and accessible from the internet
- Check firewall/security settings

### Subscription Not Created After Payment
- Check webhook logs in Stripe Dashboard
- Verify webhook events are being sent
- Check application logs for errors
- Ensure database connection is working

### Wrong Credit/Image Limits
- Verify the product metadata in Stripe matches the code (3500 credits, 120 images)
- Check that `lib/stripe/subscription-manager.ts` is using the correct limits
- Ensure webhooks are processing correctly

## Support

If you encounter issues:
1. Check Stripe Dashboard → **Developers** → **Logs** for API errors
2. Check your application logs for webhook processing errors
3. Review Stripe documentation: https://stripe.com/docs

## Current Configuration

- **Plan Name**: PRO Plan
- **Price**: $14.99 USD/month
- **Credits**: 3,500 AI Credits/month
- **Images**: 120 AI Images/month
- **Currency**: USD
- **Billing**: Monthly recurring

---

**Ready to go live?** Make sure you've completed all steps above and tested thoroughly before processing real payments!
