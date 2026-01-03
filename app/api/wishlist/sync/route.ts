import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// Force dynamic rendering since we use getServerSession which uses headers()
export const dynamic = 'force-dynamic'

const syncWishlistSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(), // productId
    })
  ),
})

// POST /api/wishlist/sync - Sync localStorage wishlist to database on login
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = syncWishlistSchema.parse(body)

    const userId = session.user.id
    const productIds = data.items.map((item) => item.id)

    // Get existing wishlist items
    const existingItems = await db.wishlist.findMany({
      where: {
        userId,
      },
      select: {
        productId: true,
      },
    })

    const existingProductIds = new Set(existingItems.map((item) => item.productId))

    // Add new items from localStorage that don't exist in database
    const itemsToAdd = productIds.filter((id) => !existingProductIds.has(id))

    if (itemsToAdd.length > 0) {
      // Verify products exist
      const products = await db.product.findMany({
        where: {
          id: { in: itemsToAdd },
        },
        select: {
          id: true,
        },
      })

      const validProductIds = products.map((p) => p.id)

      // Create wishlist items
      await db.wishlist.createMany({
        data: validProductIds.map((productId) => ({
          userId,
          productId,
        })),
        skipDuplicates: true,
      })
    }

    // Return updated wishlist
    const wishlistItems = await db.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            stock: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, items: wishlistItems })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error syncing wishlist:", error)
    return NextResponse.json(
      { error: "Failed to sync wishlist" },
      { status: 500 }
    )
  }
}

