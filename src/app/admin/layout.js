// src/app/admin/layout.js
'use client';

import Link from 'next/link';
import { FileText, Image, Settings, Home, LogOut, User, Users } from 'lucide-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import RoleGuard, { AdminOnly } from '@/components/RoleGuard';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function AdminNavigation() {
  const { user, userRole, signOut } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  // Check for permission errors
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'insufficient_permissions') {
      setErrorMessage('You don\'t have permission to access that page.');
      // Clear error after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-[#39FF14] text-xl font-bold">
                Blog Admin
              </Link>
              
              <div className="ml-10 flex items-baseline space-x-8">
                <RoleGuard permissions={['create_articles', 'edit_articles']} showFallback={false}>
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
                </RoleGuard>
                
                <RoleGuard permission="upload_images" showFallback={false}>
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
                </RoleGuard>

                <AdminOnly showFallback={false}>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      pathname?.startsWith('/admin/users')
                        ? 'text-[#39FF14] bg-[#39FF14]/10'
                        : 'text-gray-300 hover:text-[#39FF14]'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Users
                  </Link>
                </AdminOnly>
                
                <RoleGuard permission="access_settings" showFallback={false}>
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
                </RoleGuard>
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
                  <div className="flex flex-col">
                    <span className="text-sm">{user?.email}</span>
                    <span className="text-xs text-gray-400 capitalize">
                      {userRole}
                    </span>
                  </div>
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

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-red-300 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}
    </>
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