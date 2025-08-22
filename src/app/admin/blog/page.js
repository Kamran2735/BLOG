// =====================================
// FILE: app/admin/articles/page.js  (UPDATED)
// =====================================

"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import Link from "next/link";
import BlogEditor from "@/components/BlogContentEditor";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, published, draft
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // inline editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null); // null = create

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/articles");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      alert("Error fetching articles: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // -------- inline create/edit flow ----------
  const handleCreateNew = () => {
    setEditingArticle(null); // create mode
    setShowEditor(true);
  };

  const handleEditArticle = async (slug) => {
    try {
      const res = await fetch(`/api/admin/articles/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch article");
      const article = await res.json();
      setEditingArticle(article);
      setShowEditor(true);
    } catch (e) {
      console.error("Error fetching article for edit:", e);
      alert("Error opening editor: " + e.message);
    }
  };

  const handleSaveArticle = async (articleData) => {
    try {
      const method = editingArticle ? "PUT" : "POST";
      const url = editingArticle
        ? `/api/admin/articles/${editingArticle.slug}`
        : "/api/admin/articles";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Failed to save article");

      // merge into list
      if (editingArticle) {
        setArticles((prev) =>
          prev.map((a) => (a.slug === editingArticle.slug ? payload : a))
        );
      } else {
        setArticles((prev) => [payload, ...prev]);
      }

      setShowEditor(false);
      setEditingArticle(null);
      alert("Article saved successfully!");
    } catch (e) {
      console.error("Error saving article:", e);
      alert("Error saving article: " + e.message);
    }
  };

  const handleBackFromEditor = () => {
    setShowEditor(false);
    setEditingArticle(null);
    // optional: refresh to reflect server-side transforms like slugging
    fetchArticles();
  };
  // ------------------------------------------

  const handleDelete = async (slug, title) => {
    const reason = prompt(`Why are you deleting "${title}"? (Optional)`);
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? It will be moved to trash and automatically deleted in 30 days.`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(slug);
      const response = await fetch(`/api/admin/articles/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reason || "",
          deletedBy: "admin",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Article moved to trash successfully");
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
      } else {
        throw new Error(result.error || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Error deleting article: " + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean))),
  ];

  const filteredArticles = articles.filter((article) => {
    const safe = (s) => (typeof s === "string" ? s : "");
    const matchesSearch =
      safe(article.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safe(article.author).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safe(article.excerpt).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || article.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) =>
    status === "published" ? (
      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">
        Published
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-600 text-black text-xs rounded font-medium">
        Draft
      </span>
    );

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  // ----- Inline editor view -----
  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackFromEditor}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ← Back to Articles
            </button>
            <div className="text-sm text-gray-400">
              {editingArticle ? "Editing article" : "Create new article"}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
            <BlogEditor onSave={handleSaveArticle} initialData={editingArticle} />
          </div>
        </div>
      </div>
    );
  }

  // ----- List view -----
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-xl">Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#39FF14] mb-2">
              Manage Articles
            </h1>
            <p className="text-gray-400">
              {filteredArticles.length} of {articles.length} articles
              {statusFilter !== "all" && ` (${statusFilter})`}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/deleted-articles">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                <Trash2 className="w-4 h-4" />
                View Trash
              </button>
            </Link>

            {/* CHANGED: no Link; open inline editor */}
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-6 py-2 bg-[#39FF14] text-black rounded hover:bg-[#39FF14]/80"
            >
              <Plus className="w-4 h-4" />
              New Article
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#39FF14] focus:outline-none"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <button
              onClick={fetchArticles}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "No articles match your filters"
                : "No articles yet"}
            </h2>
            <p className="text-lg mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first article to get started"}
            </p>
            {!searchTerm &&
              statusFilter === "all" &&
              categoryFilter === "all" && (
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-[#39FF14] text-black rounded-lg hover:bg-[#39FF14]/80"
                >
                  Create First Article
                </button>
              )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id || article.slug}
                className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusBadge(article.status)}
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{article.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>By {article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Published: {formatDate(article.publishedDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span>{article.readingTime || "—"}</span>
                      </div>
                    </div>

                    {article.excerpt && (
                      <p className="text-gray-300 bg-gray-700/30 p-3 rounded border-l-4 border-gray-500 mb-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Article Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span>👍 {article.article_interactions?.[0]?.likes || 0}</span>
                      <span>❤️ {article.article_interactions?.[0]?.hearts || 0}</span>
                      <span>😂 {article.article_interactions?.[0]?.laughs || 0}</span>
                      <span>
                        💬 {article.article_interactions?.[0]?.comment_count || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 ml-6">
                    {article.status === "published" && (
                      <Link href={`/articles/${article.slug}`} target="_blank">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
                          <Eye className="w-4 h-4" />
                          View Live
                        </button>
                      </Link>
                    )}

                    {/* CHANGED: Edit opens inline editor */}
                    <button
                      onClick={() => handleEditArticle(article.slug)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(article.slug, article.title)}
                      disabled={deleteLoading === article.slug}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                      {deleteLoading === article.slug ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
