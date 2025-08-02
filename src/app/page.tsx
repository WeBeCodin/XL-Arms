'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    });

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl font-heading">XL</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">XL Arms</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="#inventory" className="hover:text-amber-400 transition-colors">Inventory</a>
            <a href="#transfers" className="hover:text-amber-400 transition-colors">Transfers</a>
            <a href="#ffl" className="hover:text-amber-400 transition-colors">FFL Services</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
          </div>

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 animate-fade-in-up">
            <span className="text-white">XL</span>
            <span className="text-amber-400"> Arms</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Professional Firearms Services & Transfers
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Your trusted partner for firearms transfers, FFL services, and secure inventory management. 
            Licensed, insured, and committed to excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
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

      {/* Inventory/Locker Section */}
      <section id="inventory" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 reveal">
              Secure <span className="text-amber-400">Inventory</span> Management
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 reveal hover:border-amber-500 transition-all duration-300">
                <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">Secure Storage</h3>
                <p className="text-gray-300">
                  State-of-the-art security systems and climate-controlled environment 
                  ensure your firearms are protected at all times.
                </p>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 reveal hover:border-amber-500 transition-all duration-300">
                <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">Digital Records</h3>
                <p className="text-gray-300">
                  Comprehensive digital tracking system maintains detailed records 
                  for all inventory items and transactions.
                </p>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 reveal hover:border-amber-500 transition-all duration-300">
                <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">Quick Access</h3>
                <p className="text-gray-300">
                  Efficient systems allow for rapid processing and retrieval 
                  while maintaining security protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer Services Section */}
      <section id="transfers" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 reveal">
              Transfer <span className="text-amber-400">Services</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal">
                <h3 className="text-3xl font-heading font-bold mb-6">Professional Firearm Transfers</h3>
                <p className="text-lg text-gray-300 mb-6">
                  We handle all types of firearm transfers with precision and care. 
                  Our experienced team ensures every transfer meets federal and state 
                  requirements while providing exceptional customer service.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Background check processing</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Documentation handling</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Compliance verification</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure handling procedures</span>
                  </li>
                </ul>
                
                <button className="btn-primary">Schedule Transfer</button>
              </div>
              
              <div className="reveal">
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-heading font-bold mb-4 text-amber-400">Transfer Fees</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <span>Standard Transfer</span>
                      <span className="font-semibold">$30</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <span>Multiple Item Transfer</span>
                      <span className="font-semibold">$25 each</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <span>NFA Items</span>
                      <span className="font-semibold">$50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Background Check</span>
                      <span className="font-semibold">Included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FFL Transfers Section */}
      <section id="ffl" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12 reveal">
              FFL <span className="text-amber-400">Services</span>
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="reveal">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300">
                  <div className="text-3xl font-heading font-bold text-amber-400 mb-2">01</div>
                  <h3 className="font-heading font-bold mb-2">Licensed Dealer</h3>
                  <p className="text-gray-300 text-sm">Fully licensed Federal Firearms Dealer</p>
                </div>
              </div>
              
              <div className="reveal">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300">
                  <div className="text-3xl font-heading font-bold text-amber-400 mb-2">02</div>
                  <h3 className="font-heading font-bold mb-2">Background Checks</h3>
                  <p className="text-gray-300 text-sm">NICS background check processing</p>
                </div>
              </div>
              
              <div className="reveal">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300">
                  <div className="text-3xl font-heading font-bold text-amber-400 mb-2">03</div>
                  <h3 className="font-heading font-bold mb-2">Documentation</h3>
                  <p className="text-gray-300 text-sm">Complete paperwork and record keeping</p>
                </div>
              </div>
              
              <div className="reveal">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300">
                  <div className="text-3xl font-heading font-bold text-amber-400 mb-2">04</div>
                  <h3 className="font-heading font-bold mb-2">Compliance</h3>
                  <p className="text-gray-300 text-sm">Full federal and state compliance</p>
                </div>
              </div>
            </div>
            
            <div className="reveal">
              <h3 className="text-2xl font-heading font-bold mb-6">Why Choose Our FFL Services?</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                Our FFL services provide peace of mind with professional handling, 
                complete compliance, and exceptional customer service. We make the 
                transfer process smooth and straightforward.
              </p>
              <button className="btn-primary">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg font-heading">XL</span>
                </div>
                <h3 className="text-xl font-heading font-bold">XL Arms</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Professional firearms services and transfers you can trust.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#transfers" className="hover:text-amber-400 transition-colors">Firearm Transfers</a></li>
                <li><a href="#ffl" className="hover:text-amber-400 transition-colors">FFL Services</a></li>
                <li><a href="#inventory" className="hover:text-amber-400 transition-colors">Secure Storage</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Background Checks</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>123 Main Street</p>
                <p>Your City, ST 12345</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@xlarms.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 XL Arms. All rights reserved. Licensed firearms dealer.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
