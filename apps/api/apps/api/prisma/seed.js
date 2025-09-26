import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, 64);
  return salt + ':' + hash.toString('hex');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPasswordHash = await hashPassword('Admin!234');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweet.shop' },
    update: {},
    create: {
      email: 'admin@sweet.shop',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('👤 Admin user created:', admin.email);

  // Create sample sweets
  const sweets = [
    {
      name: 'Chocolate Truffles',
      category: 'Chocolates',
      price: 12.99,
      quantity: 50,
    },
    {
      name: 'Vanilla Cupcakes',
      category: 'Cakes',
      price: 8.50,
      quantity: 25,
    },
    {
      name: 'Strawberry Macarons',
      category: 'Macarons',
      price: 15.75,
      quantity: 30,
    },
    {
      name: 'Lemon Tarts',
      category: 'Tarts',
      price: 9.25,
      quantity: 20,
    },
    {
      name: 'Caramel Fudge',
      category: 'Fudge',
      price: 11.00,
      quantity: 40,
    },
    {
      name: 'Raspberry Cheesecake',
      category: 'Cakes',
      price: 18.50,
      quantity: 15,
    },
    {
      name: 'Pistachio Cookies',
      category: 'Cookies',
      price: 6.75,
      quantity: 60,
    },
    {
      name: 'Tiramisu',
      category: 'Desserts',
      price: 14.25,
      quantity: 12,
    },
  ];

  for (const sweet of sweets) {
    await prisma.sweet.upsert({
      where: { name: sweet.name },
      update: {},
      create: sweet,
    });
  }

  console.log(`🍰 Created ${sweets.length} sample sweets`);

  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
