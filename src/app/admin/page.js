// src/app/admin/page.js
'use client';

import Link from 'next/link';
import { FileText, Image, BarChart3, Users, Plus, Crown, Edit2, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard, { AdminOnly, EditorOnly } from '@/components/RoleGuard';
import { hasPermission } from '@/lib/roles';

export default function AdminDashboard() {
  const { user, userRole } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#39FF14]">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back, {user?.email} 
          <span className="ml-2 px-2 py-1 bg-gray-700/50 rounded text-xs capitalize">
            {userRole}
          </span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EditorOnly showFallback={false}>
          <Link
            href="/admin/blog"
            className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 hover:border-[#39FF14]/50 hover:bg-gray-700/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">Articles</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <FileText className="w-8 h-8 text-[#39FF14] group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </EditorOnly>

        <RoleGuard permission="upload_images" showFallback={false}>
          <Link
            href="/admin/images"
            className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 hover:border-[#39FF14]/50 hover:bg-gray-700/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">Images</p>
                <p className="text-2xl font-bold text-white">48</p>
              </div>
              <Image className="w-8 h-8 text-[#39FF14] group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </RoleGuard>

        <AdminOnly showFallback={false}>
          <Link
            href="/admin/users"
            className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 hover:border-[#39FF14]/50 hover:bg-gray-700/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">Users</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
              <Users className="w-8 h-8 text-[#39FF14] group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </AdminOnly>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#39FF14]" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Articles - Available to Editors+ */}
        <EditorOnly showFallback={false}>
          <div className="lg:col-span-2 bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Articles</h2>
              <Link
                href="/admin/blog"
                className="text-[#39FF14] hover:text-[#39FF14]/80 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h3 className="font-medium text-white">Next.js Complete Guide</h3>
                  <p className="text-sm text-gray-400">Published 2 days ago</p>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Published
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h3 className="font-medium text-white">React Hooks Deep Dive</h3>
                  <p className="text-sm text-gray-400">Published 5 days ago</p>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Published
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-white">TypeScript Best Practices</h3>
                  <p className="text-sm text-gray-400">Draft</p>
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                  Draft
                </span>
              </div>
            </div>
          </div>
        </EditorOnly>

        {/* Admin Panel or Quick Actions */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <EditorOnly showFallback={false}>
              <Link
                href="/admin/blog"
                className="flex items-center gap-4 p-4 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg hover:bg-[#39FF14]/20 transition-colors group"
              >
                <div className="p-2 bg-[#39FF14]/20 rounded-lg group-hover:bg-[#39FF14]/30">
                  <Plus className="w-5 h-5 text-[#39FF14]" />
                </div>
                <div>
                  <p className="font-medium text-white">Create New Article</p>
                  <p className="text-sm text-gray-400">Write and publish a new blog post</p>
                </div>
              </Link>
            </EditorOnly>

            <RoleGuard permission="upload_images" showFallback={false}>
              <Link
                href="/admin/images"
                className="flex items-center gap-4 p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-600/30 transition-colors group"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30">
                  <Image className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Upload Images</p>
                  <p className="text-sm text-gray-400">Add images to your media library</p>
                </div>
              </Link>
            </RoleGuard>

            <AdminOnly showFallback={false}>
              <Link
                href="/admin/users"
                className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors group"
              >
                <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30">
                  <Users className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Manage Users</p>
                  <p className="text-sm text-gray-400">Add users and assign roles</p>
                </div>
              </Link>
            </AdminOnly>

            <Link
              href="/articles"
              className="flex items-center gap-4 p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-600/30 transition-colors group"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-white">View Live Site</p>
                <p className="text-sm text-gray-400">See how your blog looks to visitors</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Role-specific information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Permissions */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#39FF14]" />
            <h2 className="text-xl font-semibold text-white">Your Permissions</h2>
          </div>
          
          <div className="space-y-3">
            {userRole === 'admin' && (
              <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-400">Administrator</p>
                  <p className="text-sm text-gray-400">Full system access and user management</p>
                </div>
              </div>
            )}
            
            {hasPermission(userRole, 'create_articles') && (
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium text-blue-400">Content Editor</p>
                  <p className="text-sm text-gray-400">Create and manage articles</p>
                </div>
              </div>
            )}
            
            {hasPermission(userRole, 'upload_images') && (
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Image className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium text-green-400">Media Manager</p>
                  <p className="text-sm text-gray-400">Upload and organize images</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips for your role */}
        <div className="bg-gradient-to-r from-[#39FF14]/10 to-cyan-500/10 border border-[#39FF14]/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-[#39FF14]" />
            <h2 className="text-xl font-semibold text-[#39FF14]">Tips for {userRole}s</h2>
          </div>
          
          <div className="space-y-3 text-sm text-gray-300">
            {userRole === 'admin' && (
              <>
                <div>
                  <h3 className="font-medium text-white mb-1">User Management</h3>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Regularly review user roles and permissions</li>
                    <li>• Create users with appropriate access levels</li>
                    <li>• Monitor system usage and security</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Content Oversight</h3>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Review content before publication</li>
                    <li>• Maintain content quality standards</li>
                    <li>• Backup important data regularly</li>
                  </ul>
                </div>
              </>
            )}
            
            {userRole === 'editor' && (
              <>
                <div>
                  <h3 className="font-medium text-white mb-1">Writing Great Content</h3>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Use descriptive headings for better SEO</li>
                    <li>• Include code examples with proper syntax highlighting</li>
                    <li>• Add alt text to all images for accessibility</li>
                    <li>• Write compelling excerpts to attract readers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Technical Best Practices</h3>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Optimize images before uploading (WebP recommended)</li>
                    <li>• Use consistent slugs for clean URLs</li>
                    <li>• Test your articles in preview mode</li>
                    <li>• Keep content sections organized and logical</li>
                  </ul>
                </div>
              </>
            )}

            {userRole === 'viewer' && (
              <div>
                <h3 className="font-medium text-white mb-1">Making the Most of Read Access</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Review content for quality and consistency</li>
                  <li>• Provide feedback to editors and admins</li>
                  <li>• Stay updated with new publications</li>
                  <li>• Report any issues you notice</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}