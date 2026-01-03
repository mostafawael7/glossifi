'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

const MUG_TYPES = [
  { value: 'THERMAL', label: 'Thermal' },
  { value: 'PORCELAIN', label: 'Porcelain' },
  { value: 'MAZZOTTE', label: 'Mazzotte' },
  { value: 'ICED_COFFEE', label: 'Iced Coffee' },
] as const

export default function CustomMugPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    quantity: 1,
    mugType: 'THERMAL' as const,
    personalizationText: '',
    designPreferences: '',
    notes: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate file types
    const validFiles = files.filter((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format. Please use JPG, PNG, or WEBP.`)
        return false
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`)
        return false
      }
      return true
    })

    // Limit to 2 images total
    const remainingSlots = 2 - images.length
    const filesToAdd = validFiles.slice(0, remainingSlots)
    
    if (validFiles.length > remainingSlots) {
      toast.error(`You can upload a maximum of 2 images. Only ${remainingSlots} will be added.`)
    }

    setImages([...images, ...filesToAdd])

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone || '')
      formDataToSend.append('quantity', formData.quantity.toString())
      formDataToSend.append('mugType', formData.mugType)
      formDataToSend.append('personalizationText', formData.personalizationText)
      formDataToSend.append('designPreferences', formData.designPreferences)
      formDataToSend.append('notes', formData.notes || '')

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const response = await fetch('/api/custom-mug', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Custom mug request submitted successfully! We\'ll get back to you soon.')
        // Reset form
        setFormData({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: '',
          quantity: 1,
          mugType: 'THERMAL',
          personalizationText: '',
          designPreferences: '',
          notes: '',
        })
        setImages([])
        setImagePreviews([])
      } else {
        toast.error(data.error || 'Failed to submit request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-2">
            Request a Custom Personalized Mug
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
            Have a unique design in mind? Fill out the form below and we&apos;ll create a custom mug just for you!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900"
                  />
                </div>
              </div>
              <div className="mt-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Mug Details */}
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Mug Details</h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="mugType" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mug Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="mugType"
                    name="mugType"
                    value={formData.mugType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900"
                    required
                  >
                    {MUG_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Personalization */}
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Personalization</h2>
              <Textarea
                label="Text to Print"
                name="personalizationText"
                rows={4}
                value={formData.personalizationText}
                onChange={handleChange}
                placeholder="Enter the text you'd like printed on your mug..."
              />
              <div className="mt-6">
                <Textarea
                  label="Design Preferences"
                  name="designPreferences"
                  rows={4}
                  value={formData.designPreferences}
                  onChange={handleChange}
                  placeholder="Describe your design preferences, colors, style, etc..."
                />
              </div>
            </div>

            {/* Images */}
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Reference Images</h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-4">
                Upload up to 2 images to help us understand your vision. Accepted formats: JPG, PNG, WEBP (max 5MB each)
              </p>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={128}
                        unoptimized
                        className="w-full h-32 object-cover rounded-lg border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  disabled={images.length >= 2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900"
                />
                {images.length >= 2 && (
                  <p className="mt-2 text-sm text-slate-600">Maximum 2 images reached</p>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Textarea
                label="Additional Notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information, special requests, or your preferred communication method (email, phone, WhatsApp, etc.)..."
              />
            </div>

            {/* Contact Information Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong className="font-semibold">Important:</strong> Our team will contact you to confirm your order details and discuss pricing. Please provide your preferred communication method in the Additional Notes field above (e.g., email, phone call, WhatsApp, etc.).
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

