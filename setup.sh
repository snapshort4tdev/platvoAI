#!/bin/bash
# Setup Script for Platvo AI Agent SaaS
# This script helps set up the project on macOS/Linux

echo "🚀 Platvo AI Agent SaaS - Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if PostgreSQL is accessible (optional check)
echo ""
echo "Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
    echo "⚠️  Make sure PostgreSQL is running"
else
    echo "⚠️  PostgreSQL command not found. Make sure PostgreSQL is installed."
    echo "   Install: brew install postgresql (macOS) or apt-get install postgresql (Linux)"
fi

# Create .env.local from template if it doesn't exist
if [ -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local already exists. Skipping creation."
    echo "   If you want to recreate it, delete .env.local and run this script again."
else
    if [ -f "env.template" ]; then
        cp env.template .env.local
        echo ""
        echo "✅ Created .env.local from template"
        echo "   ⚠️  IMPORTANT: Edit .env.local and update all the values!"
    else
        echo ""
        echo "❌ env.template not found. Creating basic .env.local..."
        cat > .env.local << 'EOF'
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/Platvo_ai?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/Platvo_ai?schema=public"

# App Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Better Auth Configuration
BETTER_AUTH_SECRET="change-this-to-a-random-secret-key-minimum-32-characters-long"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PLUS_PLAN_ID="price_..."
STRIPE_PREMIUM_PLAN_ID="price_..."

# Tavily API Key
TAVILY_API_KEY="your_tavily_api_key_here"

# OpenRouter API Key (for AI models - provides access to 100+ models)
OPENROUTER_API_KEY="your_openrouter_api_key_here"
EOF
        echo "✅ Created .env.local"
        echo "   ⚠️  IMPORTANT: Edit .env.local and update all the values!"
    fi
fi

# Install dependencies
echo ""
echo "Installing npm dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Edit .env.local and update all configuration values"
echo "2. Make sure PostgreSQL is running and create the database:"
echo "   psql -U postgres"
echo "   CREATE DATABASE Platvo_ai;"
echo "   \\q"
echo "3. Run database migrations:"
echo "   npm run db:migrate"
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
echo "✅ Setup script completed!"

