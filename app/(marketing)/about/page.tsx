import React from 'react'

export default function AboutPage() {
  return (
    <div className="py-12 bg-brand-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-6">About Glossifi</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Story</h2>
              <p className="leading-relaxed">
                Glossifi was born from a simple idea: that every moment deserves a beautiful vessel.
                We started with a passion for quality craftsmanship and a vision to bring premium
                mugs into everyday life.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Mission</h2>
              <p className="leading-relaxed">
                Our mission is to create mugs that elevate your daily routine. We believe that
                the right mug can transform a simple cup of coffee into a moment of joy and
                reflection. Every product we create is designed with attention to detail,
                quality materials, and timeless style.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Values</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li><strong>Quality First:</strong> We never compromise on materials or craftsmanship</li>
                <li><strong>Sustainability:</strong> We're committed to environmentally responsible practices</li>
                <li><strong>Customer Focus:</strong> Your satisfaction is our top priority</li>
                <li><strong>Innovation:</strong> We continuously improve and innovate our designs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Why Choose Glossifi?</h2>
              <p className="leading-relaxed">
                When you choose Glossifi, you're choosing more than just a mug. You're choosing
                a piece that will be part of your daily routine, bringing beauty and quality to
                every sip. Our mugs are designed to last, crafted with care, and made to bring
                joy to your everyday moments.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

