'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { RSRProduct } from '@/lib/types/rsr';
import { useCartStore } from '@/lib/store/cart-store';
import Navigation from '@/components/Navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stockNumber = params.stockNumber as string;
  
  const [product, setProduct] = useState<RSRProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Search for the specific product by stock number
        const response = await fetch(`/api/rsr/products?search=${stockNumber}&pageSize=1`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          // Find exact match
          const exactMatch = data.products.find(
            (p: RSRProduct) => p.rsrStockNumber === stockNumber
          );
          
          if (exactMatch) {
            setProduct(exactMatch);
          } else {
            setError('Product not found');
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [stockNumber]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity);
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="h-20"></div>
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="h-20"></div>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H4" />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link 
              href="/store"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors inline-block"
            >
              Back to Store
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

      {/* Breadcrumb */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/store" className="hover:text-amber-400">Store</Link>
            <span>/</span>
            <span className="text-white">{product.rsrStockNumber}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
              {product.imageUrl ? (
                <Image 
                  src={product.imageUrl} 
                  alt={product.description}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.description}</h1>
              {product.manufacturerName && (
                <p className="text-lg text-gray-400">by {product.manufacturerName}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold text-amber-400">
                ${product.price.toFixed(2)}
              </span>
              {product.retailPrice && product.retailPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  MSRP: ${product.retailPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.quantityOnHand > 0 ? (
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-400 font-semibold text-lg">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 font-semibold text-lg">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector and Add to Cart */}
            {product.quantityOnHand > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.quantityOnHand}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantityOnHand, parseInt(e.target.value) || 1)))}
                      className="w-20 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-center focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.quantityOnHand, quantity + 1))}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    {showAddedMessage ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Added to Cart!
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-gray-700 pt-6 space-y-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">SKU:</span>
                  <span className="ml-2 text-white">{product.rsrStockNumber}</span>
                </div>
                {product.upcCode && (
                  <div>
                    <span className="text-gray-400">UPC:</span>
                    <span className="ml-2 text-white">{product.upcCode}</span>
                  </div>
                )}
                {product.model && (
                  <div>
                    <span className="text-gray-400">Model:</span>
                    <span className="ml-2 text-white">{product.model}</span>
                  </div>
                )}
                {product.caliber && (
                  <div>
                    <span className="text-gray-400">Caliber:</span>
                    <span className="ml-2 text-white">{product.caliber}</span>
                  </div>
                )}
                {product.capacity && (
                  <div>
                    <span className="text-gray-400">Capacity:</span>
                    <span className="ml-2 text-white">{product.capacity} rounds</span>
                  </div>
                )}
                {product.action && (
                  <div>
                    <span className="text-gray-400">Action:</span>
                    <span className="ml-2 text-white">{product.action}</span>
                  </div>
                )}
                {product.barrelLength && (
                  <div>
                    <span className="text-gray-400">Barrel Length:</span>
                    <span className="ml-2 text-white">{product.barrelLength}&quot;</span>
                  </div>
                )}
                {product.finish && (
                  <div>
                    <span className="text-gray-400">Finish:</span>
                    <span className="ml-2 text-white">{product.finish}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="text-gray-400">Weight:</span>
                    <span className="ml-2 text-white">{product.weight} lbs</span>
                  </div>
                )}
                {product.countryOfOrigin && (
                  <div>
                    <span className="text-gray-400">Origin:</span>
                    <span className="ml-2 text-white">{product.countryOfOrigin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {(product.warranty || product.safetyFeatures || product.accessories) && (
              <div className="border-t border-gray-700 pt-6 space-y-3">
                {product.warranty && (
                  <div>
                    <h3 className="font-semibold text-amber-400 mb-1">Warranty</h3>
                    <p className="text-sm text-gray-300">{product.warranty}</p>
                  </div>
                )}
                {product.safetyFeatures && (
                  <div>
                    <h3 className="font-semibold text-amber-400 mb-1">Safety Features</h3>
                    <p className="text-sm text-gray-300">{product.safetyFeatures}</p>
                  </div>
                )}
                {product.accessories && (
                  <div>
                    <h3 className="font-semibold text-amber-400 mb-1">Included Accessories</h3>
                    <p className="text-sm text-gray-300">{product.accessories}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back to Store */}
        <div className="mt-12 text-center">
          <Link 
            href="/store"
            className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
