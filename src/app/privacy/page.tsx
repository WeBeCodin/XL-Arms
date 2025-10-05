import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="h-20"></div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-8">
          <p className="text-amber-400">
            <strong>Note:</strong> This is a placeholder page. The final privacy policy will be provided by the client and should comply with all applicable privacy laws including GDPR and CCPA where applicable.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Name, email address, phone number, and shipping address</li>
              <li>Government-issued identification for age verification</li>
              <li>Payment information (processed securely through our payment provider)</li>
              <li>FFL dealer information</li>
              <li>Purchase history and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Verify your age and eligibility to purchase firearms</li>
              <li>Comply with federal and state firearms regulations</li>
              <li>Communicate with you about your orders</li>
              <li>Improve our services and customer experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="text-gray-300">
              We share your information with FFL dealers as required for firearm transfers and with law enforcement as required by law. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Record Retention</h2>
            <p className="text-gray-300">
              As required by federal law, we maintain records of all firearm transactions for the periods required by the ATF and other regulatory agencies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: Information about user rights regarding their data, including access, correction, and deletion rights where applicable]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about this privacy policy, please contact us at:
            </p>
            <p className="text-gray-300 mt-2">
              6060 Dawson Blvd Ste B<br />
              Norcross, GA 30093<br />
              Phone: (678) 691-6375
            </p>
          </section>

          <section className="text-sm text-gray-400 italic">
            <p>Last updated: [DATE TO BE PROVIDED]</p>
          </section>
        </div>

        <div className="mt-12">
          <Link 
            href="/store"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
