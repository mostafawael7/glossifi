'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: string
    imageUrl: string
    stock: number
    category: string | null
  }
  createdAt: string
}

export default function WishlistPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirect=/wishlist')
    }
  }, [sessionStatus, router])

  const fetchWishlist = useCallback(async () => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data)
      } else {
        toast.error('Failed to load wishlist')
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (session?.user) {
      fetchWishlist()
    }
  }, [session, fetchWishlist])

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setWishlistItems((prev) => prev.filter((item) => item.productId !== productId))
        toast.success('Removed from wishlist')
      } else {
        toast.error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            My Wishlist
          </h1>
          <p className="text-sm sm:text-base text-slate-600">Your favorite products</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading wishlist...</div>
        ) : wishlistItems.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-slate-400"
                  fill="none"
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
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h3>
              <p className="text-slate-600 mb-6">Start adding products to your wishlist!</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow flex flex-col h-full relative">
                <Link href={`/products/${item.product.id}`}>
                  <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemoveFromWishlist(item.productId)
                      }}
                      className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors z-10"
                      aria-label="Remove from wishlist"
                    >
                      <svg
                        className="w-6 h-6 fill-red-500 text-red-500"
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
                <CardContent className="p-4 flex flex-col flex-grow">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 hover:text-brand-purple transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  {item.product.stock > 0 && item.product.stock < 10 && (
                    <p className="text-xs text-orange-600 mb-3">Only {item.product.stock} left in stock</p>
                  )}
                  {item.product.stock === 0 && (
                    <p className="text-xs text-red-600 mb-3">Out of stock</p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(item.product.price)}
                    </span>
                    <Link href={`/products/${item.product.id}`}>
                      <Button size="sm" disabled={item.product.stock === 0}>
                        {item.product.stock === 0 ? 'Out of Stock' : 'View Product'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

