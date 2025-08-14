"use client";
import React, { useState, useEffect, useRef } from 'react';

const CategoriesOverviewSection = ({ onNavigateToArticles }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const categories = [
    {
      id: 1,
      name: "React",
      description: "Modern React patterns, hooks, performance optimization, and ecosystem deep dives.",
      articleCount: 32,
      icon: "⚛️",
      gradient: "from-cyan-500 via-blue-600 to-purple-700",
      recentArticle: "Advanced React Performance Optimization",
      totalReads: "45.2k",
      difficulty: "Intermediate to Advanced",
      trending: true,
      popularity: 95
    },
    {
      id: 2,
      name: "TypeScript",
      description: "Type-safe development, advanced patterns, and enterprise-grade TypeScript architectures.",
      articleCount: 28,
      icon: "🔷",
      gradient: "from-blue-500 via-indigo-600 to-purple-700",
      recentArticle: "TypeScript Design Patterns for 2024",
      totalReads: "38.7k",
      difficulty: "Intermediate to Expert",
      trending: true,
      popularity: 88
    },
    {
      id: 3,
      name: "CSS",
      description: "Modern CSS techniques, animations, grid layouts, and cutting-edge styling approaches.",
      articleCount: 24,
      icon: "🎨",
      gradient: "from-pink-500 via-rose-600 to-red-700",
      recentArticle: "CSS Container Queries in Practice",
      totalReads: "32.1k",
      difficulty: "Beginner to Advanced",
      trending: false,
      popularity: 78
    },
    {
      id: 4,
      name: "Backend",
      description: "Server-side development, APIs, databases, microservices, and scalable architecture patterns.",
      articleCount: 19,
      icon: "🔧",
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
      recentArticle: "Building Scalable Node.js APIs",
      totalReads: "28.9k",
      difficulty: "Advanced to Expert",
      trending: true,
      popularity: 82
    },
    {
      id: 5,
      name: "Next.js",
      description: "Full-stack React framework mastery, App Router, server components, and deployment strategies.",
      articleCount: 15,
      icon: "🚀",
      gradient: "from-violet-500 via-purple-600 to-indigo-700",
      recentArticle: "Next.js 14 App Router Deep Dive",
      totalReads: "41.3k",
      difficulty: "Intermediate to Advanced",
      trending: true,
      popularity: 91
    },
    {
      id: 6,
      name: "Performance",
      description: "Web performance optimization, Core Web Vitals, loading strategies, and speed enhancement techniques.",
      articleCount: 12,
      icon: "⚡",
      gradient: "from-yellow-500 via-orange-600 to-red-700",
      recentArticle: "Web Performance Metrics That Matter",
      totalReads: "25.4k",
      difficulty: "Intermediate",
      trending: false,
      popularity: 73
    }
  ];

  const handleExploreCategory = (categoryName) => {
    // Scroll to all articles section and set the active tab
    if (onNavigateToArticles) {
      onNavigateToArticles(categoryName);
    }
    
    // Alternative: If you want to scroll to a specific section
    const allArticlesSection = document.getElementById('all-articles-section');
    if (allArticlesSection) {
      allArticlesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen flex flex-col justify-center py-20 overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-[#39FF14]/8 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/8 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 tracking-wide">Explore by Topic</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white block mb-2">Content</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] via-cyan-400 to-[#1e90ff]">
              Categories
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover specialized content across {categories.length} expertly curated categories. Each one designed to advance your development skills.
          </p>
        </div>

        {/* Categories Grid with Floating Cards */}
        <div className="relative mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleCategoryClick(category.id)}
                className={`group relative transition-all duration-500 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${
                  hoveredCategory === category.id ? 'z-50 scale-105' : 'z-40'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className={`relative rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
                  selectedCategory === category.id ? 'ring-4 ring-[#39FF14]/50 shadow-[#39FF14]/20' : ''
                }`}>
                  {/* Card with flip effect */}
<div
  className={`relative w-full h-full transition-transform duration-700 ${selectedCategory === category.id ? 'rotate-y-180' : ''}`}
  style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
>

                    {/* Front of card */}
<div
  className={`bg-gradient-to-br ${category.gradient} p-8 relative min-h-[400px] flex flex-col justify-between border border-white/10 rounded-2xl`}
  style={{
    backfaceVisibility: 'hidden',
    pointerEvents: selectedCategory === category.id ? 'none' : 'auto', // Ensure only front side is clickable
  }}
>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="inline-block bg-white/20 text-white text-sm px-4 py-2 rounded-full font-medium">
                                {category.name}
                              </span>
                              {category.trending && (
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full animate-bounce" style={{ animationDuration: '2s' }}>
                                  🔥 HOT
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                              {category.name} Development
                            </h3>
                          </div>
                          <div className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                            {category.icon}
                          </div>
                        </div>

                        <p className="text-white/90 text-base leading-relaxed mb-6">
                          {category.description}
                        </p>

                        {/* Quick stats */}
                        <div className="flex items-center justify-between text-white/80 text-sm mb-6">
                          <div className="flex items-center space-x-1">
                            <span>📚</span>
                            <span>{category.articleCount} articles</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>👀</span>
                            <span>{category.totalReads} reads</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="relative z-10">
                        <button 
                        //   onClick={() => handleExploreCategory(category.name)}
                          className="group w-full bg-[#39FF14] text-gray-900 py-3 rounded-lg text-sm font-bold hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all duration-200"
                        >
                          Click to Explore
                          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Back of card */}
<div 
  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} border border-white/10 rounded-2xl`}
  style={{ 
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
    pointerEvents: selectedCategory === category.id ? 'auto' : 'none', // Back is clickable when visible
  }}
>
  <div className="h-full flex flex-col p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            <span className="text-3xl">{category.icon}</span>
                            <h3 className="text-xl font-bold text-white">{category.name}</h3>
                          </div>
                        </div>

                        {/* Detailed content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="bg-white/10 rounded-lg p-4 mb-4">
                              <div className="text-center">
                                <p className="text-white/70 text-xs mb-1">Latest Article</p>
                                <p className="text-white text-sm font-medium">{category.recentArticle}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center bg-white/10 rounded-lg p-3">
                                <div className="text-2xl font-bold text-white">{category.articleCount}</div>
                                <div className="text-white/70 text-xs">Articles</div>
                              </div>
                              <div className="text-center bg-white/10 rounded-lg p-3">
                                <div className="text-2xl font-bold text-white">{category.totalReads}</div>
                                <div className="text-white/70 text-xs">Total Reads</div>
                              </div>
                            </div>

                            <div className="text-center text-xs text-white/70 mb-4">
                              <span>Difficulty: <span className="text-[#39FF14]">{category.difficulty}</span></span>
                              <br />
                              <span>Popularity: {category.popularity}%</span>
                            </div>
                          </div>

                          {/* CTA */}
 <button
      onClick={(e) => {
        e.stopPropagation();  // Prevent the click from flipping the card
        handleExploreCategory(category.name);  // Ensure this works independently
      }}
      className="w-full bg-[#39FF14] text-gray-900 py-3 rounded-lg text-sm font-bold hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all duration-200 group"
    >
      Explore {category.name}
      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
    </button>
  </div>
</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className={`transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Category Stats */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
              <span className="mr-3">📊</span>
              Content Overview
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#39FF14] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {categories.reduce((total, cat) => total + cat.articleCount, 0)}
                </div>
                <div className="text-sm text-gray-400">Total Articles</div>
              </div>
              
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#39FF14] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
              
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#39FF14] mb-2 group-hover:scale-110 transition-transform duration-300">
                  245k
                </div>
                <div className="text-sm text-gray-400">Total Reads</div>
              </div>
              
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#39FF14] mb-2 group-hover:scale-110 transition-transform duration-300">
                  2.4k
                </div>
                <div className="text-sm text-gray-400">Monthly Readers</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to dive deeper?
              </h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Start your learning journey with any category that sparks your interest.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-[#39FF14] text-gray-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-[#2ecc71] hover:scale-105 hover:shadow-xl hover:shadow-[#39FF14]/25 transition-all duration-300">
                Browse All Categories
                <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
              
              <button className="group border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-all duration-300">
                Get Recommendations
                <span className="ml-3 group-hover:scale-110 transition-transform duration-300">🎯</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
};

export default CategoriesOverviewSection;