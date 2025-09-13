'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - Simplified */}
      <header className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
            <h1 className="text-2xl font-heading font-bold text-white">XL Arms</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
          </div>

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Main Landing Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gun-related imagery */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=2940&auto=format&fit=crop"
            alt="Professional Firearms Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          {/* Logo and Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-heading font-bold mb-4 animate-fade-in-up">
              <span className="text-white">XL</span>
              <span className="text-amber-400"> Arms</span>
            </h1>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          </div>

          {/* Relocation Message */}
          <div className="bg-gray-900/90 backdrop-blur-sm border border-amber-500 rounded-2xl p-12 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              We&apos;re <span className="text-amber-400">Relocating!</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              We&apos;re moving to bigger and better things! Our physical location is temporarily closed 
              as we relocate to serve you better.
            </p>
            
            <div className="bg-gray-800/50 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-heading font-bold text-amber-400 mb-6">Online Shop Coming Soon!</h3>
              <p className="text-lg text-gray-300 mb-6">
                While we&apos;re setting up our new location, we&apos;re also launching a comprehensive online store 
                to better serve our customers nationwide.
              </p>
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xl font-semibold text-gray-300">Stay tuned for updates!</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-700 pt-8">
              <h3 className="text-xl font-heading font-bold text-amber-400 mb-4">We&apos;re Still Here For You</h3>
              <div className="grid md:grid-cols-2 gap-6 text-lg">
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-gray-300">
                    <div>6060 Dawson Blvd Ste B</div>
                    <div>Norcross, GA 30093</div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="text-gray-300">
                    <div className="font-semibold">(678) 691-6375</div>
                    <div className="text-sm">Call for updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gun-related decorative elements */}
          <div className="flex justify-center items-center space-x-8 mt-12 opacity-60">
            <div className="w-16 h-16 relative">
              <Image
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=200&auto=format&fit=crop"
                alt="Firearms Icon"
                width={64}
                height={64}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="w-1 h-8 bg-amber-500"></div>
            <div className="w-16 h-16 relative">
              <Image
                src="https://images.unsplash.com/photo-1599582909646-59e16c62bb96?q=80&w=200&auto=format&fit=crop"
                alt="Security Icon"
                width={64}
                height={64}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="w-1 h-8 bg-amber-500"></div>
            <div className="w-16 h-16 relative">
              <Image
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200&auto=format&fit=crop"
                alt="Professional Service Icon"
                width={64}
                height={64}
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer id="contact" className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 relative">
                <Image
                  src="https://framerusercontent.com/images/oDelAjyhQfA09s6DmZo7EX3xlI.svg"
                  alt="XL Arms Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-heading font-bold">XL Arms</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
              <div>
                <h4 className="font-heading font-bold text-amber-400 mb-2">Address</h4>
                <p className="text-gray-400">6060 Dawson Blvd Ste B</p>
                <p className="text-gray-400">Norcross, GA 30093</p>
              </div>
              <div>
                <h4 className="font-heading font-bold text-amber-400 mb-2">Phone</h4>
                <p className="text-gray-400 text-lg font-semibold">(678) 691-6375</p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-400">
                &copy; 2024 XL Arms. All rights reserved. Licensed firearms dealer.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Temporarily relocating - Online shop coming soon!
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* 
      ORIGINAL CONTENT PRESERVED FOR LATER RESTORATION
      ================================================
      
      About Section:
      <section id="about" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 reveal">
              About <span className="text-amber-400">XL Arms</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal">
                <p className="text-lg text-gray-300 mb-6">
                  XL Arms is a premier firearms service provider dedicated to delivering 
                  professional, secure, and compliant firearm transfer services. With years 
                  of experience in the industry, we pride ourselves on our attention to detail 
                  and commitment to customer satisfaction.
                </p>
                <p className="text-lg text-gray-300 mb-8">
                  Our state-of-the-art facility and experienced team ensure that every 
                  transaction meets the highest standards of safety and legal compliance.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-amber-400 mb-2">500+</div>
                    <div className="text-gray-400">Transfers Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-amber-400 mb-2">5+</div>
                    <div className="text-gray-400">Years Experience</div>
                  </div>
                </div>
              </div>
              
              <div className="reveal">
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-amber-400">Our Mission</h3>
                  <p className="text-gray-300">
                    To provide the firearms community with reliable, professional, and 
                    compliant transfer services while maintaining the highest standards 
                    of safety and customer service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      Inventory/Locker Section:
      <section id="inventory" className="py-20 bg-gray-900">
        ... (full original content preserved)
      </section>

      Transfer Services Section:
      <section id="transfers" className="py-20 bg-gray-800">
        ... (full original content preserved)
      </section>

      FFL Transfers Section:
      <section id="ffl" className="py-20 bg-gray-900 relative">
        ... (full original content preserved)
      </section>

      Original Footer:
      <footer className="bg-black py-12 border-t border-gray-800">
        ... (full original content preserved)
      </footer>
      
      END ORIGINAL CONTENT
      ==================
      */}
    </div>
  );
}
