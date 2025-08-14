"use client";
import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 50);
        
        // Calculate scroll progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/articles' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#39FF14] to-[#1e90ff] rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#39FF14] rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DevBlog</h1>
              <div className="text-xs text-gray-400 -mt-1">Tech Insights</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-gray-300 hover:text-[#39FF14] transition-all duration-300 font-medium group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#39FF14] to-[#1e90ff] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* Desktop CTA */}
            <a
              href="#subscribe"
              className="hidden md:inline-flex bg-[#39FF14] text-gray-900 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20"
            >
              Subscribe
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-300 hover:text-[#39FF14] transition-colors duration-300 p-2"
            >
              <div className="w-6 h-6 relative">
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-0'
                  }`}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 translate-y-2.5 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ${
                    isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 pb-6' 
              : 'max-h-0 opacity-0 pb-0'
          }`}
        >
          <nav className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mt-4">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 hover:text-[#39FF14] transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-700/50"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-700/50">
                <a
                  href="#subscribe"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-[#39FF14] text-gray-900 text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-[#2ecc71]"
                >
                  Subscribe to Newsletter
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-[#39FF14] to-[#1e90ff] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
};

export default Header;