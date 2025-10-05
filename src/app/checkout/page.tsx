'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/lib/store/cart-store';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

// Form validation schema
const checkoutSchema = z.object({
  // Contact Information
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Shipping Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
  
  // Billing Address (optional if same as shipping)
  billingAddressSame: z.boolean(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  
  // FFL Dealer (for firearms)
  fflRequired: z.boolean().optional(),
  fflDealerName: z.string().optional(),
  fflDealerLicense: z.string().optional(),
  
  // Terms and Conditions
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  
  // Age Verification
  ageVerified: z.boolean().refine((val) => val === true, {
    message: 'You must confirm you are 18 years or older',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billingAddressSame: true,
      agreeToTerms: false,
      ageVerified: false,
      fflRequired: false,
    },
  });

  const billingAddressSame = watch('billingAddressSame');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setShowBillingAddress(!billingAddressSame);
  }, [billingAddressSame]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    // TODO: Integrate with payment gateway (Stripe, Square, etc.)
    // This is where the client's payment provider info will be added
    console.log('Checkout data:', data);
    console.log('Cart items:', items);
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // TODO: Send order to backend
    // TODO: Process payment
    // TODO: Send confirmation email
    // TODO: Update inventory
    
    // For now, just show success and clear cart
    alert('Order placed successfully! (This is a demo - no actual payment was processed)');
    clearCart();
    router.push('/store');
    
    setIsProcessing(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="h-20"></div>
        <div className="container mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-96 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="h-20"></div>
        
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">
              Add items to your cart before proceeding to checkout.
            </p>
            <Link 
              href="/store"
              className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const estimatedTax = subtotal * 0.08; // TODO: Replace with actual tax calculation based on state
  const shippingCost = 0; // TODO: Calculate shipping based on provider and client's shipping rules
  const total = subtotal + estimatedTax + shippingCost;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="h-20"></div>

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <input
                      type="text"
                      {...register('address')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        {...register('city')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <input
                        type="text"
                        {...register('state')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                      {errors.state && (
                        <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Zip Code *</label>
                      <input
                        type="text"
                        {...register('zipCode')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                      {errors.zipCode && (
                        <p className="text-red-400 text-sm mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* FFL Dealer Information (Placeholder) */}
              <div className="bg-gray-800 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h2 className="text-xl font-bold text-amber-400">FFL Dealer Selection</h2>
                    <p className="text-sm text-gray-400 mt-2">
                      Firearms must be shipped to a licensed FFL dealer. You will be able to select your 
                      preferred dealer during order processing. We will contact you to confirm FFL details.
                    </p>
                  </div>
                </div>
                
                {/* Placeholder for FFL selection - will be implemented when client provides FFL database */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-sm text-amber-400">
                    <strong>Coming Soon:</strong> FFL dealer search and selection tool
                  </p>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Billing Address</h2>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('billingAddressSame')}
                      className="rounded border-gray-600 bg-gray-700 text-amber-500"
                    />
                    <span>Same as shipping address</span>
                  </label>
                </div>

                {showBillingAddress && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Billing Address</label>
                      <input
                        type="text"
                        {...register('billingAddress')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          {...register('billingCity')}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <input
                          type="text"
                          {...register('billingState')}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Zip Code</label>
                        <input
                          type="text"
                          {...register('billingZipCode')}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information (Placeholder) */}
              <div className="bg-gray-800 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h2 className="text-xl font-bold text-amber-400">Payment Information</h2>
                    <p className="text-sm text-gray-400 mt-2">
                      Secure payment processing will be available once the payment gateway is configured.
                      Accepted payment methods will include credit/debit cards and other options.
                    </p>
                  </div>
                </div>
                
                {/* Placeholder for payment gateway integration */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-sm text-amber-400">
                    <strong>Integration Ready:</strong> Payment gateway (Stripe/Square) will be configured here
                  </p>
                </div>
              </div>

              {/* Terms and Age Verification */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('ageVerified')}
                      className="mt-1 rounded border-gray-600 bg-gray-700 text-amber-500"
                    />
                    <span className="text-sm">
                      I confirm that I am at least 18 years of age (21+ for handguns). Age verification will be required before shipment.
                    </span>
                  </label>
                  {errors.ageVerified && (
                    <p className="text-red-400 text-sm mt-1">{errors.ageVerified.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('agreeToTerms')}
                      className="mt-1 rounded border-gray-600 bg-gray-700 text-amber-500"
                    />
                    <span className="text-sm">
                      I agree to the <Link href="/terms" className="text-amber-400 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link>. I understand that all firearm purchases are subject to federal and state laws.
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-red-400 text-sm mt-1">{errors.agreeToTerms.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center">
                <Link 
                  href="/cart"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Back to Cart
                </Link>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.rsrStockNumber} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.product.description.substring(0, 40)}...</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Tax</span>
                  <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-sm text-gray-400">TBD</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
