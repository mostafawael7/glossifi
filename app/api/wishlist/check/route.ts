import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Force dynamic rendering since we use getServerSession which uses headers()
export const dynamic = 'force-dynamic'

// GET /api/wishlist/check?productId=xxx - Check if product is in user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ isInWishlist: false })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ isInWishlist: false })
    }

    const wishlistItem = await db.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    })

    return NextResponse.json({ isInWishlist: !!wishlistItem })
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return NextResponse.json({ isInWishlist: false })
  }
}

