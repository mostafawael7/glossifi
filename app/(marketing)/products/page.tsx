'use client'

import React, { useState, useEffect } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
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

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Added to cart!')
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">Browse our complete collection of premium mugs</p>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={products} onAddToCart={handleAddToCart} />
        )}
      </div>
    </div>
  )
}

