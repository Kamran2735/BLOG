"use client";
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Globe,
  BookOpen,
  Users,
  Award
} from 'lucide-react';

const BlogAuthor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [hoveredSocial, setHoveredSocial] = useState('');

  useEffect(() => {
    setIsVisible(true);
    const timeline = [
      { stage: 1, delay: 300 },   // Author info
      { stage: 2, delay: 600 },   // Stats
      { stage: 3, delay: 900 },   // Skills
      { stage: 4, delay: 1200 }   // Social links
    ];

    timeline.forEach(({ stage, delay }) => {
      setTimeout(() => setAnimationStage(stage), delay);
    });
  }, []);

  // Author data - customize this
  const authorData = {
    name: "Kamran Khan",
    title: "Full-Stack Developer & Tech Writer",
    bio: "Passionate about modern web technologies and creating developer-friendly content. I love breaking down complex concepts into digestible tutorials that help developers level up their skills.",
avatar: "/avatar.jpg",
    location: "San Francisco, CA",
    joinDate: "2018-03-15",
    website: "https://kamrankhan.dev",
    social: {
      twitter: "https://twitter.com/kamrankhan_dev",
      github: "https://github.com/kamrankhan",
      linkedin: "https://linkedin.com/in/kamrankhan"
    },
    stats: {
      articles: 47,
      followers: "2.4k",
      experience: "6+ Years"
    },
    skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "GraphQL", "CSS", "JavaScript"]
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const socialIcons = {
    twitter: <Twitter className="w-5 h-5" />,
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="lg:grid lg:grid-cols-1 lg:gap-12">
          {/* Author Card - Following the same structure as main content */}
          <article className="prose prose-invert prose-lg max-w-none">
            {/* About the Author Section - matches the gradient style from FAQ */}
            <div className="mb-12">
              <div className="relative">
               
                <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-r from-[#39FF14]/20 to-cyan-500/20 rounded-xl border border-[#39FF14]/30">
                        <Users className="w-6 h-6 text-[#39FF14]" />
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#39FF14] to-cyan-400 bg-clip-text text-transparent">
                        About the Author
                      </h2>
                    </div>
                  </div>

                  {/* Author Info - using same spacing as main content */}
                  <div className={`mb-8 transition-all duration-1000 ${
                    animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
                      {/* Avatar */}
                      <div className="relative group">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-[#39FF14]/30 group-hover:border-[#39FF14] group-hover:shadow-lg group-hover:shadow-[#39FF14]/25 transition-all duration-500">
                          <img
                            src={authorData.avatar}
                            alt={authorData.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        {/* Online Status */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#39FF14] rounded-full border-4 border-gray-900 animate-pulse">
                          <div className="w-full h-full bg-[#39FF14] rounded-full animate-ping" />
                        </div>
                      </div>

                      {/* Author Details */}
                      <div className="flex-1">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                          <span className="text-white">{authorData.name.split(' ')[0]}</span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-cyan-400 ml-2">
                            {authorData.name.split(' ').slice(1).join(' ')}
                          </span>
                        </h3>
                        
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 font-medium mb-4 text-lg">
                          {authorData.title}
                        </p>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                          <div className="flex items-center space-x-2 hover:text-[#39FF14] transition-colors duration-300">
                            <MapPin className="w-4 h-4" />
                            <span>{authorData.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 hover:text-[#39FF14] transition-colors duration-300">
                            <Calendar className="w-4 h-4" />
                            <span>Since {formatJoinDate(authorData.joinDate)}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed text-lg">
                          {authorData.bio}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section - matching the card grid style */}
                  <div className={`mb-8 transition-all duration-1000 delay-300 ${
                    animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-[#39FF14]/50 hover:bg-gray-700/30 transition-all duration-300 text-center">
                        <BookOpen className="w-6 h-6 text-[#39FF14] mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-xl font-bold text-[#39FF14] mb-1 group-hover:scale-105 transition-transform duration-300">
                          {authorData.stats.articles}
                        </div>
                        <div className="text-xs text-gray-400">Articles</div>
                      </div>
                      
                      <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-[#39FF14]/50 hover:bg-gray-700/30 transition-all duration-300 text-center">
                        <Users className="w-6 h-6 text-[#39FF14] mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-xl font-bold text-[#39FF14] mb-1 group-hover:scale-105 transition-transform duration-300">
                          {authorData.stats.followers}
                        </div>
                        <div className="text-xs text-gray-400">Followers</div>
                      </div>
                      
                      <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-[#39FF14]/50 hover:bg-gray-700/30 transition-all duration-300 text-center">
                        <Award className="w-6 h-6 text-[#39FF14] mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-lg font-bold text-[#39FF14] mb-1 group-hover:scale-105 transition-transform duration-300">
                          {authorData.stats.experience}
                        </div>
                        <div className="text-xs text-gray-400">Experience</div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section - matching tags style */}
                  <div className={`mb-8 transition-all duration-1000 delay-600 ${
                    animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="w-2 h-2 bg-[#39FF14] rounded-full mr-3 animate-pulse"></span>
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {authorData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-800/50 border border-gray-700/50 text-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all duration-300 cursor-pointer"
                          style={{ 
                            transitionDelay: `${index * 50}ms`
                          }}
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links & Website - matching share section style */}
                  <div className={`transition-all duration-1000 delay-900 ${
                    animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Connect with me</h4>
                        <p className="text-gray-400 text-sm">Let's discuss tech and share ideas!</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Social Links */}
                        {Object.entries(authorData.social).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => setHoveredSocial(platform)}
                            onMouseLeave={() => setHoveredSocial('')}
                            className={`group p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-400 hover:border-[#39FF14]/50 hover:text-[#39FF14] hover:bg-gray-700/30 hover:scale-110 transition-all duration-300 ${
                              hoveredSocial === platform ? 'shadow-lg shadow-[#39FF14]/25' : ''
                            }`}
                          >
                            <div className="group-hover:scale-110 transition-transform duration-300">
                              {socialIcons[platform]}
                            </div>
                          </a>
                        ))}
                        
                        {/* Website Link - matching share button style */}
                        <a
                          href={authorData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-[#39FF14] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#2ecc71] transition-colors duration-300 flex items-center space-x-2"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Visit Website</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bottom decorative element - matching FAQ */}
                  <div className="flex justify-center mt-8">
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogAuthor;