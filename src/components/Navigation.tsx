'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart-store';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = mounted ? getTotalItems() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 relative">
              <Image
                src="https://framerusercontent.com/images/oDelAjyhQfA09s6DmZo7EX3xlI.svg"
                alt="XL Arms Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white">
              XL <span className="text-amber-400">Arms</span>
            </h1>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <Link href="/store" className="hover:text-amber-400 transition-colors">
              Store
            </Link>
            <Link href="/about" className="hover:text-amber-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">
              Contact
            </Link>
          </div>

          {/* Cart Icon */}
          <Link 
            href="/cart"
            className="relative flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
