import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { sendOTPEmail } from "@/lib/email"

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
})

// POST /api/auth/register - Register new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Check if there's already a pending registration for this email
    const existingPending = await db.pendingRegistration.findUnique({
      where: { email: data.email },
    })

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date()
    otpExpires.setMinutes(otpExpires.getMinutes() + 10) // OTP expires in 10 minutes

    // Create or update pending registration
    if (existingPending) {
      // Update existing pending registration
      await db.pendingRegistration.update({
        where: { email: data.email },
        data: {
          name: data.name,
          password: hashedPassword,
          phone: data.phone,
          otp,
          otpExpires,
        },
      })
    } else {
      // Create new pending registration
      await db.pendingRegistration.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          otp,
          otpExpires,
        },
      })
    }

    // Send OTP email
    try {
      await sendOTPEmail({
        email: data.email,
        name: data.name,
        otp,
      })
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError)
      return NextResponse.json(
        { error: "Failed to send verification code. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "Verification code sent to your email! Please check your inbox.",
        email: data.email, // Return email for OTP verification page
        requiresOTP: true,
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
    console.error("Error registering user:", error)
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    )
  }
}

