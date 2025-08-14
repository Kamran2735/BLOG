"use client";
import React, { useState, useEffect, useRef } from 'react';

const FeaturedArticlesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // New state to track hover status
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate featured article every 5 seconds with flip animation
  useEffect(() => {
    if (isVisible && !isHovered) {
      const interval = setInterval(() => {
        setIsFlipping(true);
        setTimeout(() => {
          setActiveCard((prev) => (prev + 1) % featuredArticles.length);
          setIsFlipping(false);
        }, 300);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isHovered]); // Re-run the effect when isHovered changes

  const handleCardClick = (index) => {
    if (index !== activeCard) {
      setIsFlipping(true);
      setTimeout(() => {
        setActiveCard(index);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true); // Set hover state to true when the mouse enters
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Set hover state to false when the mouse leaves
  };

  const featuredArticles = [
    {
      id: 1,
      title: "Building Scalable React Applications",
      excerpt: "Learn advanced patterns and techniques for creating maintainable React apps that can grow with your business needs.",
      category: "React",
      readTime: "8 min read",
      date: "Dec 15, 2024",
      image: "⚛️",
      color: "from-purple-600 to-purple-800",
      accent: "purple",
      isPopular: true
    },
    {
      id: 2,
      title: "Next.js 14: Performance Optimization",
      excerpt: "Deep dive into the latest Next.js features and how to optimize your applications for lightning-fast performance.",
      category: "Next.js",
      readTime: "12 min read",
      date: "Dec 10, 2024",
      image: "🚀",
      color: "from-cyan-600 to-cyan-800",
      accent: "blue",
      isPopular: false
    },
    {
      id: 3,
      title: "TypeScript Best Practices 2024",
      excerpt: "Essential TypeScript patterns every developer should know to write safer and more maintainable code.",
      category: "TypeScript",
      readTime: "10 min read",
      date: "Dec 5, 2024",
      image: "📝",
      color: "from-pink-600 to-pink-800",
      accent: "green",
      isPopular: true
    }
  ];

  const recentArticles = [
    {
      title: "Mastering CSS Grid Layout",
      category: "CSS",
      readTime: "6 min",
      date: "Dec 12, 2024",
      trending: true
    },
    {
      title: "Advanced React Hooks Patterns",
      category: "React",
      readTime: "9 min",
      date: "Dec 8, 2024",
      trending: false
    },
    {
      title: "Node.js Microservices Architecture",
      category: "Backend",
      readTime: "15 min",
      date: "Dec 3, 2024",
      trending: true
    }
  ];

  const currentArticle = featuredArticles[activeCard];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen flex flex-col justify-center overflow-hidden py-20"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Latest Insights</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Featured</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff] ml-3">Articles</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore cutting-edge insights and advanced techniques in modern web development.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Featured Article */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative group">
              <div
                className={`relative w-full rounded-xl shadow-2xl overflow-hidden transition-all duration-600 ${isFlipping ? 'rotateX-90' : 'rotateX-0'}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Featured Article Content */}
                <div className={`bg-gradient-to-br ${currentArticle.color} p-8 lg:p-10 relative min-h-[500px] flex flex-col justify-between border border-white/10`}>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors duration-200 cursor-default">
                            {currentArticle.category}
                          </span>
                          {currentArticle.isPopular && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full animate-bounce cursor-default" style={{ animationDuration: '2s' }}>
                              🔥 FEATURED
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight cursor-default">
                          {currentArticle.title}
                        </h3>
                      </div>
                      <div className="text-5xl lg:text-6xl opacity-60 ml-4 animate-bounce cursor-default" style={{ animationDuration: '3s' }}>
                        {currentArticle.image}
                      </div>
                    </div>

                    <p className="text-white/90 text-base lg:text-lg leading-relaxed mb-8 max-w-2xl cursor-default">
                      {currentArticle.excerpt}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-white/80 text-sm cursor-default">
                      <span>{currentArticle.date}</span>
                      <span>•</span>
                      <span>{currentArticle.readTime}</span>
                    </div>
                    
                    <button className="group relative bg-[#39FF14] text-gray-900 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all duration-200 cursor-pointer">
                      <span className="relative z-10">Read Article</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 relative z-10">→</span>
                      <div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles Sidebar */}
<div className="space-y-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}">
  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
    <h3 className="text-xl font-bold text-white mb-6 flex items-center cursor-default">
      <div className="w-2 h-2 bg-[#39FF14] rounded-full mr-3 animate-pulse" />
      Recent Articles
    </h3>

    <div className="space-y-4">
      {recentArticles.map((article, index) => (
        <div
          key={index}
          className={`group relative p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg hover:border-[#39FF14]/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#39FF14] text-xs font-medium uppercase tracking-wide">
                {article.category}
              </span>
              {article.trending && (
                <span
                  className="text-xs text-white px-2 rounded-full font-semibold flex items-center space-x-2"
                  style={{
                    background: 'linear-gradient(45deg, #FF4500, #FF6347, #FFD700)', // Fire-like gradient
                    color: '#fff', // White text for contrast
                  }}
                >
                  <span role="img" aria-label="fire">🔥</span> {/* Fire emoji */}
                  HOT
                </span>
              )}
            </div>
            <span className="text-gray-400 text-xs">{article.readTime}</span>
          </div>
          <h4 className="text-white font-medium text-sm mb-2 group-hover:text-[#39FF14] transition-colors duration-300 leading-tight">
            {article.title}
          </h4>
          <p className="text-gray-400 text-xs">{article.date}</p>
        </div>
      ))}
    </div>

    {/* View All Button */}
    <button className="group w-full mt-6 border-2 border-gray-600 text-gray-300 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20 cursor-pointer">
      <span className="flex items-center justify-center">
        View All Articles
        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
      </span>
    </button>
  </div>
</div>

        </div>
      </div>

      {/* Custom CSS for 3D flip animation */}
      <style jsx>{`
        .rotateX-0 {
          transform: rotateX(0deg);
        }
        
        .rotateX-90 {
          transform: rotateX(90deg);
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
};

export default FeaturedArticlesSection;
