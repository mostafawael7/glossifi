import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendContactEmail } from "@/lib/email"

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

// POST /api/contact - Send contact form email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // Send email to admin
    const emailResult = await sendContactEmail(data)

    if (!emailResult.success) {
      console.error('Failed to send contact email:', emailResult.error)
      // Still return success to user, but log the error
      // In production, you might want to handle this differently
    }

    return NextResponse.json(
      { message: "Thank you for your message! We'll get back to you soon." },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

