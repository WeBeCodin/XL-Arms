import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="h-20"></div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-8">
          <p className="text-amber-400">
            <strong>Note:</strong> This is a placeholder page. Final shipping rates, carriers, and policies will be configured once the client provides their shipping provider details and preferences.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Firearm Shipping</h2>
            <p className="text-gray-300 mb-4">
              All firearms must be shipped to a valid FFL (Federal Firearms License) dealer. We cannot ship firearms directly to individuals.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>You must select an FFL dealer in your area</li>
              <li>We will verify the FFL license before shipping</li>
              <li>You are responsible for any transfer fees charged by the FFL dealer</li>
              <li>Firearms are typically shipped within 1-3 business days of order confirmation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Accessories & Non-Firearm Items</h2>
            <p className="text-gray-300">
              Accessories, ammunition, and other non-firearm items can be shipped directly to your address where permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Shipping Carriers</h2>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: Preferred shipping carriers (UPS, FedEx, USPS), rates, and delivery timeframes]
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-400">
                <strong>Integration Ready:</strong> Shipping provider API (ShipStation, EasyPost, etc.) will be integrated here
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Shipping Costs</h2>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: Shipping cost structure - flat rate, calculated by weight/distance, or free shipping thresholds]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">State Restrictions</h2>
            <p className="text-gray-300 mb-4">
              We comply with all federal and state laws regarding firearms and ammunition shipments. Some items cannot be shipped to certain states or localities due to legal restrictions.
            </p>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: State-by-state shipping restrictions and prohibited items by jurisdiction]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Tracking & Delivery</h2>
            <p className="text-gray-300">
              Once your order ships, you will receive a tracking number via email. All firearm shipments require an adult signature upon delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: International shipping policy, if applicable. Note that international firearm sales are heavily regulated.]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Damaged or Lost Shipments</h2>
            <p className="text-gray-300">
              [CLIENT TO PROVIDE: Policy for handling damaged or lost shipments, including insurance coverage and claim procedures]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-gray-300">
              For shipping inquiries, please contact us at:
            </p>
            <p className="text-gray-300 mt-2">
              6060 Dawson Blvd Ste B<br />
              Norcross, GA 30093<br />
              Phone: (678) 691-6375
            </p>
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
