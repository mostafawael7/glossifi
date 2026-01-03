'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductImage {
  id: string
  url: string
  alt?: string | null
  order: number
}

interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  stock: number
  category?: string | null
  featured: boolean
  images?: ProductImage[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '' as '' | 'THERMAL' | 'PORCELAIN' | 'MAZZOTTE' | 'ICED_COFFEE',
    featured: '' as '' | 'true' | 'false',
    stockStatus: '' as '' | 'in_stock' | 'low_stock' | 'out_of_stock',
  })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: '',
    category: '' as '' | 'THERMAL' | 'PORCELAIN' | 'MAZZOTTE' | 'ICED_COFFEE',
    featured: false,
  })
  const [additionalImages, setAdditionalImages] = useState<Array<{ url: string; alt: string; order: number; file?: File }>>([])
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      // Build query string from filters
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.featured) params.append('featured', filters.featured)
      if (filters.stockStatus) params.append('stockStatus', filters.stockStatus)

      const queryString = params.toString()
      const url = queryString ? `/api/products?${queryString}` : '/api/products'
      
      const response = await fetch(url)
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
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleFilterChange = (name: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      featured: '',
      stockStatus: '',
    })
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
        category: (product.category as any) || '',
        featured: product.featured,
      })
      setMainImageFile(null)
      setMainImagePreview(null)
      // Load additional images
      if (product.images && product.images.length > 0) {
        setAdditionalImages(
          product.images
            .sort((a, b) => a.order - b.order)
            .map((img) => ({
              url: img.url,
              alt: img.alt || '',
              order: img.order,
            }))
        )
        setAdditionalImagePreviews(product.images.map(img => img.url))
      } else {
        setAdditionalImages([])
        setAdditionalImagePreviews([])
      }
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
      setAdditionalImages([])
      setMainImageFile(null)
      setMainImagePreview(null)
      setAdditionalImagePreviews([])
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setAdditionalImages([])
    setMainImageFile(null)
    setMainImagePreview(null)
    setAdditionalImagePreviews([])
  }

  const handleAddImage = () => {
    setAdditionalImages([
      ...additionalImages,
      { url: '', alt: '', order: additionalImages.length },
    ])
    setAdditionalImagePreviews([...additionalImagePreviews, ''])
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, or WEBP)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      setMainImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageFileChange = (index: number, file: File | null) => {
    if (file) {
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, or WEBP)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      const updated = [...additionalImages]
      updated[index] = { ...updated[index], file }
      setAdditionalImages(updated)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const previews = [...additionalImagePreviews]
        previews[index] = reader.result as string
        setAdditionalImagePreviews(previews)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })))
    setAdditionalImagePreviews(additionalImagePreviews.filter((_, i) => i !== index))
  }

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const updated = [...additionalImages]
    updated[index] = { ...updated[index], [field]: value }
    setAdditionalImages(updated)
  }

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === additionalImages.length - 1)
    ) {
      return
    }
    const updated = [...additionalImages]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    updated.forEach((img, i) => {
      img.order = i
    })
    setAdditionalImages(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      // Create FormData for file uploads
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('category', formData.category || '')
      formDataToSend.append('featured', formData.featured.toString())

      // Handle main image: upload file if provided, otherwise use URL
      if (mainImageFile) {
        formDataToSend.append('mainImage', mainImageFile)
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl)
      }

      // Handle additional images: upload files or use URLs
      additionalImages.forEach((img, index) => {
        if (img.file) {
          formDataToSend.append(`additionalImage_${index}`, img.file)
          formDataToSend.append(`additionalImageAlt_${index}`, img.alt || '')
        } else if (img.url.trim()) {
          formDataToSend.append(`additionalImageUrl_${index}`, img.url.trim())
          formDataToSend.append(`additionalImageAlt_${index}`, img.alt || '')
        }
      })

      const response = await fetch(url, {
        method,
        body: formDataToSend,
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
    } finally {
      setIsUploading(false)
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Products
        </h1>
        <Button 
          onClick={() => handleOpenModal()} 
          size="lg"
          className="bg-gradient-to-r from-brand-purple to-brand-lavender hover:from-[#5a4dd1] hover:to-[#9d7aff] shadow-lg w-full sm:w-auto"
        >
          + Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                label="Search by Name"
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              >
                <option value="">All Categories</option>
                <option value="THERMAL">Thermal</option>
                <option value="PORCELAIN">Porcelain</option>
                <option value="MAZZOTTE">Mazzotte</option>
                <option value="ICED_COFFEE">Iced Coffee</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Featured
              </label>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              >
                <option value="">All</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stock Status
              </label>
              <select
                value={filters.stockStatus}
                onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              >
                <option value="">All</option>
                <option value="in_stock">In Stock (&gt;10)</option>
                <option value="low_stock">Low Stock (1-10)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          {(filters.search || filters.category || filters.featured || filters.stockStatus) && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-slate-600 hover:text-slate-900"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-sm text-slate-600">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          {(filters.search || filters.category || filters.featured || filters.stockStatus) && (
            <span className="ml-2">
              (filtered)
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-600">Loading products...</div>
      ) : products.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-slate-600 text-lg">
              {filters.search || filters.category || filters.featured || filters.stockStatus
                ? 'No products match your filters.'
                : 'No products found. Create your first product!'}
            </p>
          </CardContent>
        </Card>
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
                        {product.category ? (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-medium">
                            {product.category.replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                        {product.images && product.images.length > 0 && (
                          <span className="ml-2 text-xs text-slate-500">
                            ({product.images.length} {product.images.length === 1 ? 'image' : 'images'})
                          </span>
                        )}
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
          {/* Main Image - File Upload or URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Upload Image File
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleMainImageChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm"
                />
                {mainImagePreview && (
                  <div className="mt-2">
                    <Image src={mainImagePreview} alt="Preview" width={128} height={128} unoptimized className="h-32 w-32 object-cover rounded-lg border border-slate-300" />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImageFile(null)
                        setMainImagePreview(null)
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <div className="text-center text-xs text-slate-500">OR</div>
              <Input
                label="Image URL (if not uploading file)"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                disabled={!!mainImageFile}
                placeholder="https://example.com/image.jpg"
              />
              {!mainImageFile && !formData.imageUrl && (
                <p className="text-xs text-red-600">Please upload an image file or provide an image URL</p>
              )}
            </div>
          </div>
          
          {/* Additional Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images
              </label>
              <Button
                type="button"
                onClick={handleAddImage}
                variant="outline"
                size="sm"
              >
                + Add Image
              </Button>
            </div>
            {additionalImages.length > 0 && (
              <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-slate-50">
                {additionalImages.map((img, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Image {index + 1} - Upload File
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => handleAdditionalImageFileChange(index, e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm"
                        />
                        {additionalImagePreviews[index] && (
                          <div className="mt-2">
                            <Image src={additionalImagePreviews[index]} alt="Preview" width={96} height={96} unoptimized className="h-24 w-24 object-cover rounded-lg border border-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="text-center text-xs text-slate-500">OR</div>
                      <Input
                        label={`Image ${index + 1} URL (if not uploading file)`}
                        name={`image-${index}-url`}
                        type="url"
                        value={img.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        disabled={!!img.file}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Input
                        label="Alt Text (Optional)"
                        name={`image-${index}-alt`}
                        type="text"
                        value={img.alt}
                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        placeholder="Image description"
                      />
                    </div>
                    <div className="flex flex-col gap-2 pt-6">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, 'down')}
                        disabled={index === additionalImages.length - 1}
                        className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-300 rounded hover:bg-red-100"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="THERMAL">Thermal</option>
              <option value="PORCELAIN">Porcelain</option>
              <option value="MAZZOTTE">Mazzotte</option>
              <option value="ICED_COFFEE">Iced Coffee</option>
            </select>
          </div>
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
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-brand-purple to-brand-lavender hover:from-[#5a4dd1] hover:to-[#9d7aff] shadow-lg"
            >
              {isUploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
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

