import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { Pool } from 'pg';

import { PrismaClient, UserRole, UserStatus } from '../src/generated/prisma/client';

const adapter = new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL }));
const prisma = new PrismaClient({ adapter });

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

const products = [
  {
    name: 'Kemeja Oxford Polos',
    description: 'Kemeja pria bahan oxford premium',
    price: 149000,
    stock: 50,
  },
  {
    name: 'Celana Chino Slim Fit',
    description: 'Celana chino pria slim fit',
    price: 189000,
    stock: 40,
  },
  {
    name: 'Sepatu Sneakers Putih',
    description: 'Sneakers kasual warna putih',
    price: 350000,
    stock: 30,
  },
  {
    name: 'Jaket Denim Vintage',
    description: 'Jaket denim model vintage',
    price: 425000,
    stock: 25,
  },
  {
    name: 'Tas Ransel Urban',
    description: 'Tas ransel waterproof kapasitas 25L',
    price: 275000,
    stock: 35,
  },
  {
    name: 'Jam Tangan Analog',
    description: 'Jam tangan analog kulit',
    price: 520000,
    stock: 20,
  },
  {
    name: 'Kacamata Hitam Polarized',
    description: 'Kacamata hitam UV400',
    price: 95000,
    stock: 60,
  },
  {
    name: 'Topi Baseball Classic',
    description: 'Topi baseball bahan cotton twill',
    price: 85000,
    stock: 80,
  },
  {
    name: 'Hoodie Cotton Fleece',
    description: 'Hoodie unisex cotton fleece',
    price: 210000,
    stock: 45,
  },
  {
    name: 'Sandal Kulit',
    description: 'Sandal kulit pria',
    price: 165000,
    stock: 55,
  },
] as const;

async function main() {
  const adminPassword = await bcrypt.hash('admin123', BCRYPT_SALT_ROUNDS);
  const userPassword = await bcrypt.hash('user123', BCRYPT_SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'admin@solutech.dev' },
    update: {},
    create: {
      email: 'admin@solutech.dev',
      passwordHash: adminPassword,
      name: 'Administrator',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@solutech.dev' },
    update: {},
    create: {
      email: 'user@solutech.dev',
      passwordHash: userPassword,
      name: 'Regular User',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  });

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          description: product.description,
          price: product.price,
          stock: product.stock,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
        },
      });
    }
  }

  console.log('Seed completed: 2 users, 10 products');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
