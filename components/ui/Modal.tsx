'use client'

import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-xl shadow-2xl w-full mx-4 border border-slate-200',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-6 bg-white">{children}</div>
      </div>
    </div>
  )
}

