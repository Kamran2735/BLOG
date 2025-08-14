"use client";
import React, { useState, useEffect, useRef } from 'react';

const PhilosophySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeProcess, setActiveProcess] = useState(0);
  const [hoveredValue, setHoveredValue] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate through process steps
  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setActiveProcess((prev) => (prev + 1) % processSteps.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const coreValues = [
    {
      icon: '🎯',
      title: 'User-Centered Design',
      description: 'Every line of code serves the end user. I prioritize intuitive interfaces and seamless experiences.',
      color: 'from-blue-500 to-cyan-400',
      details: ['Accessibility first', 'Mobile responsive', 'Performance optimized']
    },
    {
      icon: '🔧',
      title: 'Clean Code Philosophy',
      description: 'Writing maintainable, scalable code that future developers (including me) will thank me for.',
      color: 'from-green-500 to-emerald-400',
      details: ['Well documented', 'Tested thoroughly', 'Follows best practices']
    },
    {
      icon: '⚡',
      title: 'Continuous Learning',
      description: 'Technology evolves fast, and so do I. Always exploring new tools and methodologies.',
      color: 'from-purple-500 to-pink-400',
      details: ['Stay updated', 'Experiment safely', 'Share knowledge']
    },
    {
      icon: '🤝',
      title: 'Collaborative Approach',
      description: 'Great products come from great teamwork. I believe in transparent communication and shared success.',
      color: 'from-orange-500 to-yellow-400',
      details: ['Regular updates', 'Client feedback', 'Team synergy']
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'Understanding your vision, goals, and requirements through detailed discussions and research.',
      icon: '🔍',
      color: 'from-blue-500 to-cyan-400',
      activities: ['Requirement analysis', 'Technical planning', 'Timeline creation', 'Resource allocation']
    },
    {
      step: '02',
      title: 'Design & Prototype',
      description: 'Creating wireframes, mockups, and interactive prototypes to visualize the final product.',
      icon: '🎨',
      color: 'from-purple-500 to-pink-400',
      activities: ['UI/UX design', 'Interactive prototypes', 'Client feedback', 'Design refinement']
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Building the application with clean, scalable code and rigorous testing throughout.',
      icon: '⚙️',
      color: 'from-green-500 to-emerald-400',
      activities: ['Agile development', 'Code reviews', 'Testing automation', 'Performance optimization']
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'Deploying to production and providing ongoing support to ensure everything runs smoothly.',
      icon: '🚀',
      color: 'from-orange-500 to-red-500',
      activities: ['Production deployment', 'Performance monitoring', 'Bug fixes', 'Feature updates']
    }
  ];

  const principles = [
    { icon: '💡', text: 'Innovation over convention' },
    { icon: '🎯', text: 'Quality over quantity' },
    { icon: '⚡', text: 'Performance over complexity' },
    { icon: '🔒', text: 'Security by design' },
    { icon: '📱', text: 'Mobile-first approach' },
    { icon: '♿', text: 'Accessibility for all' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">My Philosophy</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">How I </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
              Approach Development
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            My development philosophy centers around creating meaningful, user-focused solutions through collaboration, clean code, and continuous innovation.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className={`mb-20 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-3xl font-bold text-white mb-12 text-center">
            Core Values
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className={`group cursor-pointer transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${500 + index * 200}ms` }}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full hover:border-[#39FF14]/50 hover:bg-gray-700/20 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#39FF14] transition-colors duration-300">
                        {value.title}
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Always Visible Details */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-700/30">
                    {value.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Process */}
        <div className={`mb-20 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-3xl font-bold text-white mb-12 text-center">
            Development Process
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Process Steps */}
            <div className="space-y-6">
              {processSteps.map((process, index) => (
                <div
                  key={process.step}
                  className={`group cursor-pointer transition-all duration-500 ${
                    activeProcess === index ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  onClick={() => setActiveProcess(index)}
                >
                  <div className={`bg-gray-800/30 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                    activeProcess === index 
                      ? 'border-[#39FF14]/50 bg-gray-700/30' 
                      : 'border-gray-700/50 hover:border-gray-600/50'
                  }`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${process.color} rounded-xl flex items-center justify-center flex-shrink-0 ${
                        activeProcess === index ? 'scale-110' : ''
                      } transition-transform duration-300`}>
                        <span className="text-2xl">{process.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`text-sm font-bold px-2 py-1 rounded ${
                            activeProcess === index ? 'bg-[#39FF14] text-gray-900' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {process.step}
                          </span>
                          <h4 className={`text-lg font-bold transition-colors duration-300 ${
                            activeProcess === index ? 'text-[#39FF14]' : 'text-white'
                          }`}>
                            {process.title}
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {process.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Always Visible Process Activities */}
                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="grid grid-cols-2 gap-2">
                        {process.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className="flex items-center space-x-2 text-xs text-gray-400">
                            <div className="w-1 h-1 bg-[#39FF14] rounded-full" />
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Visual Process Indicator */}
            <div className="relative">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${processSteps[activeProcess].color} rounded-2xl flex items-center justify-center mb-4 transform transition-all duration-500 hover:scale-110 hover:rotate-3`}>
                    <span className="text-4xl">{processSteps[activeProcess].icon}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {processSteps[activeProcess].title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {processSteps[activeProcess].description}
                  </p>
                </div>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-4">
                  {processSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-1 rounded-full transition-all duration-300 ${
                        index <= activeProcess ? 'bg-[#39FF14]' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <span className="text-[#39FF14] font-bold">
                    Step {activeProcess + 1} of {processSteps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Principles */}
        <div className={`mb-20 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center">
              <span className="w-3 h-3 bg-[#39FF14] rounded-full mr-3 animate-pulse" />
              Design Principles
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {principles.map((principle, index) => (
                <div
                  key={principle.text}
                  className={`text-center p-4 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:border-[#39FF14]/50 hover:bg-gray-700/50 transition-all duration-300 cursor-default group ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${1000 + index * 100}ms` }}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {principle.icon}
                  </div>
                  <p className="text-xs text-gray-300 group-hover:text-[#39FF14] transition-colors duration-300">
                    {principle.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Quote/Testimonial */}
        <div className={`text-center transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-6xl text-[#39FF14] mb-6 opacity-50">"</div>
              <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 leading-relaxed italic">
                Code is like humor. When you have to explain it, it's bad.
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#39FF14] to-[#1e90ff] rounded-full flex items-center justify-center">
                  <span className="text-xl">💭</span>
                </div>
                <div className="text-left">
                  <p className="text-gray-300 font-medium">My Development Mantra</p>
                  <p className="text-gray-500 text-sm">Keep it simple, make it work, make it beautiful</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;