import { Resend } from 'resend'

// Default email addresses
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'glossyprint2025@gmail.com'

// Lazy initialization of Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

/**
 * Send contact form email to admin
 */
export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false, error: 'Email service not configured' }
    }

    const resend = getResendClient()
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      reply_to: data.email,
      subject: `Contact Form: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <div style="margin-top: 20px;">
              <strong>Message:</strong>
              <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px; white-space: pre-wrap;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            This email was sent from the Glossifi contact form.
          </p>
        </div>
      `,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * Send custom mug request notification to admin
 */
export async function sendCustomMugRequestEmail(data: {
  requestId: string
  name: string
  email: string
  phone?: string
  quantity: number
  mugType: string
  personalizationText?: string
  designPreferences?: string
  notes?: string
  imageUrls: string[]
  isLoggedIn: boolean
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false, error: 'Email service not configured' }
    }

    const resend = getResendClient()
    const mugTypeLabels: Record<string, string> = {
      THERMAL: 'Thermal',
      PORCELAIN: 'Porcelain',
      MAZZOTTE: 'Mazzotte',
      ICED_COFFEE: 'Iced Coffee',
    }

    const imagesHtml = data.imageUrls.length > 0
      ? `
        <div style="margin-top: 20px;">
          <strong>Reference Images:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
            ${data.imageUrls.map(url => `
              <img src="${url}" alt="Reference image" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #e5e7eb;" />
            `).join('')}
          </div>
        </div>
      `
      : '<p style="color: #6b7280;">No images provided.</p>'

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      reply_to: data.email,
      subject: `New Custom Mug Request - ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 10px;">
            New Custom Mug Request
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Request ID:</strong> ${data.requestId}</p>
            <p><strong>Customer Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            <p><strong>Account:</strong> ${data.isLoggedIn ? 'Registered User' : 'Guest'}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p><strong>Mug Type:</strong> ${mugTypeLabels[data.mugType] || data.mugType}</p>
            <p><strong>Quantity:</strong> ${data.quantity}</p>
            ${data.personalizationText ? `
              <div style="margin-top: 15px;">
                <strong>Personalization Text:</strong>
                <div style="background-color: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
                  ${data.personalizationText.replace(/\n/g, '<br>')}
                </div>
              </div>
            ` : ''}
            ${data.designPreferences ? `
              <div style="margin-top: 15px;">
                <strong>Design Preferences:</strong>
                <div style="background-color: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
                  ${data.designPreferences.replace(/\n/g, '<br>')}
                </div>
              </div>
            ` : ''}
            ${data.notes ? `
              <div style="margin-top: 15px;">
                <strong>Additional Notes:</strong>
                <div style="background-color: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
                  ${data.notes.replace(/\n/g, '<br>')}
                </div>
              </div>
            ` : ''}
            ${imagesHtml}
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <p style="margin: 0; color: #92400e;">
              <strong>Action Required:</strong> Review this request in the admin panel and update its status.
            </p>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            This email was sent from the Glossifi custom mug request form.
          </p>
        </div>
      `,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending custom mug request email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * Send confirmation email to customer for custom mug request
 */
export async function sendCustomMugConfirmationEmail(data: {
  email: string
  name: string
  requestId: string
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false, error: 'Email service not configured' }
    }

    const resend = getResendClient()
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Custom Mug Request Received - Glossifi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 10px;">
            Thank You for Your Custom Mug Request!
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p>Hi ${data.name},</p>
            <p>We've received your custom mug request and our team will review it shortly.</p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <p style="margin: 0;"><strong>Request ID:</strong> ${data.requestId}</p>
            </div>
            <p>We'll get back to you within 24-48 hours with a quote and next steps.</p>
            <p>If you have any questions, feel free to contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></p>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            Best regards,<br>
            The Glossifi Team
          </p>
        </div>
      `,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * Send OTP email to user for registration verification
 */
export async function sendOTPEmail(data: {
  email: string
  name: string
  otp: string
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false, error: 'Email service not configured' }
    }

    const resend = getResendClient()
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Your Verification Code - Glossifi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 10px;">
            Verify Your Email Address
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p>Hi ${data.name},</p>
            <p>Thank you for signing up for Glossifi! Please use the verification code below to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: white; border: 2px solid #6B46C1; border-radius: 8px; padding: 20px; display: inline-block;">
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">Your verification code:</p>
                <p style="font-size: 32px; font-weight: bold; color: #6B46C1; letter-spacing: 8px; margin: 0; font-family: monospace;">
                  ${data.otp}
                </p>
              </div>
            </div>
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
              This code will expire in 10 minutes. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            Best regards,<br>
            The Glossifi Team
          </p>
        </div>
      `,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

