'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface CustomMugRequest {
  id: string
  userId?: string | null
  name: string
  email: string
  phone?: string | null
  quantity: number
  mugType: string
  personalizationText?: string | null
  designPreferences?: string | null
  imageUrls: string[]
  notes?: string | null
  status: string
  estimatedPrice?: string | null
  adminNotes?: string | null
  user?: {
    id: string
    name: string
    email: string
  } | null
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS = ['PENDING', 'QUOTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

const MUG_TYPE_LABELS: Record<string, string> = {
  THERMAL: 'Thermal',
  PORCELAIN: 'Porcelain',
  MAZZOTTE: 'Mazzotte',
  ICED_COFFEE: 'Iced Coffee',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  QUOTED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

interface CustomMugDetailModalProps {
  request: CustomMugRequest
  onClose: () => void
  onUpdate: (requestId: string, updates: {
    status?: string
    estimatedPrice?: number
    adminNotes?: string
  }) => void
}

function CustomMugDetailModal({ request, onClose, onUpdate }: CustomMugDetailModalProps) {
  const [status, setStatus] = useState(request.status)
  const [estimatedPrice, setEstimatedPrice] = useState(request.estimatedPrice || '')
  const [adminNotes, setAdminNotes] = useState(request.adminNotes || '')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setStatus(request.status)
    setEstimatedPrice(request.estimatedPrice || '')
    setAdminNotes(request.adminNotes || '')
  }, [request])

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      await onUpdate(request.id, {
        status,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined,
        adminNotes: adminNotes || undefined,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Custom Mug Request Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Customer Information</h3>
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p><strong>Name:</strong> {request.name}</p>
            <p><strong>Email:</strong> {request.email}</p>
            {request.phone && <p><strong>Phone:</strong> {request.phone}</p>}
            {request.user && (
              <p className="text-sm text-slate-600">
                <strong>Account:</strong> {request.user.name} ({request.user.email})
              </p>
            )}
          </div>
        </div>

        {/* Request Details */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Request Details</h3>
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p><strong>Mug Type:</strong> {MUG_TYPE_LABELS[request.mugType] || request.mugType}</p>
            <p><strong>Quantity:</strong> {request.quantity}</p>
            {request.personalizationText && (
              <div>
                <strong>Personalization Text:</strong>
                <p className="mt-1 text-slate-700">{request.personalizationText}</p>
              </div>
            )}
            {request.designPreferences && (
              <div>
                <strong>Design Preferences:</strong>
                <p className="mt-1 text-slate-700">{request.designPreferences}</p>
              </div>
            )}
            {request.notes && (
              <div>
                <strong>Additional Notes:</strong>
                <p className="mt-1 text-slate-700">{request.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        {request.imageUrls.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Reference Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {request.imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Reference image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border border-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Management */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Admin Management</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <Input
              label="Estimated Price"
              type="number"
              step="0.01"
              min="0"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
              placeholder="0.00"
            />
            <Textarea
              label="Admin Notes"
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes about this request..."
            />
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-sm text-slate-600">
          <p>Created: {new Date(request.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(request.updatedAt).toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function CustomMugsPage() {
  const [requests, setRequests] = useState<CustomMugRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<CustomMugRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const url = statusFilter
        ? `/api/custom-mug/list?status=${statusFilter}`
        : '/api/custom-mug/list'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        toast.error('Failed to load custom mug requests')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to load custom mug requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  const handleUpdate = async (
    requestId: string,
    updates: {
      status?: string
      estimatedPrice?: number
      adminNotes?: string
    }
  ) => {
    try {
      const response = await fetch(`/api/custom-mug/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        toast.success('Request updated successfully')
        fetchRequests()
        setSelectedRequest(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update request')
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Failed to update request')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Custom Mug Requests</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Button onClick={fetchRequests}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mug Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Est. Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No custom mug requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{MUG_TYPE_LABELS[request.mugType] || request.mugType}</TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[request.status] || 'bg-gray-100 text-gray-800'}`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.estimatedPrice ? formatPrice(parseFloat(request.estimatedPrice)) : '-'}
                      </TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedRequest && (
        <CustomMugDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

