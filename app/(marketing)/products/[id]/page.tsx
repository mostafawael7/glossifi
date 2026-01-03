'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { ProductImageGallery } from '@/components/product/ProductImageGallery'
import { Reviews } from '@/components/product/Reviews'
import toast from 'react-hot-toast'

interface ProductImage {
  id: string
  url: string
  alt?: string | null
  order: number
}

interface Product {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
  category?: string
  images?: ProductImage[]
  reviews?: Array<{
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
      id: string
      name: string
    }
  }>
}

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export default function ProductDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product) return

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
  }, [product, session])

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

  const handleAddToCart = async () => {
    if (!product) return

    const isLoggedIn = !!session?.user?.id

    if (isLoggedIn) {
      // Add to database cart
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
          }),
        })

        if (response.ok) {
          toast.success('Added to cart!')
          window.location.reload() // Reload to update cart in header
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to add to cart')
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        toast.error('Failed to add to cart')
      }
    } else {
      // Add to localStorage
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
  }

  const toggleFavorite = async () => {
    if (!product) return

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
    }
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
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
            <div>
              <ProductImageGallery
                mainImage={product.imageUrl}
                images={product.images || []}
                productName={product.name}
              />
            </div>
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1 pr-2">{product.name}</h1>
                <button
                  onClick={toggleFavorite}
                  className="ml-2 sm:ml-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 flex-shrink-0"
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
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
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
          
          {/* Product Description */}
          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-4 sm:px-6 lg:px-8">
          <Reviews productId={product.id} />
        </div>
      </div>
    </div>
  )
}

