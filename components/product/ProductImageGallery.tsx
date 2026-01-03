'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ProductImage {
  id: string
  url: string
  alt?: string | null
  order: number
}

interface ProductImageGalleryProps {
  mainImage: string
  images?: ProductImage[]
  productName: string
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  mainImage,
  images = [],
  productName,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(mainImage)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // Combine main image with additional images
  const allImages = [
    { id: 'main', url: mainImage, alt: productName, order: 0 },
    ...images.sort((a, b) => a.order - b.order),
  ]

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl)
    setSelectedIndex(index)
  }

  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : allImages.length - 1
    setSelectedIndex(newIndex)
    setSelectedImage(allImages[newIndex].url)
  }

  const handleNext = () => {
    const newIndex = selectedIndex < allImages.length - 1 ? selectedIndex + 1 : 0
    setSelectedIndex(newIndex)
    setSelectedImage(allImages[newIndex].url)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={selectedImage}
          alt={allImages[selectedIndex]?.alt || productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Navigation Arrows (only show if multiple images) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(image.url, index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-brand-purple ring-2 ring-brand-purple/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

