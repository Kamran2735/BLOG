"use client";
import React, { useState, useEffect, useRef } from 'react';

const ArticlesFeaturedSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  useEffect(() => {
    if (isVisible) {
      const timeline = [
        { stage: 1, delay: 500 },   // Header fade in
        { stage: 2, delay: 800 },   // Cards slide in from sides
        { stage: 3, delay: 1300 },  // Featured article content reveal
        { stage: 4, delay: 1800 }   // Stats and CTA
      ];

      timeline.forEach(({ stage, delay }) => {
        setTimeout(() => setAnimationStage(stage), delay);
      });
    }
  }, [isVisible]);

  const featuredArticles = [
    {
      id: 1,
      title: "Advanced React Performance Optimization",
      excerpt: "Master the art of React performance with advanced techniques including virtualization, memoization strategies, and bundle optimization that can improve your app's speed by 300%.",
      author: "Alex Chen",
      authorRole: "Senior React Developer",
      category: "React",
      readTime: "12 min read",
      date: "Dec 18, 2024",
      likes: 847,
      comments: 23,
      image: "⚛️",
      gradient: "from-purple-600 to-purple-800",
      tags: ["React", "Performance", "Optimization"],
      featured: true,
      difficulty: "Advanced"
    },
    {
      id: 2,
      title: "Building Microservices with Node.js",
      excerpt: "Complete guide to architecting scalable microservices using Node.js, Docker, and Kubernetes. Learn how to handle inter-service communication and maintain data consistency.",
      author: "Sarah Johnson",
      authorRole: "Backend Architect",
      category: "Backend",
      readTime: "18 min read",
      date: "Dec 15, 2024",
      likes: 592,
      comments: 31,
      image: "🏗️",
      gradient: "from-pink-600 to-pink-800",
      tags: ["Node.js", "Microservices", "Docker"],
      featured: false,
      difficulty: "Expert"
    },
    {
      id: 3,
      title: "TypeScript Design Patterns for 2024",
      excerpt: "Explore modern TypeScript design patterns that will make your code more maintainable and type-safe. From advanced generics to conditional types and template literals.",
      author: "Michael Torres",
      authorRole: "TypeScript Evangelist",
      category: "TypeScript",
      readTime: "15 min read",
      date: "Dec 12, 2024",
      likes: 723,
      comments: 18,
      image: "🔷",
      gradient: "from-cyan-600 to-cyan-800",
      tags: ["TypeScript", "Design Patterns", "Advanced"],
      featured: true,
      difficulty: "Intermediate"
    }
  ];

  const handleArticleSelect = (index) => {
    if (index !== selectedArticle && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedArticle(index);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }
  };

  const currentArticle = featuredArticles[selectedArticle];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen py-20 overflow-hidden"
    >


      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">Handpicked Excellence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white block mb-2">Featured</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
              Articles
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Deep dives into cutting-edge web development concepts, curated for developers who want to stay ahead of the curve.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Article Selection Cards */}
          <div className="lg:col-span-4 space-y-6 my-auto">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                onClick={() => handleArticleSelect(index)}
                className={`group relative cursor-pointer transition-all duration-700 ${
                  animationStage >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                } ${
                  selectedArticle === index 
                    ? 'scale-105 shadow-2xl shadow-[#39FF14]/20' 
                    : 'hover:scale-102 hover:shadow-xl hover:shadow-white/10'
                }`}
                style={{ 
                  transitionDelay: animationStage >= 2 ? `${index * 150}ms` : '0ms' 
                }}
              >
                <div className={`relative p-6 rounded-xl border transition-all duration-300 ${
                  selectedArticle === index 
                    ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-[#39FF14]/50' 
                    : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/70'
                } backdrop-blur-sm`}>
                  
                  {/* Selection Indicator */}
                  {selectedArticle === index && (
                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-[#39FF14] to-[#1e90ff] rounded-full" />
                  )}

                  <div className="flex items-start space-x-4">
                    <div className={`text-3xl ${selectedArticle === index ? 'animate-bounce' : ''}`} 
                         style={{ animationDuration: '2s' }}>
                      {article.image}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-[#39FF14] text-xs font-bold uppercase tracking-wide">
                          {article.category}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(article.difficulty)}`} />
                        <span className="text-gray-400 text-xs">{article.difficulty}</span>
                      </div>
                      
                      <h3 className={`font-bold text-sm leading-tight mb-2 transition-colors duration-300 ${
                        selectedArticle === index ? 'text-[#39FF14]' : 'text-white group-hover:text-gray-200'
                      }`}>
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Article Display */}
          <div className="lg:col-span-8">
            <div className={`transition-all duration-700 ${
              animationStage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}>
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}>
                
                {/* Main Article Card */}
                <div className={`bg-gradient-to-br ${currentArticle.gradient} p-8 lg:p-12 min-h-[600px] flex flex-col border border-white/10`}>
                  
                  {/* Article Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        {currentArticle.featured && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            ⭐ FEATURED
                          </span>
                        )}
                        <span className={`w-3 h-3 rounded-full ${getDifficultyColor(currentArticle.difficulty)}`} />
                        <span className="text-white/80 text-sm font-medium">{currentArticle.difficulty}</span>
                      </div>
                      
                      <div className="text-6xl opacity-60 animate-float">
                        {currentArticle.image}
                      </div>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                      {currentArticle.title}
                    </h2>

                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      {currentArticle.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {currentArticle.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="bg-white/20 text-white text-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors duration-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Article Footer */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {currentArticle.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{currentArticle.author}</p>
                          <p className="text-white/70 text-sm">{currentArticle.authorRole}</p>
                        </div>
                      </div>

                      <div className={`flex items-center space-x-6 text-white/80 transition-all duration-700 ${
                        animationStage >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">❤️</span>
                          <span className="text-sm font-medium">{currentArticle.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">💬</span>
                          <span className="text-sm font-medium">{currentArticle.comments}</span>
                        </div>
                        <div className="text-sm">{currentArticle.readTime}</div>
                      </div>
                    </div>

                    <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-200 ${
                      animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <button className="group bg-[#39FF14] text-gray-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all duration-200 flex items-center justify-center">
                        Read Full Article
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">📖</span>
                      </button>
                      
                      <button className="group border-2 border-white/30 text-white px-6 py-4 rounded-lg font-medium hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-all duration-200 flex items-center justify-center">
                        Bookmark
                        <span className="ml-2 group-hover:scale-110 transition-transform duration-200">🔖</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
};

export default ArticlesFeaturedSection;