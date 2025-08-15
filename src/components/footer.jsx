"use client";
import React from 'react';
import { useState } from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import { FaDev } from 'react-icons/fa'; // Dev.to icon



const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState('');

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const categories = [
    { name: 'React & Next.js', href: '#react' },
    { name: 'JavaScript', href: '#javascript' },
    { name: 'Web Performance', href: '#performance' },
    { name: 'UI/UX Design', href: '#design' },
    { name: 'DevOps', href: '#devops' }
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/', icon: <Twitter className="w-5 h-5" /> },
    { name: 'Facebook', href: 'https://facebook.com/', icon: <Facebook className="w-5 h-5" /> },
    { name: 'Linkedin', href: 'https://linkedin.com/', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'Dev', href: 'https://dev.to/', icon: <FaDev className="w-5 h-5" /> },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white"
      style={{
    borderTop: '2px solid transparent', // Required for border-image to work
    borderImage: 'linear-gradient(to right, #39FF14, #1e90ff) 1',
  }}>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 border-b border-gray-800/50">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#39FF14] to-[#1e90ff] rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#39FF14] rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">DevBlog</h3>
                  <div className="text-xs text-gray-400 -mt-1">Tech Insights</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Sharing knowledge through in-depth tutorials, code examples, and insights into modern web development.
              </p>
              
              {/* Social Links */}
<div className="flex space-x-3">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          title={social.name}
          onMouseEnter={() => setHoveredSocial(social.name)}
          onMouseLeave={() => setHoveredSocial('')}
          className={`group p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-400 
            hover:border-[#39FF14]/50 hover:text-[#39FF14] hover:bg-gray-700/30 hover:scale-110 
            transition-all duration-300 ${
              hoveredSocial === social.name ? 'shadow-lg shadow-[#39FF14]/25' : ''
            }`}
        >
          <div className="group-hover:scale-110 transition-transform duration-300 text-lg">
            {social.icon}
          </div>
        </a>
      ))}
    </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300 flex items-center group"
                    >
                      <span className="mr-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Categories</h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <a
                      href={category.href}
                      className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300 flex items-center group"
                    >
                      <span className="mr-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest Stats */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Latest</h4>
              <div className="space-y-4">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 transition-all duration-300 hover:border-[#39FF14]/50 hover:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
                    <div>
                      <p className="text-sm text-gray-300">Latest Article</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 transition-all duration-300 hover:border-[#39FF14]/50 hover:bg-gray-800/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#39FF14]">50+</div>
                    <div className="text-xs text-gray-400">Articles Published</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} DevBlog. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#rss" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                RSS Feed
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;