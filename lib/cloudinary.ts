import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary at runtime
// Cloudinary SDK automatically reads CLOUDINARY_URL if set
// Otherwise, use individual environment variables
function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    // CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
    cloudinary.config()
    return true
  } else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    return true
  }
  return false
}

// Configure on module load
const isConfigured = configureCloudinary()
if (!isConfigured) {
  console.warn('Cloudinary configuration not found. Image uploads will fail.')
}

export interface UploadResult {
  url: string
  public_id: string
}

/**
 * Upload a file buffer to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'glossifi/custom-mugs'
): Promise<UploadResult> {
  // Ensure Cloudinary is configured before upload
  if (!configureCloudinary()) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_URL or individual Cloudinary environment variables.')
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          })
        } else {
          reject(new Error('Upload failed: No result returned'))
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    // Don't throw - deletion failures shouldn't break the flow
  }
}

export default cloudinary

