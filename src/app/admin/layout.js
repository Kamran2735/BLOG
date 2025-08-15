// src/app/admin/layout.js
import Link from 'next/link';
import { FileText, Image, Settings, Home } from 'lucide-react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Admin Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-[#39FF14] text-xl font-bold">
                Blog Admin
              </Link>
              
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/admin/blog"
                  className="text-gray-300 hover:text-[#39FF14] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Articles
                </Link>
                
                <Link
                  href="/admin/images"
                  className="text-gray-300 hover:text-[#39FF14] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  Images
                </Link>
                
                <Link
                  href="/admin/settings"
                  className="text-gray-300 hover:text-[#39FF14] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <Link
                href="/"
                className="text-gray-300 hover:text-[#39FF14] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main>
        {children}
      </main>
    </div>
  );
}