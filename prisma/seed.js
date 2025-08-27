const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        },
      }),
      prisma.category.upsert({
        where: { name: 'Clothing' },
        update: {},
        create: {
          name: 'Clothing',
          description: 'Fashion and apparel',
          imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
        },
      }),
      prisma.category.upsert({
        where: { name: 'Books' },
        update: {},
        create: {
          name: 'Books',
          description: 'Books and literature',
          imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        },
      }),
      prisma.category.upsert({
        where: { name: 'Home & Garden' },
        update: {},
        create: {
          name: 'Home & Garden',
          description: 'Home improvement and garden supplies',
          imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
        },
      }),
    ]);

    console.log('✅ Categories created');

    // Create products
    const products = await Promise.all([
      // Electronics
      prisma.product.upsert({
        where: { sku: 'LAPTOP001' },
        update: {},
        create: {
          name: 'MacBook Pro 14"',
          description: 'Apple MacBook Pro 14-inch with M2 Pro chip',
          price: 1999.99,
          sku: 'LAPTOP001',
          stock: 10,
          imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
          categoryId: categories[0].id,
        },
      }),
      prisma.product.upsert({
        where: { sku: 'PHONE001' },
        update: {},
        create: {
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone with titanium design',
          price: 999.99,
          sku: 'PHONE001',
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
          images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
          categoryId: categories[0].id,
        },
      }),
      prisma.product.upsert({
        where: { sku: 'HEADPHONES001' },
        update: {},
        create: {
          name: 'AirPods Pro',
          description: 'Wireless earbuds with active noise cancellation',
          price: 249.99,
          sku: 'HEADPHONES001',
          stock: 50,
          imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500',
          images: ['https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500'],
          categoryId: categories[0].id,
        },
      }),

      // Clothing
      prisma.product.upsert({
        where: { sku: 'SHIRT001' },
        update: {},
        create: {
          name: 'Classic White T-Shirt',
          description: 'Premium cotton white t-shirt',
          price: 29.99,
          sku: 'SHIRT001',
          stock: 100,
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
          categoryId: categories[1].id,
        },
      }),
      prisma.product.upsert({
        where: { sku: 'JEANS001' },
        update: {},
        create: {
          name: 'Blue Denim Jeans',
          description: 'Classic blue jeans, regular fit',
          price: 79.99,
          sku: 'JEANS001',
          stock: 75,
          imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
          images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
          categoryId: categories[1].id,
        },
      }),

      // Books
      prisma.product.upsert({
        where: { sku: 'BOOK001' },
        update: {},
        create: {
          name: 'The Great Gatsby',
          description: 'Classic American novel by F. Scott Fitzgerald',
          price: 12.99,
          sku: 'BOOK001',
          stock: 200,
          imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
          images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
          categoryId: categories[2].id,
        },
      }),
      prisma.product.upsert({
        where: { sku: 'BOOK002' },
        update: {},
        create: {
          name: 'To Kill a Mockingbird',
          description: 'Timeless novel by Harper Lee',
          price: 14.99,
          sku: 'BOOK002',
          stock: 150,
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
          categoryId: categories[2].id,
        },
      }),

      // Home & Garden
      prisma.product.upsert({
        where: { sku: 'PLANT001' },
        update: {},
        create: {
          name: 'Monstera Deliciosa',
          description: 'Beautiful indoor plant with split leaves',
          price: 45.99,
          sku: 'PLANT001',
          stock: 30,
          imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500',
          images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=500'],
          categoryId: categories[3].id,
        },
      }),
    ]);

    console.log('✅ Products created');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        phone: '+1234567890',
        address: '123 Admin Street',
        city: 'New York',
        country: 'USA',
        zipCode: '10001',
      },
    });

    // Create admin's cart
    await prisma.cart.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: { userId: adminUser.id },
    });

    // Create test user
    const testUserPassword = await bcrypt.hash('test123', 10);
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        password: testUserPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        phone: '+1987654321',
        address: '456 Test Avenue',
        city: 'Los Angeles',
        country: 'USA',
        zipCode: '90210',
      },
    });

    // Create test user's cart
    await prisma.cart.upsert({
      where: { userId: testUser.id },
      update: {},
      create: { userId: testUser.id },
    });

    console.log('✅ Users created');
    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📧 Test credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  test@example.com / test123');
    console.log('');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
