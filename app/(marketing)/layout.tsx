'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      setCartItems(JSON.parse(stored))
    }
  }, [])

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeCartItem = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItems={cartItems}
        onUpdateCartQuantity={updateCartQuantity}
        onRemoveCartItem={removeCartItem}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

