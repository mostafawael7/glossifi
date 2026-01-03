'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import Image from 'next/image'

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
  customerPhone?: string
  shippingAddress: string
  totalAmount: string
  status: string
  trackingNumber?: string | null
  shippingCarrier?: string | null
  estimatedDelivery?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
  items: OrderItem[]
  user?: {
    id: string
    name: string
    email: string
  } | null
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

interface OrderDetailModalProps {
  order: Order
  onClose: () => void
  onUpdate: (orderId: string, status: string, trackingData?: {
    trackingNumber?: string
    shippingCarrier?: string
    estimatedDelivery?: string
  }) => void
}

function OrderDetailModal({ order, onClose, onUpdate }: OrderDetailModalProps) {
  const [status, setStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [shippingCarrier, setShippingCarrier] = useState(order.shippingCarrier || '')
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''
  )
  const [isUpdating, setIsUpdating] = useState(false)

  // Sync state when order prop changes
  useEffect(() => {
    setStatus(order.status)
    setTrackingNumber(order.trackingNumber || '')
    setShippingCarrier(order.shippingCarrier || '')
    setEstimatedDelivery(
      order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''
    )
  }, [order])

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      await onUpdate(order.id, status, {
        trackingNumber: trackingNumber || undefined,
        shippingCarrier: shippingCarrier || undefined,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery).toISOString() : undefined,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Order Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Customer Information</h3>
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Name:</span>
              <span className="font-medium text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Email:</span>
              <span className="font-medium text-slate-900">{order.customerEmail}</span>
            </div>
            {order.customerPhone && (
              <div className="flex justify-between">
                <span className="text-slate-600">Phone:</span>
                <span className="font-medium text-slate-900">{order.customerPhone}</span>
              </div>
            )}
            {order.user && (
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600">Account:</span>
                <span className="font-medium text-slate-900">{order.user.name} (Registered User)</span>
              </div>
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

        {/* Order Items */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Order Items</h3>
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
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

        {/* Order Status & Tracking */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Order Status & Tracking</h3>
          <div className="bg-slate-50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple bg-white text-slate-900"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tracking Number</label>
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Shipping Carrier</label>
                <Input
                  type="text"
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                  placeholder="e.g., FedEx, UPS, USPS"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Delivery</label>
              <Input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Display existing tracking info */}
            {(order.shippedAt || order.deliveredAt) && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                {order.shippedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipped At:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(order.shippedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Delivered At:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(order.deliveredAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="w-full bg-brand-purple hover:bg-brand-lavender text-white"
              >
                {isUpdating ? 'Updating...' : 'Update Order'}
              </Button>
            </div>
          </div>
        </div>

        {/* Order Dates */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-lg">Order Timeline</h3>
          <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Created:</span>
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fetchOrders = useCallback(async () => {
    try {
      const url = statusFilter ? `/api/orders?status=${statusFilter}` : '/api/orders'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusUpdate = async (orderId: string, newStatus: string, trackingData?: {
    trackingNumber?: string
    shippingCarrier?: string
    estimatedDelivery?: string
  }) => {
    try {
      const updateData: any = { status: newStatus }
      
      if (trackingData) {
        if (trackingData.trackingNumber !== undefined) updateData.trackingNumber = trackingData.trackingNumber || null
        if (trackingData.shippingCarrier !== undefined) updateData.shippingCarrier = trackingData.shippingCarrier || null
        if (trackingData.estimatedDelivery !== undefined) {
          updateData.estimatedDelivery = trackingData.estimatedDelivery ? new Date(trackingData.estimatedDelivery) : null
        }
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        toast.success('Order updated!')
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrder)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
    }
  }

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
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Orders
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple bg-white text-slate-700 font-medium shadow-sm w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-600">Loading orders...</div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">Order ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                    <TableHead className="font-semibold text-slate-700">Items</TableHead>
                    <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Tracking</TableHead>
                    <TableHead className="font-semibold text-slate-700">Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-mono text-sm text-slate-600">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        <div>
                          <div>{order.customerName}</div>
                          <div className="text-xs text-slate-500">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="text-sm">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {order.trackingNumber ? (
                          <div>
                            <div className="font-medium">{order.trackingNumber}</div>
                            {order.shippingCarrier && (
                              <div className="text-xs text-slate-500">{order.shippingCarrier}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedOrder(order)}
                            variant="outline"
                            size="sm"
                            className="border-brand-purple text-brand-purple hover:bg-brand-cream hover:border-brand-lavender"
                          >
                            View
                          </Button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple bg-white text-slate-700 font-medium shadow-sm"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}

