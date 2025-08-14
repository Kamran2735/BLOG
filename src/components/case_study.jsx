"use client";
import React, { useState, useEffect, useRef } from 'react';

const CaseStudySection = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const timeline = [
        { stage: 1, delay: 800 },   // Move cards up to center
        { stage: 2, delay: 1800 },  // Scatter to grid positions
        { stage: 3, delay: 2800 },  // Flip cards to show content
        { stage: 4, delay: 3300 }   // Show section content
      ];

      timeline.forEach(({ stage, delay }) => {
        setTimeout(() => setAnimationStage(stage), delay);
      });
    }
  }, [isVisible]);

  const caseStudies = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Full-Stack",
      description: "Modern shopping experience with real-time inventory and seamless checkout flow.",
      tech: ["Next.js", "Stripe", "PostgreSQL"],
      image: "🛒",
      color: "from-purple-600 to-purple-800",
      gridPosition: { x: -60, y: 0 }
    },
    {
      id: 2,
      title: "Dashboard Analytics",
      category: "React App",
      description: "Real-time data visualization with interactive charts and customizable widgets.",
      tech: ["React", "D3.js", "WebSocket"],
      image: "📊",
      color: "from-purple-600 to-purple-800",
      gridPosition: { x: -20, y: 0 }
    },
    {
      id: 3,
      title: "Mobile Banking App",
      category: "Fintech",
      description: "Secure financial transactions with biometric authentication and smart notifications.",
      tech: ["React Native", "Node.js", "MongoDB"],
      image: "💳",
      color: "from-pink-600 to-pink-800",
      gridPosition: { x: 20, y: 0 }
    },
    {
      id: 4,
      title: "Social Media Platform",
      category: "Social App",
      description: "Real-time messaging and content sharing with advanced privacy controls.",
      tech: ["Vue.js", "Socket.io", "Redis"],
      image: "💬",
      color: "from-cyan-600 to-cyan-800",
      gridPosition: { x: 60, y: 0 }
    }
  ];

  const getCardTransform = (card, index) => {
    if (animationStage === 0) {
      // Initial poker hand position at bottom
      const cardWidth = 12; // rem
      const overlap = 8; // rem
      const totalWidth = (caseStudies.length - 1) * overlap + cardWidth;
      const startX = -(totalWidth / 2) + (index * overlap) + 10;
      const rotation = (index - (caseStudies.length - 1) / 2) * 10; // Slight fan effect
      
      return `translate(${startX}rem, 20rem) rotate(${rotation}deg)`;
    } else if (animationStage === 1) {
      // Move to center, still stacked
      return `translate(0, 0) rotate(0deg)`;
    } else {
      // Scatter to grid positions
      return `translate(${card.gridPosition.x}vh, ${card.gridPosition.y}vh) rotate(0deg)`;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen flex flex-col justify-center py-20 overflow-visible"
    >

      <div className="relative w-full">
        {/* Section Header */}
        <div className={`text-center mb-16 px-6 transition-all duration-1000 ${
          animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Featured Work</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Case</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff] ml-3">
              Studies
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real projects, real results. Here's how I've helped businesses solve complex challenges with elegant solutions.
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative w-full h-96 flex items-center justify-center">
          {caseStudies.map((card, index) => (
            <div
              key={card.id}
              className="absolute w-72 h-96 transition-all duration-1000 ease-out cursor-pointer"
              style={{
                transform: getCardTransform(card, index),
                zIndex: animationStage >= 2 ? 10 - index : 10 + index,
                transitionDelay: animationStage === 1 ? `${index * 150}ms` : 
                                animationStage === 2 ? `${index * 200}ms` : '0ms'
              }}
            >
              <div 
                className={`w-full h-full rounded-xl shadow-2xl transition-transform duration-700 ${
                  animationStage >= 3 ? 'rotate-y-180' : ''
                }`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transitionDelay: animationStage >= 3 ? `${index * 150}ms` : '0ms'
                }}
              >
                {/* Card Front (Back of card) */}
                <div 
                  className={`absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center border border-white/10`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">{card.image}</div>
                    <div className="w-16 h-1 bg-white/30 mx-auto rounded-full mb-4" />
                    <div className="w-12 h-1 bg-white/20 mx-auto rounded-full mb-2" />
                    <div className="w-20 h-1 bg-white/20 mx-auto rounded-full" />
                  </div>
                </div>

                {/* Card Back (Content) */}
                <div 
                  className={`absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br ${card.color} p-6 border border-white/10`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="h-full flex flex-col">
                    <div className="text-center mb-4">
                      <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-3">
                        {card.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-white/90 text-sm leading-relaxed mb-6 text-center">
                        {card.description}
                      </p>
                      
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {card.tech.map((tech) => (
                            <span 
                              key={tech}
                              className="bg-white/20 text-white text-xs px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button className="bg-[#39FF14] text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2ecc71] transition-colors duration-150">
                        View Project →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 px-6 transition-all duration-1000 delay-500 ${
          animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <a
            href="#portfolio"
            className="inline-flex items-center space-x-2 border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-150 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 group"
          >
            <span>View All Projects</span>
            <span className="group-hover:translate-x-1 transition-transform duration-150">→</span>
          </a>
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

export default CaseStudySection;