import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { uploadToCloudinary } from "@/lib/cloudinary"

const productSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.string().or(z.number()).optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
  category: z.enum(["THERMAL", "PORCELAIN", "MAZZOTTE", "ICED_COFFEE"]).optional().nullable(),
  featured: z.boolean().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    order: z.number().int().min(0).optional(),
  })).optional(),
})

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    
    const updateData: any = {}
    
    // Extract text fields
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const stock = formData.get('stock') as string
    const category = formData.get('category') as string
    const featured = formData.get('featured') as string

    if (name) updateData.name = name
    if (description) updateData.description = description
    if (price) updateData.price = price.toString()
    if (stock) updateData.stock = parseInt(stock)
    if (category !== null) updateData.category = category || undefined
    if (featured) updateData.featured = featured === 'true'

    // Handle main image: upload file or use URL
    const mainImageFile = formData.get('mainImage') as File | null
    if (mainImageFile && mainImageFile.size > 0) {
      // Upload to Cloudinary
      const arrayBuffer = await mainImageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const result = await uploadToCloudinary(buffer, 'glossifi/products')
      updateData.imageUrl = result.url
    } else {
      const imageUrl = formData.get('imageUrl') as string
      if (imageUrl) updateData.imageUrl = imageUrl
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

    // Handle images update
    if (additionalImages.length > 0 || formData.has('additionalImage_0') || formData.has('additionalImageUrl_0')) {
      // Delete existing images
      await db.productImage.deleteMany({
        where: { productId: params.id },
      })
      // Create new images
      if (additionalImages.length > 0) {
        updateData.images = {
          create: additionalImages,
        }
      }
    }

    const product = await db.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}

