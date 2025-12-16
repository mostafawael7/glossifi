import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().or(z.number()),
  imageUrl: z.string().url(),
  stock: z.number().int().min(0),
  category: z.string().optional(),
  featured: z.boolean().optional(),
})

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")

    const products = await db.product.findMany({
      where: featured === "true" ? { featured: true } : undefined,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = productSchema.parse(body)

    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        imageUrl: data.imageUrl,
        stock: data.stock,
        category: data.category,
        featured: data.featured ?? false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

