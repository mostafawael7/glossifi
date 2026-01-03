'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
  featured?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { data: session } = useSession()
  const isOutOfStock = product.stock === 0
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check wishlist status on mount and when product/session changes
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (session?.user) {
        // Check database wishlist
        try {
          const response = await fetch(`/api/wishlist/check?productId=${product.id}`)
          if (response.ok) {
            const data = await response.json()
            setIsFavorite(data.isInWishlist)
          }
        } catch (error) {
          console.error('Error checking wishlist:', error)
        }
      } else {
        // Check localStorage wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        setIsFavorite(wishlist.some((item: { id: string }) => item.id === product.id))
      }
    }

    checkWishlistStatus()
  }, [product.id, session])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    setIsLoading(true)

    try {
      if (session?.user) {
        // Use database wishlist
        if (isFavorite) {
          const response = await fetch(`/api/wishlist?productId=${product.id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            setIsFavorite(false)
            toast.success('Removed from favorites')
          } else {
            toast.error('Failed to remove from favorites')
          }
        } else {
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: product.id,
            }),
          })
          if (response.ok) {
            setIsFavorite(true)
            toast.success('Added to favorites')
          } else {
            const error = await response.json()
            toast.error(error.error || 'Failed to add to favorites')
          }
        }
      } else {
        // Use localStorage wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        
        if (isFavorite) {
          const updated = wishlist.filter((item: { id: string }) => item.id !== product.id)
          localStorage.setItem('wishlist', JSON.stringify(updated))
          setIsFavorite(false)
          toast.success('Removed from favorites')
        } else {
          const wishlistItem = {
            id: product.id,
            name: product.name,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            imageUrl: product.imageUrl,
          }
          wishlist.push(wishlistItem)
          localStorage.setItem('wishlist', JSON.stringify(wishlist))
          setIsFavorite(true)
          toast.success('Added to favorites')
        }
        
        window.dispatchEvent(new Event('storage'))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow flex flex-col h-full">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-brand-purple text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              Featured
            </div>
          )}
          <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'
              }`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 hover:text-brand-purple transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-600 mb-3">Only {product.stock} left in stock</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {onAddToCart && (
            <Button
              onClick={(e) => {
                e.preventDefault()
                onAddToCart(product)
              }}
              disabled={isOutOfStock}
              size="sm"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

