import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedIfEmpty() {
  const count = await prisma.product.count();
  if (count === 0) {
    const { main } = await import('../../prisma/seed');
    await main();
  }
}

seedIfEmpty().finally(() => prisma.$disconnect());
