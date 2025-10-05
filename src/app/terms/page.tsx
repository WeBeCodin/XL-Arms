import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="h-20"></div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-8">
          <p className="text-amber-400">
            <strong>Note:</strong> This is a placeholder page. The final terms and conditions will be provided by the client and should be reviewed by legal counsel before going live.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Firearms Sales Regulations</h2>
            <p className="text-gray-300 mb-4">
              All firearm sales are subject to federal, state, and local laws. By purchasing firearms from XL Arms, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Comply with all applicable federal, state, and local firearms laws</li>
              <li>Complete all required background checks and paperwork</li>
              <li>Be legally eligible to purchase and possess firearms</li>
              <li>Provide valid government-issued identification</li>
              <li>Complete the transaction through a licensed FFL dealer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Age Requirements</h2>
            <p className="text-gray-300">
              You must be at least 18 years of age to purchase rifles, shotguns, and ammunition. You must be at least 21 years of age to purchase handguns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Shipping and Transfer</h2>
            <p className="text-gray-300">
              All firearms will be shipped to a valid FFL dealer of your choice. You are responsible for ensuring your selected FFL dealer is valid and will accept the transfer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Returns and Refunds</h2>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: Return policy details, restocking fees, and conditions for returns]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: Liability limitations and disclaimers]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
            <p className="text-gray-300">
              For questions about these terms, please contact us at:
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
