import React from 'react'

export default function TermsOfServicePage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-lavender bg-clip-text text-transparent mb-6 text-center">Terms of Service</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing or using the Glossifi website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Use License</h2>
              <p className="leading-relaxed mb-3">Permission is granted to temporarily access the materials on Glossifi&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Product Information</h2>
              <p className="leading-relaxed">
                We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free. If a product offered by us is not as described, your sole remedy is to return it in unused condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Pricing and Payment</h2>
              <p className="leading-relaxed mb-3">All prices are listed in the currency displayed on the website. We reserve the right to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                <li>Change prices at any time without prior notice</li>
                <li>Refuse or cancel any order at our discretion</li>
                <li>Limit quantities purchased per person, per household, or per order</li>
                <li>Require additional verification before processing an order</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Shipping and Delivery</h2>
              <p className="leading-relaxed">
                We will make every effort to deliver products within the estimated timeframe. However, delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall Glossifi or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Glossifi&apos;s website, even if Glossifi or a Glossifi authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Revisions and Errata</h2>
              <p className="leading-relaxed">
                The materials appearing on Glossifi&apos;s website could include technical, typographical, or photographic errors. Glossifi does not warrant that any of the materials on its website are accurate, complete, or current. Glossifi may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
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

