'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductGrid } from '@/components/product/ProductGrid'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
  category?: string | null
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
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedFilter(category)
    }
  }, [searchParams])

  useEffect(() => {
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
    fetchProducts()
  }, [])

  const filters = [
    { name: 'Thermal', value: 'Thermal' },
    { name: 'Porcelain', value: 'Porcelain' },
    { name: 'Mazzotte', value: 'Mazzotte' },
    { name: 'Iced Coffee', value: 'Iced Coffee' },
  ]

  const filteredProducts = selectedFilter
    ? products.filter((product) => product.category === selectedFilter)
    : products

  const handleFilterClick = (value: string | null) => {
    setSelectedFilter(value)
    // Update URL without page reload
    const url = new URL(window.location.href)
    if (value) {
      url.searchParams.set('category', value)
    } else {
      url.searchParams.delete('category')
    }
    window.history.pushState({}, '', url.toString())
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
          <p className="text-gray-600 mb-6">Browse our complete collection of premium mugs</p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFilterClick(null)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedFilter === null
                  ? 'bg-brand-purple text-white shadow-lg'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-brand-purple hover:text-brand-purple'
              }`}
            >
              All
            </button>
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => handleFilterClick(filter.value)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === filter.value
                    ? 'bg-brand-purple text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-brand-purple hover:text-brand-purple'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

