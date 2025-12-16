'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

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
  const isOutOfStock = product.stock === 0

  return (
    <Card className="group hover:shadow-lg transition-shadow">
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
            <div className="absolute top-2 right-2 bg-brand-purple text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              Featured
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-slate-900 mb-1 hover:text-brand-purple transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
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
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-600 mt-2">Only {product.stock} left in stock</p>
        )}
      </div>
    </Card>
  )
}

