import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-200 bg-slate-50', className)} {...props}>
      {children}
    </div>
  )
}

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-200 bg-slate-50', className)} {...props}>
      {children}
    </div>
  )
}

