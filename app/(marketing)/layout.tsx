'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  productId?: string
}

interface DatabaseCartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: string | number
    imageUrl: string
    stock: number
  }
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [hasSynced, setHasSynced] = useState(false)

  // Load cart based on authentication status
  useEffect(() => {
    const loadCart = async () => {
      setIsLoadingCart(true)
      
      if (session?.user?.id) {
        // User is logged in - load from database
        try {
          const response = await fetch('/api/cart')
          if (response.ok) {
            const dbCart: DatabaseCartItem[] = await response.json()
            const formattedCart: CartItem[] = dbCart.map((item) => ({
              id: item.product.id,
              productId: item.productId,
              name: item.product.name,
              price: typeof item.product.price === 'string' 
                ? parseFloat(item.product.price) 
                : item.product.price,
              imageUrl: item.product.imageUrl,
              quantity: item.quantity,
            }))
            setCartItems(formattedCart)
            
            // Sync localStorage cart to database on first load (if not already synced)
            if (!hasSynced) {
              const localCart = localStorage.getItem('cart')
              if (localCart) {
                const localItems = JSON.parse(localCart)
                if (localItems.length > 0) {
                  try {
                    await fetch('/api/cart/sync', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        items: localItems.map((item: CartItem) => ({
                          productId: item.id,
                          quantity: item.quantity,
                        })),
                      }),
                    })
                    // Reload cart after sync
                    const syncResponse = await fetch('/api/cart')
                    if (syncResponse.ok) {
                      const syncedCart: DatabaseCartItem[] = await syncResponse.json()
                      const formatted: CartItem[] = syncedCart.map((item) => ({
                        id: item.product.id,
                        productId: item.productId,
                        name: item.product.name,
                        price: typeof item.product.price === 'string' 
                          ? parseFloat(item.product.price) 
                          : item.product.price,
                        imageUrl: item.product.imageUrl,
                        quantity: item.quantity,
                      }))
                      setCartItems(formatted)
                    }
                    // Clear localStorage after successful sync
                    localStorage.removeItem('cart')
                  } catch (error) {
                    console.error('Error syncing cart:', error)
                  }
                }
              }
              setHasSynced(true)
            }
            
            // Sync localStorage wishlist to database on first load (if not already synced)
            const localWishlist = localStorage.getItem('wishlist')
            if (localWishlist) {
              const localItems = JSON.parse(localWishlist)
              if (localItems.length > 0) {
                try {
                  await fetch('/api/wishlist/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      items: localItems.map((item: { id: string }) => ({
                        id: item.id,
                      })),
                    }),
                  })
                  // Clear localStorage after successful sync
                  localStorage.removeItem('wishlist')
                } catch (error) {
                  console.error('Error syncing wishlist:', error)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading cart:', error)
        }
      } else {
        // Guest user - load from localStorage
    const stored = localStorage.getItem('cart')
    if (stored) {
      setCartItems(JSON.parse(stored))
    }
      }
      
      setIsLoadingCart(false)
    }

    loadCart()
  }, [session, hasSynced])

  const updateCartQuantity = async (id: string, quantity: number) => {
    if (session?.user?.id) {
      // Update in database
      try {
        const productId = cartItems.find(item => item.id === id)?.productId || id
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: productId,
            quantity: Math.max(0, quantity),
          }),
        })
        
        if (response.ok) {
          const updated: DatabaseCartItem = await response.json()
          setCartItems((prev) => {
            const filtered = prev.filter((item) => item.id !== id || quantity > 0)
            if (quantity > 0) {
              const existingIndex = filtered.findIndex(item => item.id === id)
              const updatedItem: CartItem = {
                id: updated.product.id,
                productId: updated.productId,
                name: updated.product.name,
                price: typeof updated.product.price === 'string' 
                  ? parseFloat(updated.product.price) 
                  : updated.product.price,
                imageUrl: updated.product.imageUrl,
                quantity: updated.quantity,
              }
              if (existingIndex >= 0) {
                filtered[existingIndex] = updatedItem
              } else {
                filtered.push(updatedItem)
              }
            }
            return filtered
          })
        }
      } catch (error) {
        console.error('Error updating cart:', error)
      }
    } else {
      // Update in localStorage
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }
  }

  const removeCartItem = async (id: string) => {
    if (session?.user?.id) {
      // Remove from database
      try {
        const productId = cartItems.find(item => item.id === id)?.productId || id
        const response = await fetch(`/api/cart?productId=${productId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setCartItems((prev) => prev.filter((item) => item.id !== id))
        }
      } catch (error) {
        console.error('Error removing from cart:', error)
      }
    } else {
      // Remove from localStorage
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
    }
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

