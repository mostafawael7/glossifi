/**
 * Script to seed the database with sample products
 * Run with: npx tsx scripts/seed-products.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Classic White Ceramic Mug',
    description: 'A timeless white ceramic mug perfect for your morning coffee. Features a comfortable handle and holds 12oz of your favorite beverage.',
    price: '14.99',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
    stock: 50,
    category: 'Classic',
    featured: true,
  },
  {
    name: 'Premium Black Matte Mug',
    description: 'Sleek black matte finish with a modern design. This premium mug is perfect for coffee enthusiasts who appreciate minimalist style.',
    price: '19.99',
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
    stock: 35,
    category: 'Premium',
    featured: true,
  },
  {
    name: 'Colorful Gradient Mug',
    description: 'Bright and cheerful gradient design that brings color to your day. Made from high-quality ceramic with a smooth finish.',
    price: '16.99',
    imageUrl: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
    stock: 42,
    category: 'Design',
    featured: false,
  },
  {
    name: 'Double-Walled Glass Mug',
    description: 'Elegant double-walled glass mug that keeps your drinks at the perfect temperature. See-through design showcases your beverage beautifully.',
    price: '24.99',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    stock: 28,
    category: 'Premium',
    featured: true,
  },
  {
    name: 'Rustic Stoneware Mug',
    description: 'Handcrafted stoneware mug with a rustic, earthy feel. Perfect for those who love artisanal, handcrafted items.',
    price: '18.99',
    imageUrl: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
    stock: 30,
    category: 'Artisan',
    featured: false,
  },
  {
    name: 'Minimalist White & Gold Mug',
    description: 'Sophisticated white ceramic mug with elegant gold accents. A perfect blend of simplicity and luxury for your daily routine.',
    price: '22.99',
    imageUrl: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
    stock: 25,
    category: 'Luxury',
    featured: true,
  },
  {
    name: 'Travel-Ready Insulated Mug',
    description: 'Keep your drinks hot or cold for hours with this insulated travel mug. Features a leak-proof lid and ergonomic design.',
    price: '29.99',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    stock: 40,
    category: 'Travel',
    featured: false,
  },
  {
    name: 'Vintage Floral Pattern Mug',
    description: 'Charming vintage-inspired floral pattern on a classic ceramic mug. Adds a touch of nostalgia to your coffee break.',
    price: '17.99',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
    stock: 38,
    category: 'Vintage',
    featured: false,
  },
  {
    name: 'Bamboo Fiber Eco-Friendly Mug',
    description: 'Sustainable bamboo fiber mug that\'s both eco-friendly and stylish. Lightweight yet durable, perfect for the environmentally conscious.',
    price: '21.99',
    imageUrl: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
    stock: 33,
    category: 'Eco-Friendly',
    featured: false,
  },
  {
    name: 'Oversized Comfort Mug',
    description: 'Extra-large 16oz mug for those who like big servings. Comfortable handle and wide base make it perfect for long reading sessions.',
    price: '19.99',
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
    stock: 45,
    category: 'Comfort',
    featured: false,
  },
]

async function seedProducts() {
  try {
    console.log('🌱 Seeding products...\n')

    // Clear existing products (optional - comment out if you want to keep existing)
    // await prisma.product.deleteMany()
    // console.log('Cleared existing products\n')

    for (const product of products) {
      const created = await prisma.product.create({
        data: product,
      })
      console.log(`✅ Created: ${created.name} - $${created.price}`)
    }

    console.log(`\n✨ Successfully seeded ${products.length} products!`)
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedProducts()

