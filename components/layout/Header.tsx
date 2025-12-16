'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Cart } from '@/components/product/Cart'

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

interface HeaderProps {
  cartItems?: CartItem[]
  onUpdateCartQuantity?: (id: string, quantity: number) => void
  onRemoveCartItem?: (id: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  cartItems = [],
  onUpdateCartQuantity,
  onRemoveCartItem,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    setIsCartOpen(false)
    window.location.href = '/checkout'
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logos/logo-black.png" 
                alt="Glossifi" 
                width={140} 
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-brand-purple transition-colors font-medium">
                Home
              </Link>
              <Link href="/products" className="text-slate-700 hover:text-brand-purple transition-colors font-medium">
                Products
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-brand-purple transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-brand-purple transition-colors font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-700 hover:text-brand-purple transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={onUpdateCartQuantity || (() => {})}
        onRemoveItem={onRemoveCartItem || (() => {})}
        onCheckout={handleCheckout}
      />
    </>
  )
}

