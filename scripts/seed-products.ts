/**
 * Script to seed the database with sample products
 * Run with: npm run seed:products
 */

import { PrismaClient, MugType } from '@prisma/client'

const prisma = new PrismaClient()

interface ProductSeedData {
  name: string
  description: string
  price: string
  imageUrl: string
  stock: number
  category: MugType
  featured: boolean
  images?: Array<{
    url: string
    alt?: string
    order: number
  }>
}

const products: ProductSeedData[] = [
  {
    name: 'Classic White Porcelain Mug',
    description: 'A timeless white porcelain mug perfect for your morning coffee. Features a comfortable handle and holds 12oz of your favorite beverage.',
    price: '14.99',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
    stock: 50,
    category: MugType.PORCELAIN,
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
        alt: 'Classic White Porcelain Mug - Front view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Classic White Porcelain Mug - Side view',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
        alt: 'Classic White Porcelain Mug - Top view',
        order: 2,
      },
    ],
  },
  {
    name: 'Premium Thermal Travel Mug',
    description: 'Keep your drinks hot or cold for hours with this insulated thermal travel mug. Features a leak-proof lid and ergonomic design. Perfect for on-the-go coffee lovers.',
    price: '29.99',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    stock: 40,
    category: MugType.THERMAL,
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        alt: 'Premium Thermal Travel Mug - Main view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Premium Thermal Travel Mug - With lid',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
        alt: 'Premium Thermal Travel Mug - Detail',
        order: 2,
      },
    ],
  },
  {
    name: 'Elegant Porcelain Coffee Mug',
    description: 'Sleek and elegant porcelain mug with a modern design. This premium mug is perfect for coffee enthusiasts who appreciate minimalist style and quality craftsmanship.',
    price: '19.99',
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
    stock: 35,
    category: MugType.PORCELAIN,
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Elegant Porcelain Coffee Mug - Front',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
        alt: 'Elegant Porcelain Coffee Mug - Side',
        order: 1,
      },
    ],
  },
  {
    name: 'Iced Coffee Glass Mug',
    description: 'Perfect for your iced coffee and cold beverages. This stylish glass mug showcases your drink beautifully while keeping it refreshingly cold.',
    price: '16.99',
    imageUrl: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
    stock: 42,
    category: MugType.ICED_COFFEE,
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
        alt: 'Iced Coffee Glass Mug - Empty',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        alt: 'Iced Coffee Glass Mug - With drink',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
        alt: 'Iced Coffee Glass Mug - Detail',
        order: 2,
      },
    ],
  },
  {
    name: 'Double-Walled Thermal Mug',
    description: 'Elegant double-walled thermal mug that keeps your drinks at the perfect temperature. The insulated design ensures your coffee stays hot longer.',
    price: '24.99',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    stock: 28,
    category: MugType.THERMAL,
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        alt: 'Double-Walled Thermal Mug',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Double-Walled Thermal Mug - Side view',
        order: 1,
      },
    ],
  },
  {
    name: 'Artisan Mazzotte Ceramic Mug',
    description: 'Handcrafted mazzotte ceramic mug with a unique, rustic feel. Perfect for those who love artisanal, handcrafted items with character.',
    price: '18.99',
    imageUrl: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
    stock: 30,
    category: MugType.MAZZOTTE,
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
        alt: 'Artisan Mazzotte Ceramic Mug - Front',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
        alt: 'Artisan Mazzotte Ceramic Mug - Texture detail',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Artisan Mazzotte Ceramic Mug - Side',
        order: 2,
      },
    ],
  },
  {
    name: 'Minimalist White Porcelain Mug',
    description: 'Sophisticated white porcelain mug with elegant design. A perfect blend of simplicity and luxury for your daily coffee routine.',
    price: '22.99',
    imageUrl: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
    stock: 25,
    category: MugType.PORCELAIN,
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
        alt: 'Minimalist White Porcelain Mug',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Minimalist White Porcelain Mug - Detail',
        order: 1,
      },
    ],
  },
  {
    name: 'Insulated Thermal Coffee Mug',
    description: 'Premium thermal mug designed to keep your coffee hot for hours. Perfect for long work sessions or morning commutes.',
    price: '27.99',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    stock: 38,
    category: MugType.THERMAL,
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        alt: 'Insulated Thermal Coffee Mug',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
        alt: 'Insulated Thermal Coffee Mug - With handle',
        order: 1,
      },
    ],
  },
  {
    name: 'Classic Porcelain Tea Mug',
    description: 'Traditional porcelain mug perfect for tea lovers. The classic design and comfortable handle make it ideal for your favorite hot beverages.',
    price: '15.99',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
    stock: 45,
    category: MugType.PORCELAIN,
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
        alt: 'Classic Porcelain Tea Mug',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
        alt: 'Classic Porcelain Tea Mug - With tea',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Classic Porcelain Tea Mug - Side view',
        order: 2,
      },
    ],
  },
  {
    name: 'Large Iced Coffee Mug',
    description: 'Extra-large 16oz glass mug perfect for iced coffee and cold drinks. The wide design makes it perfect for adding ice and your favorite cold beverages.',
    price: '19.99',
    imageUrl: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
    stock: 33,
    category: MugType.ICED_COFFEE,
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
        alt: 'Large Iced Coffee Mug',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        alt: 'Large Iced Coffee Mug - With iced coffee',
        order: 1,
      },
    ],
  },
  {
    name: 'Premium Mazzotte Artisan Mug',
    description: 'Beautifully crafted mazzotte mug with unique texture and design. Each piece is handcrafted, making it a one-of-a-kind addition to your collection.',
    price: '23.99',
    imageUrl: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
    stock: 20,
    category: MugType.MAZZOTTE,
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
        alt: 'Premium Mazzotte Artisan Mug - Main view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
        alt: 'Premium Mazzotte Artisan Mug - Texture',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Premium Mazzotte Artisan Mug - Detail',
        order: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
        alt: 'Premium Mazzotte Artisan Mug - Side',
        order: 3,
      },
    ],
  },
  {
    name: 'Stainless Steel Thermal Mug',
    description: 'Durable stainless steel thermal mug with double-wall insulation. Keeps drinks hot for 6+ hours or cold for 12+ hours. Perfect for any adventure.',
    price: '31.99',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    stock: 28,
    category: MugType.THERMAL,
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        alt: 'Stainless Steel Thermal Mug',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=500&h=500&fit=crop',
        alt: 'Stainless Steel Thermal Mug - With lid',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1609005859976-5c8f0a0a0a0a?w=500&h=500&fit=crop',
        alt: 'Stainless Steel Thermal Mug - Detail',
        order: 2,
      },
    ],
  },
]

async function seedProducts() {
  try {
    console.log('🌱 Seeding products...\n')

    // Clear existing products (optional - comment out if you want to keep existing)
    // await prisma.product.deleteMany()
    // console.log('Cleared existing products\n')

    for (const product of products) {
      const { images, ...productData } = product
      
      const created = await prisma.product.create({
        data: {
          ...productData,
          images: images
            ? {
                create: images.map((img) => ({
                  url: img.url,
                  alt: img.alt,
                  order: img.order,
                })),
              }
            : undefined,
        },
        include: {
          images: true,
        },
      })
      
      const imageCount = created.images.length
      console.log(
        `✅ Created: ${created.name} - $${created.price} (${imageCount} image${imageCount !== 1 ? 's' : ''})`
      )
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

