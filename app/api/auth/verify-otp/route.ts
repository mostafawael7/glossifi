import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
})

// POST /api/auth/verify-otp - Verify OTP and create user account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = verifyOTPSchema.parse(body)

    // Find pending registration
    const pendingRegistration = await db.pendingRegistration.findUnique({
      where: { email: data.email },
    })

    if (!pendingRegistration) {
      return NextResponse.json(
        { error: "No pending registration found. Please register again." },
        { status: 404 }
      )
    }

    // Check if OTP is expired
    if (new Date() > pendingRegistration.otpExpires) {
      await db.pendingRegistration.delete({
        where: { email: data.email },
      })
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Verify OTP
    if (pendingRegistration.otp !== data.otp) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      )
    }

    // Check if user already exists (edge case)
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      // Delete pending registration
      await db.pendingRegistration.delete({
        where: { email: data.email },
      })
      return NextResponse.json(
        { error: "Account already exists. Please log in instead." },
        { status: 400 }
      )
    }

    // Create user account
    const user = await db.user.create({
      data: {
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        password: pendingRegistration.password,
        phone: pendingRegistration.phone,
        emailVerified: new Date(), // Mark as verified since OTP was verified
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    })

    // Delete pending registration
    await db.pendingRegistration.delete({
      where: { email: data.email },
    })

    return NextResponse.json(
      {
        message: "Account created successfully!",
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error verifying OTP:", error)
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    )
  }
}

