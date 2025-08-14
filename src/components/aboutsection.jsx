"use client";
import React, { useState, useEffect, useRef } from 'react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [skillsAnimated, setSkillsAnimated] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setSkillsAnimated(true), 1000);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Rotate between different visual states
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const skills = [
    { name: 'React/Next.js', level: 95, color: 'from-blue-500 to-cyan-400', icon: '⚛️' },
    { name: 'JavaScript', level: 90, color: 'from-blue-600 to-blue-400', icon: '📘' },
    { name: 'Node.js', level: 85, color: 'from-green-500 to-emerald-400', icon: '🟢' },
    { name: 'UI/UX Design', level: 80, color: 'from-purple-500 to-pink-400', icon: '🎨' },
    { name: 'Cloud/DevOps', level: 75, color: 'from-orange-500 to-yellow-400', icon: '☁️' }
  ];

  const stats = [
    { number: '50+', label: 'Projects Completed', icon: '🚀', detail: 'Web & Mobile' },
    { number: '3+', label: 'Years Experience', icon: '⏰', detail: 'Full-Stack Dev' },
    { number: '15+', label: 'Happy Clients', icon: '😊', detail: 'Worldwide' },
    { number: '99%', label: 'Success Rate', icon: '💯', detail: 'On-Time Delivery' }
  ];

  const journey = [
    { year: '2021', title: 'Started Journey', desc: 'First line of code' },
    { year: '2022', title: 'First Project', desc: 'Built my first web app' },
    { year: '2023', title: 'Freelancing', desc: 'Started helping clients' },
    { year: '2024', title: 'Full-Stack', desc: 'Mastered end-to-end development' }
  ];

  const tools = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 
    'AWS', 'Docker', 'Git', 'Figma', 'Tailwind', 'Three.js'
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Hero Introduction */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">About Me</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-white mb-2">Hi, I'm a</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
              Full-Stack Developer
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate about crafting exceptional digital experiences through clean code, innovative solutions, and user-centered design.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Left - Story & CTA */}
          <div className={`lg:col-span-2 space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {/* Personal Story */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#39FF14] to-[#1e90ff] rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <h2 className="text-2xl font-bold text-white">My Story</h2>
              </div>
              
              <div className="prose prose-lg text-gray-300 space-y-4">
                <p className="text-lg leading-relaxed">
                  My journey into web development started with a simple question: "How do websites actually work?" 
                  That curiosity led me down a rabbit hole of HTML, CSS, and JavaScript that I'm still exploring today.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Over the past 3+ years, I've evolved from writing my first "Hello World" to building full-stack 
                  applications that serve thousands of users. I specialize in React ecosystems, but I'm always 
                  excited to learn new technologies that solve real problems.
                </p>
                
                <p className="text-lg leading-relaxed">
                  What drives me isn't just the code—it's the impact. Whether it's helping a small business 
                  reach new customers or building tools that make developers' lives easier, I believe technology 
                  should serve people, not the other way around.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center space-x-2 bg-[#39FF14] text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20 group"
                >
                  <span>Let's Work Together</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
                <a
                  href="/resume.pdf"
                  className="inline-flex items-center justify-center space-x-2 border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 group"
                >
                  <span>Download Resume</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">📄</span>
                </a>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="w-3 h-3 bg-[#39FF14] rounded-full mr-3 animate-pulse" />
                My Journey
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {journey.map((item, index) => (
                  <div 
                    key={item.year}
                    className={`text-center transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${800 + index * 150}ms` }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-[#39FF14]/30">
                      <span className="text-[#39FF14] font-bold">{item.year}</span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates Section */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="w-3 h-3 bg-[#39FF14] rounded-full mr-3 animate-pulse" />
                Certifications & Achievements
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'React Developer Certification',
                    issuer: 'Meta',
                    date: '2024',
                    verified: true,
                    color: 'from-blue-500 to-cyan-400'
                  },
                  {
                    title: 'AWS Cloud Practitioner',
                    issuer: 'Amazon Web Services',
                    date: '2023',
                    verified: true,
                    color: 'from-orange-500 to-yellow-400'
                  },
                  {
                    title: 'Full Stack Web Development',
                    issuer: 'freeCodeCamp',
                    date: '2023',
                    verified: true,
                    color: 'from-green-500 to-emerald-400'
                  },
                  {
                    title: 'JavaScript Algorithms & Data Structures',
                    issuer: 'freeCodeCamp',
                    date: '2022',
                    verified: true,
                    color: 'from-purple-500 to-pink-400'
                  }
                ].map((cert, index) => (
                  <div 
                    key={cert.title}
                    className={`group cursor-pointer transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${1000 + index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-700/30 border border-gray-600/30 hover:border-[#39FF14]/50 hover:bg-gray-700/50 transition-all duration-300">
                      {/* Certificate Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${cert.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white text-xl">🏆</span>
                      </div>
                      
                      {/* Certificate Info */}
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-white font-semibold group-hover:text-[#39FF14] transition-colors duration-300">
                            {cert.title}
                          </h4>
                          {cert.verified && (
                            <div className="flex items-center space-x-1">
                              <div className="w-4 h-4 bg-[#39FF14] rounded-full flex items-center justify-center">
                                <span className="text-gray-900 text-xs font-bold">✓</span>
                              </div>
                              <span className="text-[#39FF14] text-xs font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{cert.issuer}</p>
                      </div>
                      
                      {/* Date */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-gray-500 text-sm">{cert.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View All Certificates Link */}
              <div className="mt-6 text-center">
                <a
                  href="#certificates"
                  className="inline-flex items-center space-x-2 text-[#39FF14] hover:text-[#2ecc71] transition-colors duration-300 group"
                >
                  <span>View All Certificates</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right - Skills & Stats */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            {/* Animated Profile Card */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
              <div className="relative mb-6">
                <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br transition-all duration-1000 ${
                  currentImageIndex === 0 ? 'from-[#39FF14] to-[#1e90ff]' :
                  currentImageIndex === 1 ? 'from-purple-500 to-pink-500' :
                  'from-orange-500 to-red-500'
                } flex items-center justify-center transform hover:scale-105 hover:rotate-3`}>
                  <span className="text-4xl">
                    {currentImageIndex === 0 ? '👨‍💻' : currentImageIndex === 1 ? '🚀' : '⚡'}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#39FF14] rounded-full animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Available for Work</h3>
              <p className="text-gray-400 text-sm mb-4">Remote • Full-time • Contract</p>
              <div className="flex items-center justify-center space-x-1 text-[#39FF14]">
                <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
                <span className="text-sm">Online now</span>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-[#39FF14] rounded-full mr-3 animate-pulse" />
                Technical Skills
              </h3>
              
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{skill.icon}</span>
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                      </div>
                      <span className="text-[#39FF14] font-bold text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1200 ease-out relative`}
                        style={{
                          width: skillsAnimated ? `${skill.level}%` : '0%',
                          transitionDelay: skillsAnimated ? `${index * 200}ms` : '0ms'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                  <span
                    key={tool}
                    className={`px-3 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-sm text-gray-300 transition-all duration-300 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 cursor-default ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: `${1000 + index * 50}ms` }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mb-20 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center group hover:border-[#39FF14]/30 hover:scale-105 transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${1200 + index * 100}ms` }}
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#39FF14] mb-1">{stat.number}</div>
                <div className="text-sm text-gray-300 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-10">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">Let's Build Something Amazing</h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Have an idea that needs bringing to life? I'd love to hear about your project and explore how we can work together to create something exceptional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#projects"
                  className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 group"
                >
                  View My Work
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">👀</span>
                </a>
                <a
                  href="#contact"
                  className="bg-[#39FF14] text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20 group"
                >
                  Start a Project
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">🚀</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;