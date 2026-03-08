# 🚀 Local Setup Guide for Platvo AI Agent SaaS

This guide will help you set up and run the Platvo AI Agent SaaS application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download PostgreSQL](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (to clone the repository if needed)

## Step 1: Install Dependencies

Install all required npm packages:

```bash
npm install
```

## Step 2: Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not already installed)

2. **Create a new database**:

   ```bash
   # On macOS/Linux
   psql -U postgres
   CREATE DATABASE Platvo_ai;
   \q

   # On Windows (using pgAdmin or Command Prompt)
   psql -U postgres
   CREATE DATABASE Platvo_ai;
   \q
   ```

3. **Note your database credentials** (username, password, host, port)

## Step 3: Configure Environment Variables

1. **Copy the example environment file**:

   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** and update the following:

   ### Database Configuration

   ```env
   DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/Platvo_ai?schema=public"
   DIRECT_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/Platvo_ai?schema=public"
   ```

   Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

   ### Better Auth Secret

   Generate a secure secret key (minimum 32 characters):

   ```bash
   # On macOS/Linux
   openssl rand -base64 32

   # On Windows (PowerShell)
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   ```

   Then update:

   ```env
   BETTER_AUTH_SECRET="your-generated-secret-key-here"
   ```

   ### API Keys (Required)

   - **OpenRouter API Key** (for AI models):

     - Visit: https://openrouter.ai/keys
     - Sign up or log in to your account
     - Create a new API key
     - Add to `.env.local`:
       ```env
       OPENROUTER_API_KEY="your-openrouter-api-key"
       ```
     - OpenRouter provides access to 100+ AI models through a single API key

   - **Tavily API Key** (for web search):
     - Visit: https://tavily.com/
     - Sign up and get your API key
     - Add to `.env.local`:
       ```env
       TAVILY_API_KEY="your-tavily-api-key"
       ```

   ### Stripe Configuration (Optional for local development)

   For subscription features to work, you'll need Stripe test keys:

   - Visit: https://dashboard.stripe.com/test/apikeys
   - Get your test keys and webhook secret
   - Create test products/plans and get their Price IDs
   - Add to `.env.local`:
     ```env
     STRIPE_SECRET_KEY="sk_test_..."
     STRIPE_WEBHOOK_SECRET="whsec_..."
     STRIPE_PLUS_PLAN_ID="price_..."
     STRIPE_PREMIUM_PLAN_ID="price_..."
     ```

   **Note**: You can skip Stripe setup if you only want to test non-subscription features. However, some features may not work without it.

## Step 4: Set Up Database Schema

Run Prisma migrations to create the database tables:

```bash
npm run db:migrate
```

This will:

- Create all necessary database tables
- Set up the schema based on `prisma/schema.prisma`

## Step 5: Generate Prisma Client

Generate the Prisma client (usually runs automatically after install, but run if needed):

```bash
npx prisma generate
```

## Step 6: Start the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Step 7: Verify Installation

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Sign up** for a new account (or sign in if you already have one)
3. **Test the application** features

## Optional: Database Management

### View Database with Prisma Studio

To view and manage your database through a GUI:

```bash
npm run db:studio
```

This will open Prisma Studio at `http://localhost:5555`

### Reset Database (if needed)

If you need to reset your database:

```bash
npx prisma migrate reset
```

**Warning**: This will delete all data in your database!

## Troubleshooting

### Database Connection Issues

- Make sure PostgreSQL is running
- Verify your database credentials in `.env.local`
- Check that the database `Platvo_ai` exists
- Ensure PostgreSQL is listening on the correct port (default: 5432)

### Port Already in Use

If port 3000 is already in use:

1. Find the process using port 3000:

   ```bash
   # On macOS/Linux
   lsof -i :3000

   # On Windows
   netstat -ano | findstr :3000
   ```

2. Kill the process or change the port in your `.env.local`:
   ```env
   NEXT_PUBLIC_APP_URL="http://localhost:3001"
   ```

### Missing Environment Variables

Make sure all required environment variables are set in `.env.local`. The application will fail to start if required variables are missing.

### Prisma Client Errors

If you see Prisma client errors:

```bash
npx prisma generate
npm run db:migrate
```

### Build Errors

Clear the build cache and rebuild:

```bash
rm -rf .next
npm run build
```

## Environment Variables Summary

| Variable                 | Required    | Description                                   |
| ------------------------ | ----------- | --------------------------------------------- |
| `DATABASE_URL`           | ✅ Yes      | PostgreSQL connection string                  |
| `DIRECT_URL`             | ✅ Yes      | PostgreSQL direct connection (for migrations) |
| `NODE_ENV`               | ✅ Yes      | Environment (development/production)          |
| `NEXT_PUBLIC_APP_URL`    | ✅ Yes      | Application URL                               |
| `BETTER_AUTH_SECRET`     | ✅ Yes      | Secret key for Better Auth                    |
| `BETTER_AUTH_URL`        | ✅ Yes      | Base URL for Better Auth                      |
| `OPENROUTER_API_KEY`     | ✅ Yes      | OpenRouter API key (for all AI models)        |
| `TAVILY_API_KEY`         | ✅ Yes      | Tavily API key for web search                 |
| `STRIPE_SECRET_KEY`      | ⚠️ Optional | Stripe secret key (needed for subscriptions)  |
| `STRIPE_WEBHOOK_SECRET`  | ⚠️ Optional | Stripe webhook secret                         |
| `STRIPE_PLUS_PLAN_ID`    | ⚠️ Optional | Stripe Plus plan price ID                     |
| `STRIPE_PREMIUM_PLAN_ID` | ⚠️ Optional | Stripe Premium plan price ID                  |

## Need Help?

- Check the [README.md](README.md) for project overview
- Review the [Better Auth documentation](https://www.better-auth.com/)
- Check [Next.js documentation](https://nextjs.org/docs)
- Review [Prisma documentation](https://www.prisma.io/docs)

## Next Steps

Once your application is running:

1. Create a user account
2. Explore the features
3. Test the AI agent functionality
4. Test note creation and management
5. Test chat functionality

Happy coding! 🎉
