// src/app/admin/page.js
import Link from 'next/link';
import { FileText, Image, BarChart3, Users, Plus } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Blog administration dashboard',
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#39FF14]">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your blog administration panel</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#39FF14]" />
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Comments</p>
              <p className="text-2xl font-bold text-white">89</p>
            </div>
            <Users className="w-8 h-8 text-[#39FF14]" />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
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

        {/* Quick Actions */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
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

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-[#39FF14]/10 to-cyan-500/10 border border-[#39FF14]/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#39FF14] mb-4">💡 Tips for Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h3 className="font-medium text-white mb-2">Writing Great Content</h3>
            <ul className="space-y-1 text-gray-400">
              <li>• Use descriptive headings for better SEO</li>
              <li>• Include code examples with proper syntax highlighting</li>
              <li>• Add alt text to all images for accessibility</li>
              <li>• Write compelling excerpts to attract readers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-white mb-2">Technical Best Practices</h3>
            <ul className="space-y-1 text-gray-400">
              <li>• Optimize images before uploading (WebP recommended)</li>
              <li>• Use consistent slugs for clean URLs</li>
              <li>• Test your articles in preview mode</li>
              <li>• Keep content sections organized and logical</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}