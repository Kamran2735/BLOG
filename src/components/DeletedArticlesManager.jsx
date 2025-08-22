// =====================================
// FILE 4: components/DeletedArticlesManager.js (NEW FILE)
// =====================================

"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar,
  RefreshCw
} from 'lucide-react';

const DeletedArticlesManager = () => {
  const [deletedArticles, setDeletedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDeletedArticles();
  }, []);

  const fetchDeletedArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/deleted-articles');
      if (!response.ok) {
        throw new Error('Failed to fetch deleted articles');
      }
      const data = await response.json();
      setDeletedArticles(data);
    } catch (error) {
      console.error('Error fetching deleted articles:', error);
      alert('Error fetching deleted articles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const restoreArticle = async (deleteId, title) => {
    if (!confirm(`Are you sure you want to restore "${title}"? It will be restored as a draft.`)) {
      return;
    }

    try {
      setActionLoading(deleteId);
      const response = await fetch(`/api/admin/deleted-articles/${deleteId}/restore`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Article restored successfully as draft');
        fetchDeletedArticles();
      } else {
        throw new Error(result.error || 'Failed to restore article');
      }
    } catch (error) {
      console.error('Error restoring article:', error);
      alert('Error restoring article: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const permanentDelete = async (deleteId, title) => {
    if (!confirm(`⚠️ PERMANENT DELETE WARNING ⚠️\n\nAre you absolutely sure you want to permanently delete "${title}"?\n\nThis action CANNOT be undone. The article and all its data will be lost forever.`)) {
      return;
    }

    // Double confirmation for permanent delete
    if (!confirm('Type "DELETE FOREVER" in the next prompt to confirm permanent deletion.')) {
      return;
    }

    const confirmation = prompt('Please type "DELETE FOREVER" to confirm:');
    if (confirmation !== 'DELETE FOREVER') {
      alert('Confirmation text did not match. Deletion cancelled.');
      return;
    }

    try {
      setActionLoading(deleteId);
      const response = await fetch(`/api/admin/deleted-articles/${deleteId}/permanent`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Article permanently deleted');
        fetchDeletedArticles();
      } else {
        throw new Error(result.error || 'Failed to permanently delete article');
      }
    } catch (error) {
      console.error('Error permanently deleting article:', error);
      alert('Error deleting article: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (permanentDeleteAt) => {
    const now = new Date();
    const deleteDate = new Date(permanentDeleteAt);
    const diffTime = deleteDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Published</span>;
    }
    return <span className="px-2 py-1 bg-yellow-600 text-black text-xs rounded">Draft</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-xl">Loading deleted articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#39FF14] mb-2">Deleted Articles</h1>
            <p className="text-gray-400">
              Articles are automatically deleted after 30 days. You can restore them or delete them permanently.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchDeletedArticles}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <span className="text-gray-400">
              {deletedArticles.length} articles in trash
            </span>
          </div>
        </div>

        {deletedArticles.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Trash2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No deleted articles</h2>
            <p className="text-lg">All your articles are safe and sound!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deletedArticles.map((article) => {
              const daysRemaining = getDaysRemaining(article.permanentDeleteAt);
              const isExpiringSoon = daysRemaining <= 7;
              
              return (
                <div 
                  key={article.deleteId} 
                  className={`bg-gray-800/50 border rounded-lg p-6 ${
                    isExpiringSoon ? 'border-red-500/50 bg-red-900/10' : 'border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{article.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(article.status)}
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400">{article.category}</span>
                          </div>
                        </div>
                        {isExpiringSoon && (
                          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Expires in {daysRemaining} days
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>By {article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Deleted: {formatDate(article.deletedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Auto-delete: {formatDate(article.permanentDeleteAt)}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-3">
                        <p><strong>Deleted by:</strong> {article.deletedBy}</p>
                        {article.reason && <p><strong>Reason:</strong> {article.reason}</p>}
                      </div>
                      
                      {article.excerpt && (
                        <p className="text-gray-300 bg-gray-700/30 p-3 rounded border-l-4 border-gray-500">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 ml-6">
                      <button
                        onClick={() => restoreArticle(article.deleteId, article.title)}
                        disabled={actionLoading === article.deleteId}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === article.deleteId ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Restore
                      </button>
                      <button
                        onClick={() => permanentDelete(article.deleteId, article.title)}
                        disabled={actionLoading === article.deleteId}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === article.deleteId ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        Delete Forever
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress bar for deletion countdown */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Days remaining until permanent deletion</span>
                      <span>{daysRemaining}/30 days</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          daysRemaining <= 7 ? 'bg-red-500' :
                          daysRemaining <= 14 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(daysRemaining / 30) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedArticlesManager;