'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
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
  category?: string
}

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (product) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setIsFavorite(wishlist.some((item: { id: string }) => item.id === product.id))
    }
  }, [product])

  useEffect(() => {
    if (params.id) {
      const fetchProduct = async (id: string) => {
        try {
          const response = await fetch(`/api/products/${id}`)
          if (response.ok) {
            const data = await response.json()
            setProduct(data)
          } else {
            toast.error('Product not found')
            router.push('/products')
          }
        } catch (error) {
          console.error('Error fetching product:', error)
          toast.error('Failed to load product')
        } finally {
          setLoading(false)
        }
      }
      fetchProduct(params.id as string)
    }
  }, [params.id, router])

  const handleAddToCart = () => {
    if (!product) return

    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        imageUrl: product.imageUrl,
        quantity,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Added to cart!')
    window.dispatchEvent(new Event('storage'))
  }

  const toggleFavorite = () => {
    if (!product) return

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

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const isOutOfStock = product.stock === 0
  const maxQuantity = Math.min(product.stock, 10)

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="relative h-96 w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{product.name}</h1>
                <button
                  onClick={toggleFavorite}
                  className="ml-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
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
              {product.category && (
                <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
              )}
              <p className="text-3xl font-bold text-blue-600 mb-6">
                {formatPrice(product.price)}
              </p>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold text-lg transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1
                        setQuantity(Math.max(1, Math.min(maxQuantity, val)))
                      }}
                      min={1}
                      max={maxQuantity}
                      className="w-16 h-10 text-center font-semibold border-0 focus:outline-none focus:ring-0 text-black"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity || isOutOfStock}
                      className="w-10 h-10 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isOutOfStock ? 'Out of stock' : `${product.stock} available`}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="w-full mt-auto"
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

