// src/app/admin/blog/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/BlogContentEditor';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminBlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const router = useRouter();

  // Fetch articles
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save article (create or update)
  const handleSaveArticle = async (articleData) => {
    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const url = editingArticle 
        ? `/api/admin/articles/${editingArticle.slug}` 
        : '/api/admin/articles';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        const savedArticle = await response.json();
        
        if (editingArticle) {
          setArticles(articles.map(a => a.slug === editingArticle.slug ? savedArticle : a));
        } else {
          setArticles([savedArticle, ...articles]);
        }
        
        setShowEditor(false);
        setEditingArticle(null);
        alert('Article saved successfully!');
      } else {
        const error = await response.json();
        alert('Error saving article: ' + error.message);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article: ' + error.message);
    }
  };

  // Delete article
  const handleDeleteArticle = async (slug) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/admin/articles/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setArticles(articles.filter(a => a.slug !== slug));
        alert('Article deleted successfully!');
      } else {
        const error = await response.json();
        alert('Error deleting article: ' + error.message);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article: ' + error.message);
    }
  };

  // Start editing
  const handleEditArticle = async (slug) => {
    try {
      const response = await fetch(`/api/admin/articles/${slug}`);
      if (response.ok) {
        const article = await response.json();
        setEditingArticle(article);
        setShowEditor(true);
      }
    } catch (error) {
      console.error('Error fetching article for edit:', error);
    }
  };

  // Create new article
  const handleCreateNew = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  if (showEditor) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setShowEditor(false);
              setEditingArticle(null);
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back to Articles
          </button>
        </div>
        <BlogEditor
          onSave={handleSaveArticle}
          initialData={editingArticle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#39FF14]">Blog Management</h1>
            <p className="text-gray-400 mt-2">Create and manage your blog articles</p>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-[#39FF14] text-black rounded-lg hover:bg-[#39FF14]/80 font-medium"
          >
            <Plus className="w-5 h-5" />
            New Article
          </button>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#39FF14]"></div>
            <p className="mt-4 text-gray-400">Loading articles...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 border border-gray-600 rounded-lg">
                <h3 className="text-xl font-medium text-gray-300 mb-2">No articles yet</h3>
                <p className="text-gray-400 mb-6">Create your first blog article to get started</p>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-[#39FF14] text-black rounded-lg hover:bg-[#39FF14]/80"
                >
                  Create First Article
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {articles.map((article) => (
                  <div
                    key={article.slug}
                    className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {article.title}
                          </h3>
                          <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs font-medium">
                            {article.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>By {article.author}</span>
                          <span>•</span>
                          <span>{article.readingTime}</span>
                          <span>•</span>
                          <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                          {article.article_interactions?.[0] && (
                            <>
                              <span>•</span>
                              <span>{article.article_interactions[0].likes || 0} likes</span>
                              <span>•</span>
                              <span>{article.article_interactions[0].comment_count || 0} comments</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-6">
                        <button
                          onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          title="View Article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEditArticle(article.slug)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteArticle(article.slug)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}