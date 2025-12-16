'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  totalAmount: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
        ])

        if (productsRes.ok && ordersRes.ok) {
          const products = await productsRes.json()
          const orders = await ordersRes.json()

          const totalRevenue = orders.reduce(
            (sum: number, order: Order) => sum + parseFloat(order.totalAmount),
            0
          )
          const pendingOrders = orders.filter(
            (order: Order) => order.status === 'PENDING'
          ).length

          setStats({
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue,
            pendingOrders,
          })

          setRecentOrders(orders.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-8">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-brand-purple hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-brand-purple to-brand-lavender rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-lime hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-brand-lime to-[#c8d973] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-lavender hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-brand-lavender to-brand-purple rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-purple hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-slate-900">{stats.pendingOrders}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-brand-purple to-[#5a4dd1] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-brand-cream to-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Recent Orders</h2>
            <Link href="/admin/orders">
              <button className="text-brand-purple hover:text-brand-lavender text-sm font-medium transition-colors">
                View All →
              </button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          {recentOrders.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-gradient-to-r from-brand-cream to-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-cream transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                          order.status === 'PENDING' ? 'bg-brand-lime/20 text-slate-800 border border-brand-lime' :
                          order.status === 'PROCESSING' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple' :
                          order.status === 'SHIPPED' ? 'bg-brand-lavender/20 text-brand-lavender border border-brand-lavender' :
                          order.status === 'DELIVERED' ? 'bg-brand-lime/30 text-slate-800 border border-brand-lime' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

