"use client";
import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const [rotatingWord, setRotatingWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const rotatingWords = ['Creativity', 'Innovation', 'Solutions'];

  useEffect(() => {
    const timeline = [
      { stage: 1, delay: 500 },   // Start scattering
      { stage: 2, delay: 2000 },  // Flip cards
      { stage: 3, delay: 2500 }   // Show text
    ];

    timeline.forEach(({ stage, delay }) => {
      setTimeout(() => setAnimationStage(stage), delay);
    });
  }, []);

  // Rotating word animation
  useEffect(() => {
    if (animationStage >= 3) {
      const currentWord = rotatingWords[wordIndex];
      
      if (isTyping) {
        // Typing effect
        if (rotatingWord.length < currentWord.length) {
          const timer = setTimeout(() => {
            setRotatingWord(currentWord.slice(0, rotatingWord.length + 1));
          }, 150);
          return () => clearTimeout(timer);
        } else {
          // Word is fully typed, wait then start erasing
          const timer = setTimeout(() => {
            setIsTyping(false);
          }, 2000);
          return () => clearTimeout(timer);
        }
      } else {
        // Erasing effect
        if (rotatingWord.length > 0) {
          const timer = setTimeout(() => {
            setRotatingWord(rotatingWord.slice(0, -1));
          }, 100);
          return () => clearTimeout(timer);
        } else {
          // Word is fully erased, move to next word
          setWordIndex((prev) => (prev + 1) % rotatingWords.length);
          setIsTyping(true);
        }
      }
    }
  }, [animationStage, rotatingWord, wordIndex, isTyping, rotatingWords]);

  const cards = [
    { 
      id: 1, 
      title: "React Magic", 
      content: "Modern UI/UX", 
      position: { x: -70, y: -25, rotate: 30 },
      color: "from-purple-600 to-purple-800"
    },
    { 
      id: 2, 
      title: "Next.js Power", 
      content: "Full-Stack Apps", 
      position: { x: 70, y: -25, rotate: -30 },
      color: "from-blue-600 to-blue-800"
    },
    { 
      id: 3, 
      title: "Mobile First", 
      content: "Responsive Design", 
      position: { x: -70, y: 25, rotate: -30 },
      color: "from-pink-600 to-pink-800"
    },
    { 
      id: 4, 
      title: "Performance", 
      content: "Lightning Fast", 
      position: { x: 70, y: 25, rotate: 30 },
      color: "from-cyan-600 to-cyan-800"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen flex items-center justify-center overflow-hidden pt-10">

      {/* Cards Container */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`absolute w-48 h-64 transition-all duration-1000 ease-out cursor-pointer ${
              animationStage >= 2 ? 'breathing-card' : ''
            }`}
            style={{
              '--card-x': animationStage >= 1 ? `${card.position.x}vh` : '0vh',
              '--card-y': animationStage >= 1 ? `${card.position.y}vh` : '0vh',
              '--card-rotate': animationStage >= 1 ? `${card.position.rotate}deg` : '0deg',
              transform: animationStage >= 1 
                ? `translate(${card.position.x}vh, ${card.position.y}vh) rotate(${card.position.rotate}deg)` 
                : `translate(0, 0) rotate(0deg)`,
              zIndex: animationStage >= 1 ? 10 - index : 10 + index,
              transitionDelay: animationStage >= 1 ? `${index * 100}ms` : '0ms',
              animationDelay: animationStage >= 2 ? `${index * 0.5}s` : '0s'
            }}
          >
            <div 
              className={`w-full h-full rounded-xl shadow-2xl transition-transform duration-700 ${
                animationStage >= 2 ? 'rotate-y-180' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                transitionDelay: animationStage >= 2 ? `${index * 150}ms` : '0ms'
              }}
            >
              {/* Card Front */}
              <div 
                className={`absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center border border-white/10`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                </div>
              </div>

              {/* Card Back */}
              <div 
                className={`absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center border border-white/10`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-white/90 text-sm mb-4">{card.content}</p>
                  <div className="w-12 h-1 bg-[#39FF14] mx-auto rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Center Text Content */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-1000 ${
            animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: animationStage >= 3 ? '300ms' : '0ms' }}
        >
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Weekly Tech Insights</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block text-white mb-2">Where Code Meets</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff] min-h-[1.2em] inline-block">
                {rotatingWord}
                <span className="animate-pulse text-[#39FF14] ml-1">|</span>
              </span>
            </h1>

            {/* Subtitle (No typewriter effect here) */}
            <div className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed min-h-[3.5rem] flex items-center justify-center">
              <p>
                Dive into the world of modern web development through detailed case studies, tutorials, and industry insights that transform complex concepts into actionable knowledge.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#posts"
                className="bg-[#39FF14] text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20 group"
              >
                Read Latest Posts
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
              </a>
              
              <a
                href="#subscribe"
                className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 group"
              >
                Subscribe to Newsletter
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">📧</span>
              </a>
            </div>
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
            transform: translate(var(--card-x), var(--card-y)) rotate(var(--card-rotate)) translateY(-8px);
          }
        }
        
        .breathing-card {
          animation: breathe 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;