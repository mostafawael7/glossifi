import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  trackingNumber: z.string().optional(),
  shippingCarrier: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  shippedAt: z.string().datetime().optional(),
  deliveredAt: z.string().datetime().optional(),
})

// GET /api/orders/[id] - Get single order (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const order = await db.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status and tracking (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = updateOrderSchema.parse(body)

    // Build update data object
    const updateData: any = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.trackingNumber !== undefined) updateData.trackingNumber = data.trackingNumber
    if (data.shippingCarrier !== undefined) updateData.shippingCarrier = data.shippingCarrier
    if (data.estimatedDelivery !== undefined) updateData.estimatedDelivery = new Date(data.estimatedDelivery)
    if (data.shippedAt !== undefined) updateData.shippedAt = new Date(data.shippedAt)
    if (data.deliveredAt !== undefined) updateData.deliveredAt = new Date(data.deliveredAt)

    // Auto-set shippedAt when status changes to SHIPPED
    if (data.status === "SHIPPED" && !data.shippedAt) {
      updateData.shippedAt = new Date()
    }

    // Auto-set deliveredAt when status changes to DELIVERED
    if (data.status === "DELIVERED" && !data.deliveredAt) {
      updateData.deliveredAt = new Date()
    }

    const order = await db.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}

