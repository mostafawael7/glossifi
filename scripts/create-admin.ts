/**
 * Script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 * 
 * Make sure to set DATABASE_URL in your .env file first
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2] || 'admin@glossifi.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin User'

  try {
    // Check if admin already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (existing) {
      console.log(`Admin with email ${email} already exists!`)
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    const admin = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    console.log('Admin user created successfully!')
    console.log(`Email: ${admin.email}`)
    console.log(`Name: ${admin.name}`)
    console.log(`ID: ${admin.id}`)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

