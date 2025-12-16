'use client'

import React from 'react'
import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
  featured?: boolean
}

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

