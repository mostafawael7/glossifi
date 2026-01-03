import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// Force dynamic rendering since we use getServerSession which uses headers()
export const dynamic = 'force-dynamic'

const syncCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
})

// POST /api/cart/sync - Sync localStorage cart to database (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = syncCartSchema.parse(body)

    // Get existing database cart
    const dbCartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            stock: true,
          },
        },
      },
    })

    // Create a map of existing cart items
    const existingCartMap = new Map(
      dbCartItems.map((item) => [item.productId, item])
    )

    // Process localStorage items
    for (const item of data.items) {
      // Check if product exists and has stock
      const product = await db.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        continue // Skip invalid products
      }

      const existingItem = existingCartMap.get(item.productId)

      if (existingItem) {
        // Merge quantities (add localStorage quantity to existing)
        const newQuantity = existingItem.quantity + item.quantity

        // Check stock
        if (product.stock >= newQuantity) {
          await db.cartItem.update({
            where: {
              userId_productId: {
                userId: session.user.id,
                productId: item.productId,
              },
            },
            data: {
              quantity: newQuantity,
            },
          })
        } else {
          // Set to max available stock
          await db.cartItem.update({
            where: {
              userId_productId: {
                userId: session.user.id,
                productId: item.productId,
              },
            },
            data: {
              quantity: product.stock,
            },
          })
        }
      } else {
        // Add new item to database cart
        if (product.stock >= item.quantity) {
          await db.cartItem.create({
            data: {
              userId: session.user.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          })
        } else if (product.stock > 0) {
          // Add with available stock
          await db.cartItem.create({
            data: {
              userId: session.user.id,
              productId: item.productId,
              quantity: product.stock,
            },
          })
        }
      }
    }

    // Return updated cart
    const updatedCart = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(updatedCart)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error syncing cart:", error)
    return NextResponse.json(
      { error: "Failed to sync cart" },
      { status: 500 }
    )
  }
}

