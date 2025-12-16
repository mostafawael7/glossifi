'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  totalAmount: string
  status: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    const fetchOrders = async () => {
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
    }
    fetchOrders()
  }, [statusFilter])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Order status updated!')
        fetchOrders()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Orders
        </h1>
        <div className="flex gap-2">
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
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
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
                      <TableCell className="font-medium text-slate-900">{order.customerName}</TableCell>
                      <TableCell className="text-slate-700">{order.customerEmail}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
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
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title="Order Details"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                {selectedOrder.customerPhone && (
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-line">{selectedOrder.shippingAddress}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>Product {item.productId.substring(0, 8)}... x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  handleStatusUpdate(selectedOrder.id, e.target.value)
                  setSelectedOrder({ ...selectedOrder, status: e.target.value })
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

