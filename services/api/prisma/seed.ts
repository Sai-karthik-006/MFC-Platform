import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Bakery', slug: 'bakery', displayOrder: 0 },
    { name: 'Sweets', slug: 'sweets', displayOrder: 1 },
    { name: 'Cakes', slug: 'cakes', displayOrder: 2 },
    { name: 'Biryani', slug: 'biryani', displayOrder: 3 },
    { name: 'Chinese', slug: 'chinese', displayOrder: 4 },
    { name: 'Pizza', slug: 'pizza', displayOrder: 5 },
    { name: 'Burgers', slug: 'burgers', displayOrder: 6 },
    { name: 'Sandwiches', slug: 'sandwiches', displayOrder: 7 },
    { name: 'Fried Chicken', slug: 'fried-chicken', displayOrder: 8 },
    { name: 'Beverages', slug: 'beverages', displayOrder: 9 },
    { name: 'Family Packs', slug: 'family-packs', displayOrder: 10 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
