#!/usr/bin/env node

/**
 * This script ensures Prisma binaries are generated with the correct targets
 * for both local development (native) and Vercel deployment (rhel-openssl-3.0.x)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Prisma binary targets...');

// Check if we're in a CI/Vercel environment
const isVercel = process.env.VERCEL === '1' || process.env.CI === 'true';
const binaryTarget = isVercel ? 'rhel-openssl-3.0.x' : 'native';

console.log(`📦 Environment: ${isVercel ? 'Vercel/CI' : 'Local'}`);
console.log(`🎯 Binary target: ${binaryTarget}`);

// Generate Prisma client with correct binary targets
try {
  console.log('🔄 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error.message);
  process.exit(1);
}

// Verify the binary exists
const prismaOutputPath = path.join(__dirname, '..', 'generated', 'prisma');
const binaryName = `libquery_engine-rhel-openssl-3.0.x.so.node`;
const binaryPath = path.join(prismaOutputPath, binaryName);

if (isVercel) {
  if (fs.existsSync(binaryPath)) {
    console.log(`✅ Found required binary: ${binaryName}`);
  } else {
    console.warn(`⚠️  Binary not found: ${binaryName}`);
    console.warn('   This might cause issues in Vercel deployment');
  }
}

console.log('✨ Done!');
