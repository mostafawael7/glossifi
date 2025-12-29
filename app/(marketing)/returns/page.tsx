import React from 'react'

export default function ReturnPolicyPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-6 text-center">Return Policy</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Return Eligibility</h2>
              <p className="leading-relaxed">
                We want you to be completely satisfied with your purchase. If you are not happy with your order, you may return it within 30 days of delivery for a full refund or exchange.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Conditions for Returns</h2>
              <p className="leading-relaxed mb-3">To be eligible for a return, your item must:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                <li>Be unused and in its original condition</li>
                <li>Be in the original packaging with all tags attached</li>
                <li>Include proof of purchase (order number or receipt)</li>
                <li>Not be a personalized or custom-made item (unless defective)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How to Return</h2>
              <p className="leading-relaxed mb-3">To initiate a return:</p>
              <ol className="list-decimal list-inside space-y-2 leading-relaxed ml-4">
                <li>Contact us at glossyprint2025@gmail.com or call +201030138275 to request a return authorization</li>
                <li>We will provide you with a return authorization number and shipping instructions</li>
                <li>Package the item securely in its original packaging</li>
                <li>Ship the item back to us using the provided return address</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Refund Process</h2>
              <p className="leading-relaxed mb-3">Once we receive and inspect your returned item:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                <li>We will process your refund within 5-7 business days</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Shipping costs are non-refundable unless the item is defective or we made an error</li>
                <li>You will receive an email confirmation when your refund is processed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Exchanges</h2>
              <p className="leading-relaxed">
                If you need to exchange an item for a different size or color, please contact us. We will process the exchange once we receive your returned item. You will be responsible for return shipping costs unless the item is defective.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Defective Items</h2>
              <p className="leading-relaxed">
                If you receive a defective or damaged item, please contact us immediately. We will arrange for a replacement or full refund, including all shipping costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Contact Us</h2>
              <p className="leading-relaxed">
                For questions about returns or to initiate a return, please contact us:
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

