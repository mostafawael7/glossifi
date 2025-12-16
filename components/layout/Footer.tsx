'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Thank you for subscribing!')
      setEmail('')
    }
  }

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-brand-lavender to-brand-purple bg-clip-text text-transparent">
              Glossifi
            </h3>
            <p className="text-slate-400 mb-4">
              Premium mugs for your everyday moments.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <p>184 Main Street East, St Albans VIC 3021, Australia</p>
              <p>contact@glossifi.com</p>
              <p>+001 2233 456</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Information</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/" className="hover:text-brand-lavender transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-lavender transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-lavender transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-lavender transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Policies</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-brand-lavender transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-brand-lavender transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-lavender transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Newsletter</h4>
            <p className="text-slate-400 mb-4 text-sm">
              Subscribe to our newsletter for updates and special offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-lavender rounded-lg hover:from-brand-lavender hover:to-brand-purple transition-all font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Glossifi. All rights reserved. Powered by Glossifi</p>
        </div>
      </div>
    </footer>
  )
}

