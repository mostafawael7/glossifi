'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function VerifyOTPPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // Redirect to register if no email
      router.push('/register')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Account created successfully! Please log in with your password.')
        router.push('/login?registered=true')
      } else {
        toast.error(data.error || 'Invalid verification code')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('Failed to verify code. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'New verification code sent!')
        setCountdown(60) // 60 second cooldown
      } else {
        toast.error(data.error || 'Failed to resend code')
      }
    } catch (error) {
      console.error('Error resending OTP:', error)
      toast.error('Failed to resend verification code')
    } finally {
      setIsResending(false)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only numbers, max 6 digits
    setOtp(value)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-2">
            Verify Your Email
          </h1>
          <p className="text-slate-600">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-slate-900 font-semibold mt-1">{email}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enter Verification Code
            </label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength={6}
              required
              className="text-center text-2xl font-mono tracking-widest"
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-2">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <Button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            size="lg"
            className="w-full"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Create Account'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-slate-600 mb-3">
              Didn&apos;t receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="w-full"
            >
              {isResending
                ? 'Sending...'
                : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend Code'}
            </Button>
          </div>

          <div className="text-center text-sm text-slate-600 pt-4 border-t border-slate-200">
            <Link href="/register" className="text-brand-purple hover:text-brand-lavender font-semibold">
              Back to Registration
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

