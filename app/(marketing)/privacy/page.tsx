import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-6 text-center">Privacy Policy</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                At Glossifi, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
              <p className="leading-relaxed mb-3">We may collect information about you in a variety of ways. The information we may collect includes:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                <li><strong>Personal Data:</strong> Name, email address, phone number, shipping address, and billing information</li>
                <li><strong>Payment Information:</strong> Credit card numbers and payment details (processed securely through our payment providers)</li>
                <li><strong>Usage Data:</strong> Information about how you access and use our website</li>
                <li><strong>Device Information:</strong> IP address, browser type, and device identifiers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and our products</li>
                <li>Improve our website and customer experience</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
              <p className="leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Contact Us</h2>
              <p className="leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="leading-relaxed mt-2">
                <strong>Email:</strong> glossyprint2025@gmail.com<br />
                <strong>Phone:</strong> +201030138275
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

