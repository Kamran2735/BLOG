// =====================================
// FILE 14: app/admin/deleted-articles/page.js (NEW FILE)
// =====================================

"use client";
import React from 'react';
import DeletedArticlesManager from '@/components/DeletedArticlesManager';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DeletedArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/admin/articles">
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <DeletedArticlesManager />
    </div>
  );
}