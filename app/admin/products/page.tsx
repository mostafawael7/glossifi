'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  stock: number
  category?: string
  featured: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: '',
    category: '',
    featured: false,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock.toString(),
        category: product.category || '',
        featured: product.featured,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stock: '',
        category: '',
        featured: false,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stock: parseInt(formData.stock),
          featured: formData.featured,
        }),
      })

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product created!')
        fetchProducts()
        handleCloseModal()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product deleted!')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Products
        </h1>
        <Button 
          onClick={() => handleOpenModal()} 
          size="lg"
          className="bg-gradient-to-r from-brand-purple to-brand-lavender hover:from-[#5a4dd1] hover:to-[#9d7aff] shadow-lg"
        >
          + Add Product
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-600">Loading products...</div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">Name</TableHead>
                    <TableHead className="font-semibold text-slate-700">Price</TableHead>
                    <TableHead className="font-semibold text-slate-700">Stock</TableHead>
                    <TableHead className="font-semibold text-slate-700">Category</TableHead>
                    <TableHead className="font-semibold text-slate-700">Featured</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-medium text-slate-900">{product.name}</TableCell>
                      <TableCell className="text-slate-700 font-semibold">{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 20 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : product.stock > 10 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-sm">
                          {product.category || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.featured ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-xs font-semibold shadow-sm">
                            ✓ Featured
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-medium">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleOpenModal(product)}
                            variant="outline"
                            size="sm"
                            className="border-brand-purple text-brand-purple hover:bg-brand-cream hover:border-brand-lavender"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(product.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                          >
                            Delete
                          </Button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Textarea
            label="Description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Image URL"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            />
            <label htmlFor="featured" className="ml-3 text-sm font-medium text-slate-700 cursor-pointer">
              Featured Product
            </label>
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <Button 
              type="submit" 
              size="lg" 
              className="flex-1 bg-gradient-to-r from-brand-purple to-brand-lavender hover:from-[#5a4dd1] hover:to-[#9d7aff] shadow-lg"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="outline"
              size="lg"
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

