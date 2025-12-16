'use client'

import React, { useState } from 'react'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real application, you would send this to an API endpoint
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success('Thank you for your message! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="py-12 bg-brand-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-2">Get in Touch</h1>
          <p className="text-slate-600 mb-8">
            Have a question or want to get in touch? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4 text-slate-700">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-purple mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p><strong className="text-slate-900">Email:</strong> contact@glossifi.com</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-purple mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p><strong className="text-slate-900">Phone:</strong> +001 2233 456</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-purple mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>
                    <strong className="text-slate-900">Address:</strong><br />
                    184 Main Street East<br />
                    St Albans VIC 3021, Australia
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Business Hours</h2>
              <div className="space-y-2 text-slate-700">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <Textarea
              label="Message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
            />
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

