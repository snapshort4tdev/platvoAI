# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js (v18+) installed
- [ ] PostgreSQL installed and running
- [ ] API keys ready (Google AI, Tavily)

## Quick Setup (Windows)

1. **Run the setup script:**

   ```powershell
   .\setup.ps1
   ```

2. **Edit `.env.local`** with your values

3. **Create database:**

   ```powershell
   psql -U postgres
   CREATE DATABASE Platvo_ai;
   \q
   ```

4. **Run migrations:**

   ```powershell
   npm run db:migrate
   ```

5. **Start the app:**
   ```powershell
   npm run dev
   ```

Visit: http://localhost:3000

## Quick Setup (Mac/Linux)

1. **Run the setup script:**

   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Edit `.env.local`** with your values

3. **Create database:**

   ```bash
   psql -U postgres
   CREATE DATABASE Platvo_ai;
   \q
   ```

4. **Run migrations:**

   ```bash
   npm run db:migrate
   ```

5. **Start the app:**
   ```bash
   npm run dev
   ```

Visit: http://localhost:3000

## Minimum Required Environment Variables

For basic functionality, you need these in `.env.local`:

```env
# Database (update with your PostgreSQL credentials)
DATABASE_URL="postgresql://user:password@localhost:5432/Platvo_ai?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/Platvo_ai?schema=public"

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Auth (generate a random 32+ character string)
BETTER_AUTH_SECRET="your-random-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# AI (get from OpenRouter - provides access to 100+ models)
OPENROUTER_API_KEY="your-openrouter-api-key"

# Web Search (get from Tavily)
TAVILY_API_KEY="your-tavily-api-key"
```

**Stripe keys are optional** - only needed for subscription features.

## Getting API Keys

### OpenRouter API Key (Required)

1. Visit: https://openrouter.ai/keys
2. Sign up or log in
3. Create a new API key
4. Copy the key to `.env.local`
5. OpenRouter provides access to 100+ AI models (Claude, GPT-4, Gemini, Grok, etc.)

### Tavily API Key (Required)

1. Visit: https://tavily.com/
2. Sign up for free account
3. Get your API key from dashboard
4. Copy to `.env.local`

### Stripe Keys (Optional)

1. Visit: https://dashboard.stripe.com/test/apikeys
2. Get test keys for development
3. Create test products and get Price IDs
4. Add to `.env.local`

## Troubleshooting

**Port 3000 in use?**

- Change `NEXT_PUBLIC_APP_URL` in `.env.local` to use a different port

**Database connection failed?**

- Make sure PostgreSQL is running
- Check your credentials in `.env.local`
- Verify database `Platvo_ai` exists

**Missing dependencies?**

```bash
npm install
```

**Prisma errors?**

```bash
npx prisma generate
npm run db:migrate
```

For detailed setup instructions, see [SETUP.md](SETUP.md)
