// src/app/admin/layout.js
'use client';

import Link from 'next/link';
import { FileText, Image, Settings, Home, LogOut, User } from 'lucide-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { usePathname } from 'next/navigation';

function AdminNavigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
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
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                  pathname?.startsWith('/admin/blog')
                    ? 'text-[#39FF14] bg-[#39FF14]/10'
                    : 'text-gray-300 hover:text-[#39FF14]'
                }`}
              >
                <FileText className="w-4 h-4" />
                Articles
              </Link>
              
              <Link
                href="/admin/images"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                  pathname?.startsWith('/admin/images')
                    ? 'text-[#39FF14] bg-[#39FF14]/10'
                    : 'text-gray-300 hover:text-[#39FF14]'
                }`}
              >
                <Image className="w-4 h-4" />
                Images
              </Link>
              
              <Link
                href="/admin/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                  pathname?.startsWith('/admin/settings')
                    ? 'text-[#39FF14] bg-[#39FF14]/10'
                    : 'text-gray-300 hover:text-[#39FF14]'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-[#39FF14] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              View Site
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AdminLayoutContent({ children }) {
  const pathname = usePathname();
  
  // Don't show navigation on login page
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 pt-20">
        <AdminNavigation />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}