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

  const categoryMap: Record<string, string> = {};
  for (const c of categories) {
    const fetched = await prisma.category.findUnique({
      where: { slug: c.slug },
      select: { id: true },
    });
    if (fetched) {
      categoryMap[c.slug] = fetched.id;
    }
  }

  const products = [
    { name: 'Veg Puff', slug: 'veg-puff', categorySlug: 'bakery', description: 'Crispy pastry filled with spiced vegetables', isVeg: true, isFeatured: true },
    { name: 'Egg Puff', slug: 'egg-puff', categorySlug: 'bakery', description: 'Flaky pastry stuffed with egg masala', isVeg: false, isFeatured: false },
    { name: 'Chicken Puff', slug: 'chicken-puff', categorySlug: 'bakery', description: 'Golden puff with flavorful chicken filling', isVeg: false, isFeatured: true },
    { name: 'Garlic Bread', slug: 'garlic-bread', categorySlug: 'bakery', description: 'Buttery garlic toast with herbs', isVeg: true, isFeatured: false },
    { name: 'Kaju Katli', slug: 'kaju-katli', categorySlug: 'sweets', description: 'Diamond-shaped cashew fudge', isVeg: true, isFeatured: true },
    { name: 'Gulab Jamun', slug: 'gulab-jamun', categorySlug: 'sweets', description: 'Soft milk-solid balls in sugar syrup', isVeg: true, isFeatured: true },
    { name: 'Rasgulla', slug: 'rasgulla', categorySlug: 'sweets', description: 'Spongy cottage cheese balls in light syrup', isVeg: true, isFeatured: false },
    { name: 'Chocolate Cake', slug: 'chocolate-cake', categorySlug: 'cakes', description: 'Rich layered chocolate cake with ganache', isVeg: true, isFeatured: true },
    { name: 'Black Forest Cake', slug: 'black-forest-cake', categorySlug: 'cakes', description: 'Classic chocolate cake with cherries and cream', isVeg: true, isFeatured: true },
    { name: 'Red Velvet Cake', slug: 'red-velvet-cake', categorySlug: 'cakes', description: 'Velvety red sponge with cream cheese frosting', isVeg: true, isFeatured: false },
    { name: 'Chicken Biryani', slug: 'chicken-biryani', categorySlug: 'biryani', description: 'Aromatic basmati rice layered with tender chicken', isVeg: false, isFeatured: true },
    { name: 'Mutton Biryani', slug: 'mutton-biryani', categorySlug: 'biryani', description: 'Slow-cooked mutton with fragrant spices and rice', isVeg: false, isFeatured: true },
    { name: 'Veg Biryani', slug: 'veg-biryani', categorySlug: 'biryani', description: 'Mixed vegetables and basmati rice with spices', isVeg: true, isFeatured: false },
    { name: 'Fried Rice', slug: 'fried-rice', categorySlug: 'chinese', description: 'Stir-fried rice with vegetables and soy sauce', isVeg: true, isFeatured: false },
    { name: 'Noodles', slug: 'noodles', categorySlug: 'chinese', description: 'Wok-tossed noodles with veggies', isVeg: true, isFeatured: false },
    { name: 'Manchurian', slug: 'manchurian', categorySlug: 'chinese', description: 'Crispy vegetable balls in tangy sauce', isVeg: true, isFeatured: true },
    { name: 'Margherita Pizza', slug: 'margherita-pizza', categorySlug: 'pizza', description: 'Classic cheese and tomato pizza with basil', isVeg: true, isFeatured: true },
    { name: 'Farmhouse Pizza', slug: 'farmhouse-pizza', categorySlug: 'pizza', description: 'Loaded with farm-fresh vegetables and cheese', isVeg: true, isFeatured: false },
    { name: 'Veg Burger', slug: 'veg-burger', categorySlug: 'burgers', description: 'Crispy patty with lettuce, tomato and mayo', isVeg: true, isFeatured: false },
    { name: 'Chicken Burger', slug: 'chicken-burger', categorySlug: 'burgers', description: 'Juicy grilled chicken patty with cheese', isVeg: false, isFeatured: true },
    { name: 'Veg Sandwich', slug: 'veg-sandwich', categorySlug: 'sandwiches', description: 'Mixed vegetable sandwich with chutney', isVeg: true, isFeatured: false },
    { name: 'Grilled Sandwich', slug: 'grilled-sandwich', categorySlug: 'sandwiches', description: 'Toasted sandwich with molten cheese and veggies', isVeg: true, isFeatured: false },
    { name: 'Chicken Wings', slug: 'chicken-wings', categorySlug: 'fried-chicken', description: 'Spicy crispy fried chicken wings', isVeg: false, isFeatured: true },
    { name: 'Chicken Popcorn', slug: 'chicken-popcorn', categorySlug: 'fried-chicken', description: 'Bite-sized crunchy chicken pieces', isVeg: false, isFeatured: false },
    { name: 'Coke', slug: 'coke', categorySlug: 'beverages', description: 'Chilled classic cola drink', isVeg: true, isFeatured: false },
    { name: 'Sprite', slug: 'sprite', categorySlug: 'beverages', description: 'Refreshing lemon-lime soda', isVeg: true, isFeatured: false },
    { name: 'Mango Juice', slug: 'mango-juice', categorySlug: 'beverages', description: 'Fresh Alphonso mango juice', isVeg: true, isFeatured: false },
    { name: 'Family Chicken Biryani', slug: 'family-chicken-biryani', categorySlug: 'family-packs', description: 'Large portion chicken biryani for the whole family', isVeg: false, isFeatured: true },
    { name: 'Family Veg Combo', slug: 'family-veg-combo', categorySlug: 'family-packs', description: 'Complete veg meal combo for a family of 4', isVeg: true, isFeatured: false },
  ];

  for (const product of products) {
    const categoryId = categoryMap[product.categorySlug];
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        categoryId,
        description: product.description,
        thumbnailImage: `https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`,
        isVeg: product.isVeg,
        isFeatured: product.isFeatured,
        isAvailable: true,
      },
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
