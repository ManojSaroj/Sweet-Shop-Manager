#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting database migration and seeding...');

try {
  // Change to the API directory
  process.chdir(path.join(__dirname, '..'));

  console.log('📦 Generating Prisma client...');
  execSync('pnpm prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });

  console.log('🗄️ Running database migrations...');
  execSync('pnpm prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });

  console.log('🌱 Seeding database...');
  execSync('pnpm prisma seed --schema=./prisma/schema.prisma', { stdio: 'inherit' });

  console.log('✅ Database migration and seeding completed successfully!');
} catch (error) {
  console.error('❌ Error during migration:', error.message);
  process.exit(1);
}
