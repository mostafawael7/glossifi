'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
  featured?: boolean
  createdAt?: string
}

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const [featuredRes, allRes] = await Promise.all([
        fetch('/api/products?featured=true'),
        fetch('/api/products')
      ])
      
      if (featuredRes.ok) {
        const featured = await featuredRes.json()
        setFeaturedProducts(featured.slice(0, 4))
      }
      
      if (allRes.ok) {
        const all = await allRes.json()
        // Sort by creation date for new arrivals
        const sorted = all.sort((a: Product, b: Product) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        setAllProducts(sorted)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Added to cart!')
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-purple via-brand-lavender to-brand-purple text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-lg md:text-xl mb-4 text-white/90 font-medium">
              Your mug... Your design... Your personal touch
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to Glossifi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 italic">
              Every sip has a story
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="shadow-xl">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-purple">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-slate-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-slate-600">Customer service always available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">30-Day Returns</h3>
              <p className="text-sm text-slate-600">Hassle-free returns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-slate-600">100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Collections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Shop Our Collections</h2>
            <p className="text-slate-600">Find your own taste</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Thermal', description: 'Keep your drinks hot' },
              { name: 'Porcelain', description: 'Elegant and refined' },
              { name: 'Mazzotte', description: 'Italian craftsmanship' },
              { name: 'Iced Coffee', description: 'Perfect for cold drinks' },
            ].map((category) => (
              <Link key={category.name} href={`/products?category=${category.name}`}>
                <div className="bg-gradient-to-br from-brand-cream to-white rounded-xl p-8 text-center hover:shadow-lg transition-all border-2 border-transparent hover:border-brand-purple cursor-pointer group">
                  <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple/20 transition-colors">
                    <svg className="w-10 h-10 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Products</h2>
            <p className="text-slate-600">What you like</p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} onAddToCart={handleAddToCart} />
          )}
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">New Arrivals</h2>
            <p className="text-slate-600">Check out our latest additions</p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : (
            <ProductGrid products={allProducts.slice(0, 4)} onAddToCart={handleAddToCart} />
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Sellers</h2>
            <p className="text-slate-600">Our most popular mugs</p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : (
            <ProductGrid products={featuredProducts.slice(0, 4)} onAddToCart={handleAddToCart} />
          )}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Customers' Opinions</h2>
            <p className="text-slate-600">Get to know us better</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', text: 'Amazing quality! The mugs are beautiful and durable. Highly recommend!', rating: 5 },
              { name: 'John D.', text: 'Fast shipping and excellent customer service. Love my new mug collection!', rating: 5 },
              { name: 'Emily R.', text: 'Perfect gift for coffee lovers. The design is stunning and the quality is top-notch.', rating: 5 },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-brand-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-slate-900">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Gifts Section */}
      <section className="py-16 bg-gradient-to-br from-brand-purple/10 to-brand-lavender/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Special Gifts... Printed Specifically for Your Loved Ones
          </h2>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Create personalized mugs that tell a story. Perfect for birthdays, anniversaries, or just because.
          </p>
          <Link href="/products">
            <Button size="lg" className="shadow-xl">
              Explore Custom Options
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

