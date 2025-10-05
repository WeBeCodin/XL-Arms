'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RSRProduct, RSRProductsResponse } from '@/lib/types/rsr';
import { useCartStore } from '@/lib/store/cart-store';
import Navigation from '@/components/Navigation';

interface ProductCardProps {
  product: RSRProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-amber-500 transition-all duration-300 flex flex-col">
      <Link href={`/store/${product.rsrStockNumber}`} className="block mb-4">
        <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.description}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              onError={() => {
                // Handle image error - could set a state to show placeholder
              }}
            />
          ) : (
            <div className="text-gray-500 text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="space-y-2 flex-grow">
        <Link href={`/store/${product.rsrStockNumber}`}>
          <h3 className="font-semibold text-white line-clamp-2 hover:text-amber-400 transition-colors">{product.description}</h3>
        </Link>
        
        <div className="text-sm text-gray-400">
          <p>SKU: {product.rsrStockNumber}</p>
          {product.manufacturerName && <p>Manufacturer: {product.manufacturerName}</p>}
          {product.model && <p>Model: {product.model}</p>}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="text-sm">
            <p className="text-amber-400 font-semibold text-lg">${product.price.toFixed(2)}</p>
            {product.retailPrice && product.retailPrice > product.price && (
              <p className="text-gray-500 line-through text-xs">MSRP: ${product.retailPrice.toFixed(2)}</p>
            )}
          </div>
          
          <div className="text-sm">
            {product.quantityOnHand > 0 ? (
              <span className="text-green-400 font-semibold">In Stock</span>
            ) : (
              <span className="text-red-400">Out of Stock</span>
            )}
          </div>
        </div>
        
        {product.weight && (
          <p className="text-xs text-gray-500">Weight: {product.weight} lbs</p>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="mt-4">
        {product.quantityOnHand > 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors relative"
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
        ) : (
          <button
            disabled
            className="w-full px-4 py-2 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}

export default function StorePage() {
  const [products, setProducts] = useState<RSRProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  
  const pageSize = 20;

  const fetchProducts = useCallback(async (page: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedManufacturer) params.append('manufacturer', selectedManufacturer);
      if (showInStockOnly) params.append('inStock', 'true');
      
      const response = await fetch(`/api/rsr/products?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const data: RSRProductsResponse = await response.json();
      
      if (reset || page === 1) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }
      
      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
      setCurrentPage(page);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedManufacturer, showInStockOnly, pageSize]);

  useEffect(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(currentPage + 1, false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedManufacturer('');
    setShowInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <Navigation />

      {/* Spacer for fixed navigation */}
      <div className="h-20"></div>

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-white">XL Arms</span>
                <span className="text-amber-400"> Store</span>
              </h1>
              <p className="text-gray-400">Browse our RSR catalog inventory</p>
            </div>
            
            {totalCount > 0 && (
              <div className="text-right">
                <p className="text-2xl font-semibold text-amber-400">{totalCount.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Products Available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search products, SKU, manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="rifles">Rifles</option>
              <option value="handguns">Handguns</option>
              <option value="shotguns">Shotguns</option>
              <option value="accessories">Accessories</option>
            </select>
            
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Manufacturers</option>
              <option value="glock">Glock</option>
              <option value="smith-wesson">Smith & Wesson</option>
              <option value="ruger">Ruger</option>
              <option value="sig-sauer">Sig Sauer</option>
            </select>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500"
              />
              <span>In Stock Only</span>
            </label>
            
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria or clear filters</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.rsrStockNumber} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Loading...
                    </span>
                  ) : (
                    'Load More Products'
                  )}
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-8 text-gray-400">
              <p>
                Showing {products.length} of {totalCount.toLocaleString()} products
                {hasMore && ` • More available`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}