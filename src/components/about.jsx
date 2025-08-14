"use client";
import React, { useState, useEffect, useRef } from 'react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    { 
      icon: '⚡', 
      title: 'Fast Development', 
      desc: 'Lightning-quick turnaround times' 
    },
    { 
      icon: '🎨', 
      title: 'Modern Design', 
      desc: 'Clean, contemporary interfaces' 
    },
    { 
      icon: '📱', 
      title: 'Mobile First', 
      desc: 'Responsive across all devices' 
    },
    { 
      icon: '🚀', 
      title: 'Performance', 
      desc: 'Optimized for speed & SEO' 
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Section Header */}
        <div className={`mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">About Me</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Full-Stack Developer</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
              & Problem Solver
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            I build modern web applications with clean code and thoughtful design. 
            3+ years of turning ideas into digital reality, one pixel at a time.
          </p>
        </div>

        {/* Features Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-gray-800/30 backdrop-blur-sm cursor-pointer border border-gray-700/50 rounded-xl p-6 group hover:border-[#39FF14]/30 transition-all duration-150 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-150">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className={`mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-xl font-semibold text-gray-300 mb-6">My Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind', 'MongoDB'].map((tech, index) => (
              <span
                key={tech}
                className={`bg-gray-800/50 border border-gray-600/50 px-4 py-2 cursor-pointer rounded-full text-sm text-gray-300 hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all duration-150 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#portfolio"
              className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-150 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 group"
            >
              View My Work
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-150 inline-block">👀</span>
            </a>
            
            <a
              href="#contact"
              className="bg-[#39FF14] text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-150 hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20 group"
            >
              Let's Connect
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;