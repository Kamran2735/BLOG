"use client";
import React, { useEffect, useState } from 'react';
import { Clock, Eye, Heart, MessageCircle, ArrowRight, Sparkles, TrendingUp, Calendar, User } from 'lucide-react';

const normalize = v => (v ?? '').toString().trim().toLowerCase();

export default function RelatedArticles({ currentCategory, currentSlug, articles = [] }) {
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const list = Array.isArray(articles) ? articles : [];
    const filtered = list
      .filter(a => normalize(a.category) === normalize(currentCategory) && a.slug !== currentSlug)
      .sort((a, b) => new Date(b.publishedDate || b.date) - new Date(a.publishedDate || a.date))
      .slice(0, 3);

    setRelatedArticles(filtered);

    // Staged reveal animation
    setIsVisible(true);
    const t1 = setTimeout(() => setAnimationStage(1), 300);
    const t2 = setTimeout(() => setAnimationStage(2), 600);
    const t3 = setTimeout(() => setAnimationStage(3), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [articles, currentCategory, currentSlug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      react: 'from-cyan-500 to-cyan-600',
      css: 'from-purple-500 to-purple-600',
      javascript: 'from-yellow-500 to-yellow-600',
      typescript: 'from-blue-500 to-blue-600',
      'next.js': 'from-violet-500 to-violet-600',
      'node.js': 'from-green-500 to-green-600',
      design: 'from-pink-500 to-pink-600',
      backend: 'from-emerald-500 to-emerald-600',
      animation: 'from-purple-500 to-purple-600',
      'build tools': 'from-orange-500 to-orange-600',
      a11y: 'from-pink-500 to-pink-600',
      api: 'from-indigo-500 to-indigo-600',
      architecture: 'from-teal-500 to-teal-600',
    };
    return colors[normalize(category)] || 'from-gray-500 to-gray-600';
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Empty state with enhanced styling
  if (relatedArticles.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="lg:grid lg:grid-cols-1 lg:gap-12">
            <article className="prose prose-invert prose-lg max-w-none">
              <div className="mb-12">
                <div className="relative">
                  
                  <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
                    <div className="flex items-center justify-center mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-[#39FF14]/20 to-cyan-500/20 rounded-xl border border-[#39FF14]/30">
                          <Sparkles className="w-6 h-6 text-[#39FF14]" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#39FF14] to-cyan-400 bg-clip-text text-transparent">
                          Related Articles
                        </h2>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Sparkles className="w-16 h-16 text-[#39FF14]/30 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Related Articles Found</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        No other articles found in <span className="text-[#39FF14] font-medium">{currentCategory}</span> category yet.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent rounded-full opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  // Main component with aligned styling
  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="lg:grid lg:grid-cols-1 lg:gap-12">
          <article className="prose prose-invert prose-lg max-w-none">
            <div className="mb-12">
              <div className="relative">                
                <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                  {/* Section Header */}
                  <div className={`mb-8 transition-all duration-1000 ${
                    animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="flex items-center justify-center mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-[#39FF14]/20 to-cyan-500/20 rounded-xl border border-[#39FF14]/30">
                          <TrendingUp className="w-6 h-6 text-[#39FF14]" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#39FF14] to-cyan-400 bg-clip-text text-transparent">
                          Related Articles
                        </h2>
                      </div>
                    </div>
                    
                    <div className="text-center mb-8">
                      <p className="text-gray-300 leading-relaxed text-lg">
                        More insights in <span className="text-[#39FF14] font-medium">{currentCategory}</span> category
                      </p>
                    </div>
                  </div>

                  {/* Articles Grid */}
                  <div className={`mb-8 transition-all duration-1000 delay-300 ${
                    animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="space-y-6">
                      {relatedArticles.map((article, index) => (
                        <div
                          key={article.slug || article.id || index}
                          onMouseEnter={() => setHoveredCard(article.slug || article.id || index)}
                          onMouseLeave={() => setHoveredCard(null)}
                          className={`group relative transition-all duration-500 ${
                            hoveredCard === (article.slug || article.id || index) 
                              ? 'transform scale-[1.02]' 
                              : ''
                          }`}
                          style={{ transitionDelay: animationStage >= 2 ? `${index * 150}ms` : '0ms' }}
                        >
                          <div className="bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-[#39FF14]/30 hover:shadow-lg hover:shadow-[#39FF14]/10">
                            <div className="p-6">
                              {/* Article Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category)}`}>
                                    {article.category}
                                  </div>
                                  {article.isNew && (
                                    <div className="px-2 py-1 bg-[#39FF14] text-gray-900 rounded-full text-xs font-bold animate-pulse">
                                      NEW
                                    </div>
                                  )}
                                  {article.trending && (
                                    <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-bold flex items-center space-x-1">
                                      <span>🔥</span><span>HOT</span>
                                    </div>
                                  )}
                                </div>
                                <div className={`text-2xl transition-all duration-300 ${
                                  hoveredCard === (article.slug || article.id || index) 
                                    ? 'scale-110 rotate-12' 
                                    : ''
                                }`}>
                                  {article.image || article.emoji || '📄'}
                                </div>
                              </div>

                              {/* Article Content */}
                              <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#39FF14] transition-colors duration-300 line-clamp-2">
                                {article.title}
                              </h4>
                              <p className="text-gray-300 leading-relaxed mb-6 line-clamp-2 text-lg">
                                {article.excerpt || article.description || ''}
                              </p>

                              {/* Enhanced Meta Info */}
                              <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2 hover:text-[#39FF14] transition-colors duration-300">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">{article.author || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 hover:text-[#39FF14] transition-colors duration-300">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(article.publishedDate || article.date)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 hover:text-[#39FF14] transition-colors duration-300">
                                  <Clock className="w-4 h-4" />
                                  <span>{article.readingTime || article.readTime || '5 min'}</span>
                                </div>
                              </div>

                              {/* Enhanced Engagement Stats */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6 text-sm text-gray-400">
                                  <div className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300 cursor-pointer group/stat">
                                    <Heart className="w-4 h-4 group-hover/stat:scale-110 transition-transform duration-200" />
                                    <span>{formatNumber(article.likes ?? Math.floor(Math.random() * 200))}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-300 cursor-pointer group/stat">
                                    <MessageCircle className="w-4 h-4 group-hover/stat:scale-110 transition-transform duration-200" />
                                    <span>{formatNumber(article.comments ?? Math.floor(Math.random() * 50))}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 hover:text-green-400 transition-colors duration-300 cursor-pointer group/stat">
                                    <Eye className="w-4 h-4 group-hover/stat:scale-110 transition-transform duration-200" />
                                    <span>{formatNumber(article.views ?? Math.floor(Math.random() * 1000))}</span>
                                  </div>
                                </div>

                                <a 
                                  href={`/articles/${article.slug}`} 
                                  className="group/link bg-gray-800/50 border border-gray-700/50 text-[#39FF14] px-4 py-2 rounded-lg font-medium hover:border-[#39FF14]/50 hover:bg-gray-700/30 transition-all duration-300 flex items-center space-x-2"
                                >
                                  <span>Read Article</span>
                                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                                </a>
                              </div>
                            </div>

                            {/* Subtle separator line */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
                          </div>

                          {/* Glow effect for hovered items */}
                          {hoveredCard === (article.slug || article.id || index) && (
                            <div className="absolute inset-0 -z-10  rounded-xl blur-xl opacity-50 pointer-events-none"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View All Section */}
                  <div className={`text-center transition-all duration-1000 delay-600 ${
                    animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Want to explore more?</h4>
                        <p className="text-gray-400 text-sm">Discover all articles in this category</p>
                      </div>
                      
                      <a
                        href={`/categories/${encodeURIComponent(currentCategory)}`}
                        className="group bg-[#39FF14] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#2ecc71] transition-colors duration-300 flex items-center space-x-2"
                      >
                        <span>Explore All {currentCategory}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>
                    </div>
                  </div>

                  {/* Bottom decorative element */}
                  <div className="flex justify-center mt-8">
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}


