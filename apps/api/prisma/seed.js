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

  // Create sample sweets with Indian prices (in rupees)
  const sweets = [
    {
      name: 'Chocolate Truffles',
      category: 'Chocolate',
      price: 299,
      quantity: 50,
    },
    {
      name: 'Gulab Jamun',
      category: 'Indian Sweets',
      price: 150,
      quantity: 30,
    },
    {
      name: 'Rasgulla',
      category: 'Indian Sweets',
      price: 120,
      quantity: 40,
    },
    {
      name: 'Kaju Katli',
      category: 'Indian Sweets',
      price: 450,
      quantity: 25,
    },
    {
      name: 'Ladoo',
      category: 'Indian Sweets',
      price: 80,
      quantity: 60,
    },
    {
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 50,
      quantity: 100,
    },
    {
      name: 'Gummy Bears',
      category: 'Gummy',
      price: 35,
      quantity: 150,
    },
    {
      name: 'Lollipop',
      category: 'Hard Candy',
      price: 20,
      quantity: 200,
    },
    {
      name: 'Caramel Chews',
      category: 'Caramel',
      price: 75,
      quantity: 80,
    },
    {
      name: 'Cupcake',
      category: 'Cake',
      price: 120,
      quantity: 25,
    },
    {
      name: 'Donut',
      category: 'Cake',
      price: 60,
      quantity: 40,
    },
    {
      name: 'Cookie',
      category: 'Cookie',
      price: 25,
      quantity: 100,
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
