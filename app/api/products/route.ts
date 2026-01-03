import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { uploadToCloudinary } from "@/lib/cloudinary"

// Force dynamic rendering since we use getServerSession which uses headers()
export const dynamic = 'force-dynamic'

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().or(z.number()),
  imageUrl: z.string().url(),
  stock: z.number().int().min(0),
  category: z.enum(["THERMAL", "PORCELAIN", "MAZZOTTE", "ICED_COFFEE"]).optional().nullable(),
  featured: z.boolean().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    order: z.number().int().min(0).optional(),
  })).optional(),
})

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const stockStatus = searchParams.get("stockStatus") // "in_stock", "low_stock", "out_of_stock"

    const where: any = {}

    // Featured filter
    if (featured === "true") {
      where.featured = true
    } else if (featured === "false") {
      where.featured = false
    }

    // Category filter
    if (category) {
      where.category = category as any
    }

    // Search by name (case-insensitive)
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      } as any
    }

    // Stock status filter
    if (stockStatus) {
      if (stockStatus === "out_of_stock") {
        where.stock = 0
      } else if (stockStatus === "low_stock") {
        where.stock = {
          lte: 10,
          gt: 0,
        }
      } else if (stockStatus === "in_stock") {
        where.stock = {
          gt: 10,
        }
      }
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
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

    const formData = await request.formData()
    
    // Extract text fields
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const stock = parseInt(formData.get('stock') as string)
    const category = formData.get('category') as string || null
    const featured = formData.get('featured') === 'true'

    // Handle main image: upload file or use URL
    let imageUrl = ''
    const mainImageFile = formData.get('mainImage') as File | null
    if (mainImageFile && mainImageFile.size > 0) {
      // Upload to Cloudinary
      const arrayBuffer = await mainImageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const result = await uploadToCloudinary(buffer, 'glossifi/products')
      imageUrl = result.url
    } else {
      imageUrl = (formData.get('imageUrl') as string) || ''
    }

    // Validate required fields
    if (!name || !description || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Handle additional images
    const additionalImages: Array<{ url: string; alt: string; order: number }> = []
    let index = 0
    while (true) {
      const imageFile = formData.get(`additionalImage_${index}`) as File | null
      const imageUrl = formData.get(`additionalImageUrl_${index}`) as string | null
      const alt = (formData.get(`additionalImageAlt_${index}`) as string) || ''

      if (!imageFile && !imageUrl) break

      let url = ''
      if (imageFile && imageFile.size > 0) {
        // Upload to Cloudinary
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const result = await uploadToCloudinary(buffer, 'glossifi/products')
        url = result.url
      } else if (imageUrl) {
        url = imageUrl
      }

      if (url) {
        additionalImages.push({
          url,
          alt,
          order: index,
        })
      }
      index++
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price: price.toString(),
        imageUrl,
        stock,
        category: category as any || undefined,
        featured,
        images: additionalImages.length > 0 ? {
          create: additionalImages,
        } : undefined,
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

