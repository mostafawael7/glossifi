import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { db } from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { sendCustomMugRequestEmail, sendCustomMugConfirmationEmail } from "@/lib/email"

// Force dynamic rendering since we use getServerSession which uses headers()
export const dynamic = 'force-dynamic'

// Note: Next.js 14 doesn't have built-in multipart/form-data parsing
// We'll use a workaround with FormData API
const customMugSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1, "Phone number is required"),
  quantity: z.coerce.number().int().min(1),
  mugType: z.enum(['THERMAL', 'PORCELAIN', 'MAZZOTTE', 'ICED_COFFEE']),
  personalizationText: z.string().optional(),
  designPreferences: z.string().optional(),
  notes: z.string().optional(),
})

// POST /api/custom-mug - Create custom mug request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const formData = await request.formData()
    
    // Extract form fields
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      quantity: formData.get('quantity') as string,
      mugType: formData.get('mugType') as string,
      personalizationText: formData.get('personalizationText') as string || undefined,
      designPreferences: formData.get('designPreferences') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    }

    // Validate data
    const validatedData = customMugSchema.parse(data)

    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[]
    const imageUrls: string[] = []

    if (imageFiles.length > 0) {
      // Check Cloudinary configuration
      // Support both CLOUDINARY_URL and individual variables
      const hasCloudinaryConfig = 
        process.env.CLOUDINARY_URL || 
        (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
      
      if (!hasCloudinaryConfig) {
        console.error('Cloudinary configuration missing')
        console.error('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'Set' : 'Not set')
        console.error('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set')
        return NextResponse.json(
          { error: "Image upload service not configured. Please check your environment variables." },
          { status: 500 }
        )
      }

      // Upload each image to Cloudinary
      for (const file of imageFiles) {
        if (file && file.size > 0) {
          try {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const result = await uploadToCloudinary(buffer)
            imageUrls.push(result.url)
          } catch (error) {
            console.error('Error uploading image:', error)
            // Continue with other images even if one fails
          }
        }
      }
    }

    // Create custom mug request in database
    const customMugRequest = await db.customMugRequest.create({
      data: {
        userId: session?.user?.id || undefined,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        quantity: validatedData.quantity,
        mugType: validatedData.mugType,
        personalizationText: validatedData.personalizationText,
        designPreferences: validatedData.designPreferences,
        notes: validatedData.notes,
        imageUrls,
      },
    })

    // Send email notifications
    try {
      // Send notification to admin
      await sendCustomMugRequestEmail({
        requestId: customMugRequest.id,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        quantity: validatedData.quantity,
        mugType: validatedData.mugType,
        personalizationText: validatedData.personalizationText,
        designPreferences: validatedData.designPreferences,
        notes: validatedData.notes,
        imageUrls,
        isLoggedIn: !!session?.user?.id,
      })

      // Send confirmation email to customer
      await sendCustomMugConfirmationEmail({
        email: validatedData.email,
        name: validatedData.name,
        requestId: customMugRequest.id,
      })
    } catch (emailError) {
      console.error('Error sending emails:', emailError)
      // Don't fail the request if email fails - the request is already saved
    }

    return NextResponse.json(
      {
        message: "Custom mug request submitted successfully! We'll get back to you soon.",
        requestId: customMugRequest.id,
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
    console.error("Error creating custom mug request:", error)
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    )
  }
}

