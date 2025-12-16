'use client'

import React from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart" size="md">
      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 text-sm mt-1 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>
          <Button onClick={onCheckout} className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      )}
    </Modal>
  )
}

