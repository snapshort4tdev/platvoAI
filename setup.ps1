# PowerShell Setup Script for Platvo AI Agent SaaS
# This script helps set up the project on Windows

Write-Host "🚀 Platvo AI Agent SaaS - Setup Script" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is accessible (optional check)
Write-Host "`nChecking PostgreSQL connection..." -ForegroundColor Yellow
Write-Host "⚠️  Make sure PostgreSQL is installed and running" -ForegroundColor Yellow
Write-Host "   Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow

# Create .env.local from template if it doesn't exist
if (Test-Path ".env.local") {
    Write-Host "`n⚠️  .env.local already exists. Skipping creation." -ForegroundColor Yellow
    Write-Host "   If you want to recreate it, delete .env.local and run this script again." -ForegroundColor Yellow
} else {
    if (Test-Path "env.template") {
        Copy-Item "env.template" ".env.local"
        Write-Host "`n✅ Created .env.local from template" -ForegroundColor Green
        Write-Host "   ⚠️  IMPORTANT: Edit .env.local and update all the values!" -ForegroundColor Red
    } else {
        Write-Host "`n❌ env.template not found. Creating basic .env.local..." -ForegroundColor Red
        @"
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
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Host "✅ Created .env.local" -ForegroundColor Green
        Write-Host "   ⚠️  IMPORTANT: Edit .env.local and update all the values!" -ForegroundColor Red
    }
}

# Install dependencies
Write-Host "`nInstalling npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host "1. Edit .env.local and update all configuration values" -ForegroundColor White
Write-Host "2. Make sure PostgreSQL is running and create the database:" -ForegroundColor White
Write-Host "   psql -U postgres" -ForegroundColor Gray
Write-Host "   CREATE DATABASE Platvo_ai;" -ForegroundColor Gray
Write-Host "   \q" -ForegroundColor Gray
Write-Host "3. Run database migrations:" -ForegroundColor White
Write-Host "   npm run db:migrate" -ForegroundColor Gray
Write-Host "4. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "`nFor detailed instructions, see SETUP.md" -ForegroundColor Yellow
Write-Host "`n✅ Setup script completed!" -ForegroundColor Green

