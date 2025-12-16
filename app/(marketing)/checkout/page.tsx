'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      const items = JSON.parse(stored)
      setCartItems(items)
      if (items.length === 0) {
        toast.error('Your cart is empty')
        router.push('/products')
      }
    } else {
      router.push('/products')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems,
        }),
      })

      if (response.ok) {
        toast.success('Order placed successfully!')
        localStorage.removeItem('cart')
        router.push('/products')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Shipping Information</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Full Name"
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Phone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleChange}
                  />
                  <Textarea
                    label="Shipping Address"
                    name="shippingAddress"
                    rows={4}
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                  />
                  <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Order Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

