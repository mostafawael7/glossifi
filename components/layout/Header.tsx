'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Cart } from '@/components/product/Cart'
import { AuthModal } from '@/components/auth/AuthModal'

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

interface HeaderProps {
  cartItems?: CartItem[]
  onUpdateCartQuantity?: (id: string, quantity: number) => void
  onRemoveCartItem?: (id: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  cartItems = [],
  onUpdateCartQuantity,
  onRemoveCartItem,
}) => {
  const { data: session } = useSession()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    setIsCartOpen(false)
    window.location.href = '/checkout'
  }

  const handleLoginClick = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
  }

  const handleRegisterClick = () => {
    setAuthMode('register')
    setIsAuthModalOpen(true)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.reload()
  }

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-28 relative">
            <Link href="/" className="flex items-center flex-shrink-0 z-10 md:static absolute left-1/2 transform md:transform-none md:translate-x-0 -translate-x-1/2">
              <Image 
                src="/logos/logo-black.png" 
                alt="Glossifi" 
                width={360} 
                height={128}
                className="h-28 md:h-36 w-auto max-w-[200px] md:max-w-none"
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="text-slate-700 hover:text-brand-purple transition-colors font-semibold text-lg py-2 px-3">
                Home
              </Link>
              <Link href="/products" className="text-slate-700 hover:text-brand-purple transition-colors font-semibold text-lg py-2 px-3">
                Products
              </Link>
              <Link href="/custom-mug" className="text-slate-700 hover:text-brand-purple transition-colors font-semibold text-lg py-2 px-3">
                Custom Mug
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-brand-purple transition-colors font-semibold text-lg py-2 px-3">
                About
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-brand-purple transition-colors font-semibold text-lg py-2 px-3">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-4 flex-shrink-0 ml-auto z-10">
              {session?.user ? (
                <>
                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{session.user.name}</p>
                      <p className="text-xs text-slate-500">{session.user.email}</p>
                    </div>
                  </div>
                  {/* Icons: Cart, Wishlist, Orders, Logout */}
                  <div className="hidden md:flex items-center gap-2">
                    {/* Cart */}
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="relative p-2 text-slate-700 hover:text-brand-purple transition-colors"
                      title="Cart"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {cartItemCount > 0 && (
                        <span className="absolute top-0 right-0 bg-brand-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                    {/* Wishlist */}
                    {session.user.role !== 'admin' && (
                      <Link
                        href="/wishlist"
                        className="p-2 text-slate-700 hover:text-brand-purple transition-colors"
                        title="Wishlist"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </Link>
                    )}
                    {/* Orders */}
                    {session.user.role !== 'admin' && (
                      <Link
                        href="/orders"
                        className="p-2 text-slate-700 hover:text-brand-purple transition-colors"
                        title="My Orders"
                      >
                        <svg
                          className="w-6 h-6"
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
                      </Link>
                    )}
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Logout"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop Login/Register Buttons */}
                  <div className="hidden md:flex items-center gap-3">
                    <Button
                      variant="secondary"
                      onClick={handleLoginClick}
                      size="sm"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleRegisterClick}
                      size="sm"
                    >
                      Sign Up
                    </Button>
                  </div>
                </>
              )}
              {/* Hamburger Menu Button - Mobile Only */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-brand-purple transition-colors z-20"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white">
              <nav className="px-4 py-4 space-y-2">
                <Link
                  href="/"
                  onClick={handleMobileLinkClick}
                  className="block px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors font-semibold"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={handleMobileLinkClick}
                  className="block px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors font-semibold"
                >
                  Products
                </Link>
                <Link
                  href="/custom-mug"
                  onClick={handleMobileLinkClick}
                  className="block px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors font-semibold"
                >
                  Custom Mug
                </Link>
                <Link
                  href="/about"
                  onClick={handleMobileLinkClick}
                  className="block px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors font-semibold"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={handleMobileLinkClick}
                  className="block px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors font-semibold"
                >
                  Contact
                </Link>
                {session?.user && (
                  <>
                    <div className="border-t border-slate-200 my-2"></div>
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold text-slate-900">{session.user.name}</p>
                      <p className="text-xs text-slate-500">{session.user.email}</p>
                    </div>
                  </>
                )}
                <div className="border-t border-slate-200 my-2"></div>
                {/* Cart, Wishlist, Orders, Logout */}
                <button
                  onClick={() => {
                    handleMobileLinkClick()
                    setIsCartOpen(true)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors relative"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-brand-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                {session?.user && session.user.role !== 'admin' && (
                  <>
                    <Link
                      href="/wishlist"
                      onClick={handleMobileLinkClick}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Wishlist
                    </Link>
                    <Link
                      href="/orders"
                      onClick={handleMobileLinkClick}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                      My Orders
                    </Link>
                  </>
                )}
                {session?.user && (
                  <button
                    onClick={() => {
                      handleMobileLinkClick()
                      handleLogout()
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                )}
                {!session?.user && (
                  <>
                    <div className="border-t border-slate-200 my-2"></div>
                    <button
                      onClick={() => {
                        handleMobileLinkClick()
                        handleLoginClick()
                      }}
                      className="w-full px-4 py-2 text-center text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-lg transition-colors font-semibold"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        handleMobileLinkClick()
                        handleRegisterClick()
                      }}
                      className="w-full px-4 py-2 text-center bg-brand-purple text-white hover:bg-brand-lavender rounded-lg transition-colors font-semibold"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={onUpdateCartQuantity || (() => {})}
        onRemoveItem={onRemoveCartItem || (() => {})}
        onCheckout={handleCheckout}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  )
}

