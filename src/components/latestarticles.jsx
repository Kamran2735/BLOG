// "use client";
// import React, { useState, useEffect, useRef } from 'react';

// const LatestArticlesSection = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [animationStage, setAnimationStage] = useState(0);
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const sectionRef = useRef(null);

//   const articlesPerPage = 6;

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !isVisible) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, [isVisible]);

//   useEffect(() => {
//     if (isVisible) {
//       const timeline = [
//         { stage: 1, delay: 300 },   // Header animation
//         { stage: 2, delay: 600 },   // Stats cards
//         { stage: 3, delay: 900 },   // Articles grid cascade
//         { stage: 4, delay: 1400 }   // Load more button
//       ];

//       timeline.forEach(({ stage, delay }) => {
//         setTimeout(() => setAnimationStage(stage), delay);
//       });
//     }
//   }, [isVisible]);

//   const latestArticles = [
//     {
//       id: 1,
//       title: "Modern CSS Grid Techniques You Should Know in 2024",
//       excerpt: "Explore advanced CSS Grid layouts that will revolutionize your responsive design workflow.",
//       category: "CSS",
//       author: "Emma Rodriguez",
//       date: "2 hours ago",
//       readTime: "7 min read",
//       likes: 234,
//       comments: 12,
//       views: "1.2k",
//       image: "🎨",
//       isNew: true,
//       trending: true,
//       difficulty: "Intermediate"
//     },
//     {
//       id: 2,
//       title: "React Server Components: A Deep Dive",
//       excerpt: "Understanding the paradigm shift with React Server Components and their impact on full-stack development.",
//       category: "React",
//       author: "David Kim",
//       date: "5 hours ago",
//       readTime: "12 min read",
//       likes: 567,
//       comments: 28,
//       views: "3.4k",
//       image: "⚛️",
//       isNew: true,
//       trending: false,
//       difficulty: "Advanced"
//     },
//     {
//       id: 3,
//       title: "Building Scalable APIs with Node.js and TypeScript",
//       excerpt: "Best practices for creating maintainable and type-safe backend services that can handle millions of requests.",
//       category: "Backend",
//       author: "Sarah Chen",
//       date: "1 day ago",
//       readTime: "15 min read",
//       likes: 423,
//       comments: 19,
//       views: "2.8k",
//       image: "🔧",
//       isNew: false,
//       trending: true,
//       difficulty: "Expert"
//     },
//     {
//       id: 4,
//       title: "The Future of Web Animation: CSS vs JavaScript",
//       excerpt: "Comparing modern animation techniques and when to use CSS animations versus JavaScript libraries.",
//       category: "Animation",
//       author: "Michael Torres",
//       date: "2 days ago",
//       readTime: "9 min read",
//       likes: 345,
//       comments: 15,
//       views: "1.9k",
//       image: "✨",
//       isNew: false,
//       trending: false,
//       difficulty: "Intermediate"
//     },
//     {
//       id: 5,
//       title: "Mastering Webpack 5: Advanced Configuration",
//       excerpt: "Deep dive into Webpack 5's new features and optimization techniques for faster build times.",
//       category: "Build Tools",
//       author: "Alex Johnson",
//       date: "3 days ago",
//       readTime: "18 min read",
//       likes: 289,
//       comments: 22,
//       views: "1.5k",
//       image: "📦",
//       isNew: false,
//       trending: false,
//       difficulty: "Advanced"
//     },
//     {
//       id: 6,
//       title: "Accessibility in Modern Web Development",
//       excerpt: "Creating inclusive web experiences with ARIA, semantic HTML, and automated testing strategies.",
//       category: "A11y",
//       author: "Lisa Wang",
//       date: "4 days ago",
//       readTime: "11 min read",
//       likes: 412,
//       comments: 17,
//       views: "2.1k",
//       image: "♿",
//       isNew: false,
//       trending: true,
//       difficulty: "Beginner"
//     },
//     {
//       id: 7,
//       title: "GraphQL vs REST: When to Use What in 2024",
//       excerpt: "A comprehensive comparison of GraphQL and REST APIs with real-world implementation examples.",
//       category: "API",
//       author: "James Wilson",
//       date: "5 days ago",
//       readTime: "14 min read",
//       likes: 378,
//       comments: 31,
//       views: "2.7k",
//       image: "🔗",
//       isNew: false,
//       trending: false,
//       difficulty: "Intermediate"
//     },
//     {
//       id: 8,
//       title: "Micro-Frontends: Architecture for Scale",
//       excerpt: "Breaking down monolithic frontends into manageable, independently deployable micro-applications.",
//       category: "Architecture",
//       author: "Maria Garcia",
//       date: "6 days ago",
//       readTime: "20 min read",
//       likes: 234,
//       comments: 25,
//       views: "1.8k",
//       image: "🏗️",
//       isNew: false,
//       trending: false,
//       difficulty: "Expert"
//     },
//     {
//       id: 9,
//       title: "Next.js 14: App Router Best Practices",
//       excerpt: "Leveraging the new App Router architecture for better performance and developer experience.",
//       category: "Next.js",
//       author: "Ryan Kumar",
//       date: "1 week ago",
//       readTime: "16 min read",
//       likes: 523,
//       comments: 42,
//       views: "4.1k",
//       image: "🚀",
//       isNew: false,
//       trending: true,
//       difficulty: "Advanced"
//     }
//   ];

//   const totalPages = Math.ceil(latestArticles.length / articlesPerPage);
//   const currentArticles = latestArticles.slice(
//     currentPage * articlesPerPage, 
//     (currentPage + 1) * articlesPerPage
//   );

//   const handlePageChange = (newPage) => {
//     if (newPage !== currentPage && !isTransitioning) {
//       setIsTransitioning(true);
//       setTimeout(() => {
//         setCurrentPage(newPage);
//         setTimeout(() => setIsTransitioning(false), 100);
//       }, 300);
//     }
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'Beginner': return 'from-green-500 to-green-600';
//       case 'Intermediate': return 'from-yellow-500 to-yellow-600';
//       case 'Advanced': return 'from-orange-500 to-orange-600';
//       case 'Expert': return 'from-red-500 to-red-600';
//       default: return 'from-gray-500 to-gray-600';
//     }
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       'CSS': 'from-blue-500 to-blue-600',
//       'React': 'from-cyan-500 to-cyan-600',
//       'Backend': 'from-emerald-500 to-emerald-600',
//       'Animation': 'from-purple-500 to-purple-600',
//       'Build Tools': 'from-orange-500 to-orange-600',
//       'A11y': 'from-pink-500 to-pink-600',
//       'API': 'from-indigo-500 to-indigo-600',
//       'Architecture': 'from-teal-500 to-teal-600',
//       'Next.js': 'from-violet-500 to-violet-600'
//     };
//     return colors[category] || 'from-gray-500 to-gray-600';
//   };

//   const stats = [
//     { label: "Total Articles", value: "142", icon: "📚" },
//     { label: "This Month", value: "18", icon: "📅" },
//     { label: "Total Reads", value: "89.2k", icon: "👀" },
//     { label: "Active Readers", value: "2.4k", icon: "👥" }
//   ];

//   return (
//     <section 
//       ref={sectionRef}
//       className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-20 overflow-hidden"
//     >

//       <div className="relative max-w-7xl mx-auto px-6">
//         {/* Section Header */}
//         <div className={`text-center mb-16 transition-all duration-1000 ${
//           animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//         }`}>
//           <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3 mb-8">
//             <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
//             <span className="text-sm text-gray-300 font-medium">Fresh Content</span>
//           </div>
          
//           <h2 className="text-4xl md:text-6xl font-bold mb-6">
//             <span className="text-white">Latest</span>
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff] ml-3">
//               Articles
//             </span>
//           </h2>
          
//           <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//             Stay updated with the newest insights, tutorials, and deep dives in modern web development.
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 ${
//           animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//         }`}>
//           {stats.map((stat, index) => (
//             <div
//               key={stat.label}
//               className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-[#39FF14]/50 hover:bg-gray-800/50 transition-all duration-300 cursor-default"
//               style={{ transitionDelay: `${index * 100}ms` }}
//             >
//               <div className="text-center">
//                 <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
//                   {stat.icon}
//                 </div>
//                 <div className="text-2xl font-bold text-[#39FF14] mb-1 group-hover:scale-105 transition-transform duration-300">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-gray-400">{stat.label}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Articles Grid */}
//         <div className={`transition-all duration-500 ${
//           isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
//         }`}>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {currentArticles.map((article, index) => (
//               <div
//                 key={article.id}
//                 onMouseEnter={() => setHoveredCard(article.id)}
//                 onMouseLeave={() => setHoveredCard(null)}
//                 className={`group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-[#39FF14]/50 hover:shadow-2xl hover:shadow-[#39FF14]/10 hover:scale-105 transition-all duration-500 cursor-pointer ${
//                   animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//                 }`}
//                 style={{ 
//                   transitionDelay: animationStage >= 3 ? `${index * 100}ms` : '0ms' 
//                 }}
//               >
//                 {/* Card Header */}
//                 <div className="relative p-6 pb-4">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center space-x-2">
//                       <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category)}`}>
//                         {article.category}
//                       </div>
//                       {article.isNew && (
//                         <div className="px-2 py-1 bg-[#39FF14] text-gray-900 rounded-full text-xs font-bold animate-pulse">
//                           NEW
//                         </div>
//                       )}
//                       {article.trending && (
//                         <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-bold flex items-center space-x-1">
//                           <span>🔥</span>
//                           <span>HOT</span>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className={`text-3xl transition-transform duration-300 ${
//                       hoveredCard === article.id ? 'scale-110 rotate-12' : ''
//                     }`}>
//                       {article.image}
//                     </div>
//                   </div>

//                   {/* Title */}
//                   <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#39FF14] transition-colors duration-300">
//                     {article.title}
//                   </h3>

//                   {/* Excerpt */}
//                   <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
//                     {article.excerpt}
//                   </p>

//                   {/* Difficulty Badge */}
//                   <div className="flex items-center space-x-2 mb-4">
//                     <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getDifficultyColor(article.difficulty)}`} />
//                     <span className="text-xs text-gray-400 font-medium">{article.difficulty}</span>
//                   </div>
//                 </div>

//                 {/* Card Footer */}
//                 <div className="px-6 pb-6">
//                   <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
//                     <div className="flex items-center space-x-3">
//                       <span>{article.author}</span>
//                       <span>•</span>
//                       <span>{article.date}</span>
//                     </div>
//                     <span>{article.readTime}</span>
//                   </div>

//                   {/* Engagement Stats */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4 text-xs text-gray-400">
//                       <div className="flex items-center space-x-1 hover:text-red-400 transition-colors duration-200">
//                         <span>❤️</span>
//                         <span>{article.likes}</span>
//                       </div>
//                       <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200">
//                         <span>💬</span>
//                         <span>{article.comments}</span>
//                       </div>
//                       <div className="flex items-center space-x-1 hover:text-green-400 transition-colors duration-200">
//                         <span>👀</span>
//                         <span>{article.views}</span>
//                       </div>
//                     </div>

//                     <button className="text-[#39FF14] hover:text-[#2ecc71] transition-colors duration-200 text-sm font-medium group-hover:translate-x-1 transform transition-transform duration-300">
//                       Read →
//                     </button>
//                   </div>
//                 </div>

//                 {/* Hover Effect Overlay */}
//                 <div className={`absolute inset-0 bg-gradient-to-t from-[#39FF14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className={`flex items-center justify-center space-x-4 mt-16 transition-all duration-1000 delay-300 ${
//           animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//         }`}>
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 0}
//             className="group px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-all duration-300"
//           >
//             <span className="group-hover:-translate-x-1 transition-transform duration-300 inline-block">←</span>
//             <span className="ml-2">Previous</span>
//           </button>

//           <div className="flex items-center space-x-2">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(i)}
//                 className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
//                   currentPage === i
//                     ? 'bg-[#39FF14] text-gray-900 scale-110'
//                     : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-[#39FF14]'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages - 1}
//             className="group px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-all duration-300"
//           >
//             <span>Next</span>
//             <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default LatestArticlesSection;

"use client";
import React, { useState, useEffect, useRef } from 'react';

const LatestArticlesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [flipStage, setFlipStage] = useState(0);
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
        { stage: 1, delay: 300 },   // Header fade in
        { stage: 2, delay: 600 },   // Cards slide in stacked
        { stage: 3, delay: 1200 },  // Cards spread out
        { stage: 4, delay: 1800 },  // Cards flip to show content
        { stage: 5, delay: 2300 }   // CTA button
      ];

      timeline.forEach(({ stage, delay }) => {
        setTimeout(() => setAnimationStage(stage), delay);
      });
    }
  }, [isVisible]);

  const latestArticles = [
    {
      id: 1,
      title: "React Server Components Revolution",
      excerpt: "How React Server Components are changing the game for full-stack development. Learn the patterns that will define 2024.",
      category: "React",
      author: "Sarah Chen",
      date: "2 hours ago",
      readTime: "8 min read",
      likes: 342,
      comments: 18,
      image: "⚛️",
      gradient: "from-purple-600 to-purple-800",
      isNew: true,
      trending: true,
      position: { x: -50, y: 10, rotate: -10 }
    },
    {
      id: 2,
      title: "TypeScript 5.0: Advanced Patterns",
      excerpt: "Master the latest TypeScript features with real-world examples. From const assertions to template literal types.",
      category: "TypeScript",
      author: "Michael Torres",
      date: "6 hours ago",
      readTime: "12 min read",
      likes: 567,
      comments: 31,
      image: "🔷",
      gradient: "from-cyan-600 to-cyan-800",
      isNew: true,
      trending: false,
      position: { x: 0, y: 0, rotate: 0 }
    },
    {
      id: 3,
      title: "CSS Container Queries in Practice",
      excerpt: "Responsive design just got better. Learn how container queries solve the problems grid and flexbox couldn't.",
      category: "CSS",
      author: "Emma Rodriguez",
      date: "1 day ago",
      readTime: "10 min read",
      likes: 423,
      comments: 25,
      image: "🎨",
      gradient: "from-pink-600 to-pink-800",
      isNew: false,
      trending: true,
      position: { x: 50, y: 10, rotate: 10 }
    }
  ];

  const getCardTransform = (article, index) => {
    if (animationStage < 2) {
      return 'translate(0, 20vh) rotate(0deg) scale(0.8)';
    } else if (animationStage < 3) {
      return 'translate(0, 0) rotate(0deg) scale(1)';
    } else {
      return `translate(${article.position.x}vh, ${article.position.y}vh) rotate(${article.position.rotate}deg) scale(1)`;
    }
  };

  const handleCardHover = (articleId) => {
    setHoveredCard(articleId);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen flex flex-col justify-center py-20 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#39FF14]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-medium tracking-wide">Just Published</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="text-white block mb-2">Latest</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] via-cyan-400 to-[#1e90ff]">
              Articles
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Fresh insights from the bleeding edge of web development. Three handpicked articles updated daily.
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative h-[600px] flex items-center justify-center mb-16">
          {latestArticles.map((article, index) => (
            <div
              key={article.id}
              onMouseEnter={() => handleCardHover(article.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`absolute w-80 h-96 transition-all duration-1000 ease-out cursor-pointer ${
                hoveredCard === article.id ? 'z-50 scale-110' : 'z-40'
              } ${
                animationStage >= 4 ? 'breathing-card' : ''
              }`}
              style={{
                transform: getCardTransform(article, index),
                transitionDelay: animationStage >= 2 ? `${index * 200}ms` : '0ms',
                animationDelay: animationStage >= 4 ? `${index * 0.5}s` : '0s'
              }}
            >
              <div 
                className={`w-full h-full rounded-2xl shadow-2xl transition-transform duration-700 ${
                  animationStage >= 4 ? 'rotate-y-180' : ''
                }`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transitionDelay: animationStage >= 4 ? `${index * 200}ms` : '0ms'
                }}
              >
                {/* Card Front (Before Flip) */}
                <div 
                  className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${article.gradient} flex items-center justify-center border border-white/10`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center p-8">
                    <div className="text-8xl mb-6 animate-float">
                      {article.image}
                    </div>
                    <div className="space-y-3">
                      <div className="w-20 h-1 bg-white/30 mx-auto rounded-full" />
                      <div className="w-16 h-1 bg-white/20 mx-auto rounded-full" />
                      <div className="w-24 h-1 bg-white/20 mx-auto rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Card Back (Content) */}
                <div 
                  className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${article.gradient} border border-white/10 overflow-hidden`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Content */}
                  <div className="h-full flex flex-col p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">
                            {article.category}
                          </span>
                          {article.isNew && (
                            <span className="bg-[#39FF14] text-gray-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                              NEW
                            </span>
                          )}
                          {article.trending && (
                            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1">
                              <span>🔥</span>
                            </span>
                          )}
                        </div>
                        <div className="text-2xl opacity-60">
                          {article.image}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                        {article.title}
                      </h3>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-white/90 text-sm leading-relaxed mb-6">
                        {article.excerpt}
                      </p>

                      {/* Author & Meta */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span className="font-medium">{article.author}</span>
                          <span>{article.date}</span>
                        </div>

                        {/* Engagement */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-white/70">
                            <div className="flex items-center space-x-1">
                              <span>❤️</span>
                              <span>{article.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>💬</span>
                              <span>{article.comments}</span>
                            </div>
                            <span>{article.readTime}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <button className="w-full bg-[#39FF14] text-gray-900 py-3 rounded-lg text-sm font-bold hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all duration-200 group">
                          Read Article
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

        {/* Bottom Stats & CTA */}
        <div className={`text-center transition-all duration-1000 delay-500 ${
          animationStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8 mb-8 text-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#39FF14]">142</div>
              <div className="text-sm">Total Articles</div>
            </div>
            <div className="w-px h-8 bg-gray-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#39FF14]">18</div>
              <div className="text-sm">This Month</div>
            </div>
            <div className="w-px h-8 bg-gray-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#39FF14]">89.2k</div>
              <div className="text-sm">Total Reads</div>
            </div>
          </div>

          {/* Browse All Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-[#39FF14] text-gray-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-[#2ecc71] hover:scale-105 hover:shadow-xl hover:shadow-[#39FF14]/25 transition-all duration-300">
              Browse All Articles
              <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">📚</span>
            </button>
            
            <button className="group border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-all duration-300">
              Subscribe for Updates
              <span className="ml-3 group-hover:scale-110 transition-transform duration-300">🔔</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        @keyframes breathe {
          0%, 100% {
            transform: translate(var(--card-x), var(--card-y)) rotate(var(--card-rotate)) translateY(0px);
          }
          50% {
            transform: translate(var(--card-x), var(--card-y)) rotate(var(--card-rotate)) translateY(-12px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        .breathing-card {
          --card-x: ${latestArticles[0]?.position?.x || 0}vh;
          --card-y: ${latestArticles[0]?.position?.y || 0}vh;
          --card-rotate: ${latestArticles[0]?.position?.rotate || 0}deg;
          animation: breathe 4s ease-in-out infinite;
        }
        
        .breathing-card:nth-child(2) {
          --card-x: ${latestArticles[1]?.position?.x || 0}vh;
          --card-y: ${latestArticles[1]?.position?.y || 0}vh;
          --card-rotate: ${latestArticles[1]?.position?.rotate || 0}deg;
          animation-delay: 1s;
        }
        
        .breathing-card:nth-child(3) {
          --card-x: ${latestArticles[2]?.position?.x || 0}vh;
          --card-y: ${latestArticles[2]?.position?.y || 0}vh;
          --card-rotate: ${latestArticles[2]?.position?.rotate || 0}deg;
          animation-delay: 2s;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default LatestArticlesSection;