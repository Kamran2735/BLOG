"use client";
import React, { useState, useEffect, useRef } from 'react';

const AllArticlesSection = ({ initialActiveTab, onTabChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const sectionRef = useRef(null);

  const articlesPerPage = 9;

    useEffect(() => {
    if (initialActiveTab && initialActiveTab !== activeTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const timeline = [
        { stage: 1, delay: 300 },   // Header
        { stage: 2, delay: 600 },   // Filters & Search
        { stage: 3, delay: 900 },   // Articles grid
        { stage: 4, delay: 1400 }   // Pagination
      ];

      timeline.forEach(({ stage, delay }) => {
        setTimeout(() => setAnimationStage(stage), delay);
      });
    }
  }, [isVisible]);

    const allArticles = [
    {
      id: 1,
      title: "Advanced React Performance Optimization Strategies",
      excerpt: "Deep dive into React performance with virtualization, memoization, and bundle optimization techniques.",
      category: "React",
      author: "Sarah Chen",
      date: "2024-12-18",
      readTime: "12 min",
      likes: 847,
      comments: 23,
      views: "4.2k",
      image: "⚛️",
      difficulty: "Advanced",
      featured: true,
      trending: true
    },
    {
      id: 2,
      title: "TypeScript Design Patterns for Enterprise Applications",
      excerpt: "Learn enterprise-grade TypeScript patterns that scale with your team and codebase.",
      category: "TypeScript",
      author: "Michael Torres",
      date: "2024-12-17",
      readTime: "15 min",
      likes: 623,
      comments: 31,
      views: "3.8k",
      image: "🔷",
      difficulty: "Expert",
      featured: false,
      trending: true
    },
    {
      id: 3,
      title: "Modern CSS Grid: Beyond the Basics",
      excerpt: "Explore advanced CSS Grid techniques that will transform your layout capabilities.",
      category: "CSS",
      author: "Emma Rodriguez",
      date: "2024-12-16",
      readTime: "8 min",
      likes: 456,
      comments: 18,
      views: "2.9k",
      image: "🎨",
      difficulty: "Intermediate",
      featured: false,
      trending: false
    },
    {
      id: 4,
      title: "Building Scalable Node.js Microservices",
      excerpt: "Architecture patterns and best practices for creating maintainable microservices.",
      category: "Backend",
      author: "David Kim",
      date: "2024-12-15",
      readTime: "18 min",
      likes: 534,
      comments: 27,
      views: "3.1k",
      image: "🔧",
      difficulty: "Advanced",
      featured: true,
      trending: false
    },
    {
      id: 5,
      title: "Next.js 14: App Router Deep Dive",
      excerpt: "Master the new App Router with advanced routing patterns and optimization strategies.",
      category: "Next.js",
      author: "Alex Johnson",
      date: "2024-12-14",
      readTime: "14 min",
      likes: 712,
      comments: 19,
      views: "5.2k",
      image: "🚀",
      difficulty: "Advanced",
      featured: false,
      trending: true
    },
    {
      id: 6,
      title: "Web Performance Metrics That Actually Matter",
      excerpt: "Focus on the performance metrics that impact user experience and business outcomes.",
      category: "CSS",
      author: "Lisa Wang",
      date: "2024-12-13",
      readTime: "10 min",
      likes: 389,
      comments: 15,
      views: "2.4k",
      image: "⚡",
      difficulty: "Intermediate",
      featured: false,
      trending: false
    },
    {
      id: 7,
      title: "Creating Smooth CSS Animations",
      excerpt: "Master the art of CSS animations with timing functions, transforms, and performance optimization.",
      category: "Next.js",
      author: "Ryan Kumar",
      date: "2024-12-12",
      readTime: "11 min",
      likes: 445,
      comments: 22,
      views: "2.7k",
      image: "✨",
      difficulty: "Intermediate",
      featured: false,
      trending: false
    },
    {
      id: 8,
      title: "Accessibility Testing Automation",
      excerpt: "Implement automated accessibility testing in your CI/CD pipeline for inclusive web experiences.",
      category: "React",
      author: "Maria Garcia",
      date: "2024-12-11",
      readTime: "13 min",
      likes: 267,
      comments: 12,
      views: "1.8k",
      image: "♿",
      difficulty: "Beginner",
      featured: false,
      trending: false
    },
    {
      id: 9,
      title: "Advanced React Hooks Patterns",
      excerpt: "Custom hooks, composition patterns, and advanced state management techniques.",
      category: "React",
      author: "James Wilson",
      date: "2024-12-10",
      readTime: "16 min",
      likes: 578,
      comments: 25,
      views: "3.5k",
      image: "⚛️",
      difficulty: "Advanced",
      featured: false,
      trending: false
    }
  ];


  // Filter and sort articles
  const filteredArticles = allArticles
    .filter(article => {
      const matchesCategory = activeTab === 'All' || article.category === activeTab;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'popular':
          return b.likes - a.likes;
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'readTime':
          return parseInt(a.readTime) - parseInt(b.readTime);
        default:
          return 0;
      }
    });


// Dynamic categories with correct counts
const categories = [
  { name: 'All', count: filteredArticles.length, icon: '📚' },
  ...['React', 'TypeScript', 'CSS', 'Backend', 'Next.js'].map(category => ({
    name: category,
    count: filteredArticles.filter(article => article.category === category).length,
    icon: category === 'React' ? '⚛️' : 
          category === 'TypeScript' ? '🔷' : 
          category === 'CSS' ? '🎨' : 
          category === 'Backend' ? '🔧' : 
          category === 'Next.js' ? '🚀' : '⚡'
  }))
];




  
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    currentPage * articlesPerPage,
    (currentPage + 1) * articlesPerPage
  );

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsFilterTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setCurrentPage(0);
        setTimeout(() => setIsFilterTransitioning(false), 100);
      }, 300);
    }
  };

  const handleSortChange = (sort) => {
    if (sort !== sortBy) {
      setIsFilterTransitioning(true);
      setTimeout(() => {
        setSortBy(sort);
        setCurrentPage(0);
        setTimeout(() => setIsFilterTransitioning(false), 100);
      }, 300);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-green-600';
      case 'Intermediate': return 'from-yellow-500 to-yellow-600';
      case 'Advanced': return 'from-orange-500 to-orange-600';
      case 'Expert': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(57, 255, 20, 0.1) 50%, transparent 60%),
                           linear-gradient(-45deg, transparent 40%, rgba(30, 144, 255, 0.1) 50%, transparent 60%)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">Complete Collection</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">All</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff] ml-3">
              Articles
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our complete library of {allArticles.length} in-depth articles across {categories.length - 1} categories.
          </p>
        </div>

        {/* Filters & Search */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${
          animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-4 ">
<select
  value={sortBy}
  onChange={(e) => handleSortChange(e.target.value)}
  className="px-8 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all duration-300 cursor-pointer"
>
  <option value="newest">Newest First</option>
  <option value="popular">Most Popular</option>
  <option value="trending">Trending</option>
  <option value="readTime">By Read Time</option>
</select>

            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleTabChange(category.name)}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === category.name
                    ? 'bg-[#39FF14] text-gray-900 scale-105 shadow-lg shadow-[#39FF14]/25'
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-[#39FF14]/50 hover:text-[#39FF14] hover:bg-gray-800/70'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-2">
                  <span className={`transition-transform duration-300 ${
                    activeTab === category.name ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === category.name 
                      ? 'bg-gray-900/30 text-gray-700' 
                      : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className={`mb-8 text-center transition-all duration-500 ${
          isFilterTransitioning ? 'opacity-50' : 'opacity-100'
        }`}>
          <p className="text-gray-400">
            Showing {currentArticles.length} of {filteredArticles.length} articles
            {activeTab !== 'All' && <span> in <span className="text-[#39FF14]">{activeTab}</span></span>}
            {searchQuery && <span> matching "<span className="text-[#39FF14]">{searchQuery}</span>"</span>}
          </p>
        </div>

        {/* Articles Grid */}
        <div className={`transition-all duration-500 ${
          isFilterTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArticles.map((article, index) => (
              <div
                key={article.id}
                onMouseEnter={() => setHoveredCard(article.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-[#39FF14]/50 hover:shadow-xl hover:shadow-[#39FF14]/10 hover:scale-105 transition-all duration-500 cursor-pointer ${
                  animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: animationStage >= 3 ? `${index * 100}ms` : '0ms' 
                }}
              >
                {/* Card Header */}
                <div className="relative p-6">
                  {/* Badges Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gradient-to-r from-[#39FF14] to-[#2ecc71] text-gray-900 text-xs px-3 py-1 rounded-full font-bold">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs px-2 py-1 rounded-full font-bold">
                          ⭐
                        </span>
                      )}
                      {article.trending && (
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🔥
                        </span>
                      )}
                    </div>
                    
                    <div className={`text-3xl transition-all duration-300 ${
                      hoveredCard === article.id ? 'scale-125 rotate-12' : ''
                    }`}>
                      {article.image}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#39FF14] transition-colors duration-300">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Difficulty */}
                  <div className="flex items-center space-x-2 mb-6">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getDifficultyColor(article.difficulty)}`} />
                    <span className="text-xs text-gray-400 font-medium">{article.difficulty}</span>
                  </div>

                  {/* Author & Date */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-[#39FF14]/20 rounded-full flex items-center justify-center">
                        <span className="text-[#39FF14] font-bold text-xs">
                          {article.author.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{article.author}</span>
                    </div>
                    <span>{formatDate(article.date)}</span>
                  </div>

                  {/* Engagement Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1 group-hover:text-red-400 transition-colors duration-200">
                        <span>❤️</span>
                        <span>{article.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 group-hover:text-blue-400 transition-colors duration-200">
                        <span>💬</span>
                        <span>{article.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1 group-hover:text-green-400 transition-colors duration-200">
                        <span>👀</span>
                        <span>{article.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{article.readTime}</span>
                      <span className="text-[#39FF14] group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#39FF14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-center space-x-4 mt-16 transition-all duration-1000 delay-300 ${
            animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="group px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-all duration-300"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-300 inline-block">←</span>
              <span className="ml-2">Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                if (pageNum >= totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-[#39FF14] text-gray-900 scale-110 shadow-lg shadow-[#39FF14]/25'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-[#39FF14] hover:scale-105'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="group px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-all duration-300"
            >
              <span>Next</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('All');
              }}
              className="bg-[#39FF14] text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-[#2ecc71] transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default AllArticlesSection;