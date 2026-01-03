import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { sendOTPEmail } from "@/lib/email"

const resendOTPSchema = z.object({
  email: z.string().email(),
})

// POST /api/auth/resend-otp - Resend OTP for pending registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = resendOTPSchema.parse(body)

    // Find pending registration
    const pendingRegistration = await db.pendingRegistration.findUnique({
      where: { email: data.email },
    })

    if (!pendingRegistration) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        { message: "If a registration exists for this email, a new verification code has been sent." },
        { status: 200 }
      )
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date()
    otpExpires.setMinutes(otpExpires.getMinutes() + 10) // OTP expires in 10 minutes

    // Update pending registration with new OTP
    await db.pendingRegistration.update({
      where: { email: data.email },
      data: {
        otp,
        otpExpires,
      },
    })

    // Send OTP email
    try {
      await sendOTPEmail({
        email: pendingRegistration.email,
        name: pendingRegistration.name,
        otp,
      })
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError)
      return NextResponse.json(
        { error: "Failed to send verification code" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "New verification code sent! Please check your email." },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error resending OTP:", error)
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 }
    )
  }
}

