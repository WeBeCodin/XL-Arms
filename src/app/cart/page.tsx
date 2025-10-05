'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart-store';
import Navigation from '@/components/Navigation';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="h-20"></div>
        <div className="container mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const estimatedTax = totalPrice * 0.08; // Placeholder - will need client's tax calculation
  const estimatedTotal = totalPrice + estimatedTax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="h-20"></div>
        
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <svg className="w-24 h-24 text-gray-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">
              Looks like you haven&apos;t added any products to your cart yet.
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="h-20"></div>

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.rsrStockNumber} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link 
                    href={`/store/${item.product.rsrStockNumber}`}
                    className="flex-shrink-0 w-24 h-24 bg-gray-700 rounded-lg overflow-hidden relative"
                  >
                    {item.product.imageUrl ? (
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.description}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link href={`/store/${item.product.rsrStockNumber}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-amber-400 transition-colors">
                        {item.product.description}
                      </h3>
                    </Link>
                    
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>SKU: {item.product.rsrStockNumber}</p>
                      {item.product.manufacturerName && (
                        <p>Manufacturer: {item.product.manufacturerName}</p>
                      )}
                      {item.product.model && (
                        <p>Model: {item.product.model}</p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <label className="text-sm text-gray-400">Qty:</label>
                        <button
                          onClick={() => updateQuantity(item.product.rsrStockNumber, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.product.quantityOnHand}
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1;
                            updateQuantity(item.product.rsrStockNumber, newQty);
                          }}
                          className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.product.rsrStockNumber, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantityOnHand}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-400">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.rsrStockNumber)}
                      className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove from cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Tax</span>
                  <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Estimated Total</span>
                  <span className="font-bold text-amber-400">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-center transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link 
                href="/store"
                className="block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg text-center transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Important Notice */}
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-400">
                  <strong>Important:</strong> Firearms will be shipped to your selected FFL dealer. 
                  Age verification and background check required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
