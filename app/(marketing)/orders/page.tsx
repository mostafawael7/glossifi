'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: string
  product: {
    id: string
    name: string
    imageUrl: string
  }
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  shippingAddress: string
  totalAmount: string
  status: string
  trackingNumber?: string | null
  shippingCarrier?: string | null
  estimatedDelivery?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function OrdersPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirect=/orders')
    }
  }, [sessionStatus, router])

  const fetchOrders = useCallback(async () => {
    if (!session?.user) return

    try {
      const url = statusFilter ? `/api/orders/my?status=${statusFilter}` : '/api/orders/my'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error('Failed to load orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [session, statusFilter])

  useEffect(() => {
    if (session?.user) {
      fetchOrders()
    }
  }, [session, fetchOrders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200'
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
            My Orders
          </h1>
          <p className="text-sm sm:text-base text-slate-600">View and track your order history</p>
        </div>

        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple bg-white text-slate-700 font-medium shadow-sm"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading orders...</div>
        ) : orders.length === 0 ? (
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h3>
              <p className="text-slate-600 mb-6">Start shopping to see your orders here!</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            Order #{order.id.substring(0, 8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Items</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                                <div className="relative w-10 h-10 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                                  <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="text-xs">
                                  <p className="font-medium text-slate-900 truncate max-w-[120px]">
                                    {item.product.name}
                                  </p>
                                  <p className="text-slate-600">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="flex items-center justify-center bg-slate-50 rounded-lg p-2 text-xs font-medium text-slate-600">
                                +{order.items.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Total</p>
                          <p className="text-xl font-bold text-slate-900">{formatPrice(order.totalAmount)}</p>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <p className="text-sm font-medium text-indigo-900 mb-1">Tracking Information</p>
                          <p className="text-sm text-indigo-700">
                            <strong>Tracking #:</strong> {order.trackingNumber}
                          </p>
                          {order.shippingCarrier && (
                            <p className="text-sm text-indigo-700">
                              <strong>Carrier:</strong> {order.shippingCarrier}
                            </p>
                          )}
                          {order.estimatedDelivery && (
                            <p className="text-sm text-indigo-700">
                              <strong>Estimated Delivery:</strong>{' '}
                              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        variant="outline"
                        size="sm"
                        className="border-brand-purple text-brand-purple hover:bg-brand-cream hover:border-brand-lavender"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

interface OrderDetailModalProps {
  order: Order
  onClose: () => void
}

function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200'
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Order #${order.id.substring(0, 8).toUpperCase()}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Order Status */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Order Status</h3>
          <div className="bg-slate-50 p-4 rounded-lg">
            <span className={`px-4 py-2 text-sm font-semibold rounded-full inline-block ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            {order.shippedAt && (
              <p className="text-sm text-slate-600 mt-2">
                Shipped on {new Date(order.shippedAt).toLocaleString()}
              </p>
            )}
            {order.deliveredAt && (
              <p className="text-sm text-slate-600 mt-2">
                Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Shipping Address</h3>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="whitespace-pre-line text-slate-900">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Tracking Information */}
        {order.trackingNumber && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-lg">Tracking Information</h3>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Tracking Number:</span>
                <span className="font-medium text-slate-900">{order.trackingNumber}</span>
              </div>
              {order.shippingCarrier && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Carrier:</span>
                  <span className="font-medium text-slate-900">{order.shippingCarrier}</span>
                </div>
              )}
              {order.estimatedDelivery && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Estimated Delivery:</span>
                  <span className="font-medium text-slate-900">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Order Items</h3>
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{item.product.name}</p>
                  <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                  <p className="text-sm text-slate-600">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
            <div className="border-t border-slate-300 pt-3 mt-3 flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-900">Total:</span>
              <span className="text-xl font-bold text-slate-900">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Order Timeline</h3>
          <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Order Placed:</span>
              <span className="font-medium text-slate-900">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Last Updated:</span>
              <span className="font-medium text-slate-900">
                {new Date(order.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

