'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/orders', label: 'Orders' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white min-h-screen shadow-xl">
          <div className="p-6">
            <Link href="/admin/dashboard" className="block mb-8">
              <Image 
                src="/logos/logo-white.png" 
                alt="Glossifi Admin" 
                width={140} 
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-purple to-brand-lavender text-white shadow-lg transform scale-105'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="absolute bottom-0 w-64 p-6 border-t border-slate-700">
            <Button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              variant="outline"
              className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors"
            >
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

