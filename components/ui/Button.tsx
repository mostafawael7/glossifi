import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-brand-purple text-white hover:bg-[#5a4dd1] focus:ring-brand-purple shadow-lg hover:shadow-xl transition-all',
    secondary: 'bg-brand-lime text-slate-900 hover:bg-[#c8d973] focus:ring-brand-lime font-semibold',
    outline: 'border-2 border-brand-purple text-brand-purple hover:bg-brand-cream focus:ring-brand-purple',
    ghost: 'text-slate-700 hover:bg-brand-cream focus:ring-brand-purple',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

