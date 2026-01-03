import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { db } from "@/lib/db"

// Force dynamic rendering since we use getServerSession which uses headers()
export const dynamic = 'force-dynamic'

const updateCustomMugSchema = z.object({
  status: z.enum(['PENDING', 'QUOTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  estimatedPrice: z.coerce.number().positive().optional(),
  adminNotes: z.string().optional(),
})

// GET /api/custom-mug/[id] - Get custom mug request (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customMugRequest = await db.customMugRequest.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!customMugRequest) {
      return NextResponse.json(
        { error: "Custom mug request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(customMugRequest)
  } catch (error) {
    console.error("Error fetching custom mug request:", error)
    return NextResponse.json(
      { error: "Failed to fetch request" },
      { status: 500 }
    )
  }
}

// PUT /api/custom-mug/[id] - Update custom mug request (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = updateCustomMugSchema.parse(body)

    const updateData: any = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.estimatedPrice !== undefined) updateData.estimatedPrice = data.estimatedPrice.toString()
    if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes

    const customMugRequest = await db.customMugRequest.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(customMugRequest)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating custom mug request:", error)
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    )
  }
}

