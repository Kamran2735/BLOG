"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  ExternalLink, 
  Quote,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link
} from 'lucide-react';

const BlogContent = ({ contentData, blogTitle, blogUrl }) => {
  const [activeHeading, setActiveHeading] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState({});
  const [copiedCode, setCopiedCode] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);


  // Extract table of contents from content
// Updated extractTOC function to handle FAQ sections
const extractTOC = (content) => {
  const toc = [];
  content?.forEach((section, index) => {
    if (section.type === 'heading' && section.level <= 3) {
      toc.push({
        id: section.id || `heading-${index}`,
        title: section.text,
        level: section.level
      });
    }
    // Add FAQ sections to TOC
    if (section.type === 'faq') {
      toc.push({
        id: section.id || `faq-${index}`,
        title: 'Frequently Asked Questions',
        level: 2 // Treat as h2 level
      });
    }
  });
  return toc;
};

  const tableOfContents = extractTOC(contentData?.content);

  useEffect(() => {
  const calcProgress = () => {
    const el = contentRef.current;
    if (!el) return;

    const articleTop = el.offsetTop;
    const articleHeight = el.scrollHeight;
    const viewportBottom = window.scrollY + window.innerHeight;

    // How many pixels of the article have been revealed in the viewport
    const revealedPx = Math.min(
      Math.max(viewportBottom - articleTop, 0),
      articleHeight
    );

    const pct = articleHeight > 0 ? (revealedPx / articleHeight) * 100 : 0;
    setProgress(pct);
  };

  // Run on scroll & resize (layout shifts, fonts, images)
  window.addEventListener('scroll', calcProgress, { passive: true });
  window.addEventListener('resize', calcProgress);
  // Run once on mount
  calcProgress();

  return () => {
    window.removeEventListener('scroll', calcProgress);
    window.removeEventListener('resize', calcProgress);
  };
}, []);


  // Scroll spy for active heading
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3');
      let currentHeading = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
        }
      });

      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest' 
      });
    }
  };

  const copyCode = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const shareUrl = (platform) => {
    const url = encodeURIComponent(blogUrl || window.location.href);
    const title = encodeURIComponent(blogTitle || 'Check out this article');
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: blogUrl || window.location.href
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrls.copy);
    } else {
      window.open(shareUrls[platform], '_blank');
    }
    setShowShareMenu(false);
  };

  const renderContent = (section, index) => {
    const sectionId = section.id || `section-${index}`;

    switch (section.type) {
      case 'heading':
        const HeadingTag = `h${section.level}`;
        const headingClasses = {
          1: 'text-4xl font-bold text-white mb-6 mt-12',
          2: 'text-3xl font-bold text-white mb-5 mt-10',
          3: 'text-2xl font-semibold text-white mb-4 mt-8'
        };

        return (
          <HeadingTag
            key={index}
            id={sectionId}
            className={`scroll-mt-20 ${headingClasses[section.level]} hover:text-[#39FF14] transition-colors duration-300 group cursor-pointer`}
            onClick={() => scrollToHeading(sectionId)}
          >
            {section.text}
            <span className="ml-2 opacity-0 group-hover:opacity-100 text-[#39FF14] transition-opacity duration-300">#</span>
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="text-gray-300 leading-relaxed mb-6 text-lg">
            {section.text}
          </p>
        );

      case 'list':
        const ListTag = section.ordered ? 'ol' : 'ul';
        return (
          <ListTag key={index} className={`mb-6 space-y-2 text-gray-300 text-lg ${section.ordered ? 'list-decimal' : 'list-disc'} list-inside`}>
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed hover:text-white transition-colors duration-200">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="relative bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-l-4 border-[#39FF14] rounded-r-lg p-6 mb-8 backdrop-blur-sm">
            <Quote className="absolute top-4 right-4 w-8 h-8 text-[#39FF14] opacity-30" />
            <p className="text-xl text-gray-200 italic leading-relaxed mb-4">
              "{section.text}"
            </p>
            {section.author && (
              <cite className="text-sm text-gray-400 not-italic">
                — {section.author}
              </cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <div key={index} className="relative group mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              {section.language && (
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <span className="text-sm text-gray-300 font-medium">{section.language}</span>
                  <button
                    onClick={() => copyCode(section.code, index)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#39FF14] transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">
                      {copiedCode === index ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
              )}
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-300 leading-relaxed">
                  {section.code}
                </code>
              </pre>
            </div>
          </div>
        );

      case 'image':
        return (
          <figure key={index} className="mb-8">
            <div className="relative group overflow-hidden rounded-lg bg-gray-800 border border-gray-700">
              <img
                src={section.src}
                alt={section.alt || ''}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {section.caption && (
              <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
                {section.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'note':
        const noteStyles = {
          info: 'from-blue-500/20 to-blue-600/10 border-blue-500/50',
          warning: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/50',
          danger: 'from-red-500/20 to-red-600/10 border-red-500/50',
          success: 'from-green-500/20 to-green-600/10 border-green-500/50'
        };

        const noteIcons = {
          info: <Lightbulb className="w-5 h-5 text-blue-400" />,
          warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          danger: <AlertTriangle className="w-5 h-5 text-red-400" />,
          success: <CheckCircle className="w-5 h-5 text-green-400" />
        };

        return (
          <div key={index} className={`bg-gradient-to-r ${noteStyles[section.noteType || 'info']} border rounded-lg p-6 mb-8 backdrop-blur-sm`}>
            <div className="flex items-start space-x-3">
              {noteIcons[section.noteType || 'info']}
              <div className="flex-1">
                {section.title && (
                  <h4 className="font-semibold text-white mb-2">{section.title}</h4>
                )}
                <p className="text-gray-200 leading-relaxed">{section.text}</p>
              </div>
            </div>
          </div>
        );

case 'faq':
  return (
    <div key={index} className="mb-12">
      {/* Enhanced FAQ Section with decorative elements */}
      <div className="relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14]/5 via-cyan-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
        
        <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-[#39FF14]/20 to-cyan-500/20 rounded-xl border border-[#39FF14]/30">
                <Quote className="w-6 h-6 text-[#39FF14]" />
              </div>
              <h2 
                id={section.id || `faq-${index}`}
                className="text-3xl font-bold bg-gradient-to-r from-[#39FF14] to-cyan-400 bg-clip-text text-transparent scroll-mt-20"
              >
                Frequently Asked Questions
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {section.items.map((faq, faqIndex) => (
              <div key={faqIndex} className="group relative">
                <div className="bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-[#39FF14]/30 hover:shadow-lg hover:shadow-[#39FF14]/10">
                  <button
                    onClick={() => toggleFAQ(`${index}-${faqIndex}`)}
                    className="w-full flex items-center justify-between p-6 text-left transition-all duration-300 hover:bg-gray-700/20"
                  >
                    <span className="font-semibold text-white pr-4 text-lg group-hover:text-[#39FF14] transition-colors duration-300">
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        expandedFAQ[`${index}-${faqIndex}`] 
                          ? 'bg-[#39FF14]/20 text-[#39FF14] rotate-180' 
                          : 'bg-gray-700/50 text-gray-400 group-hover:bg-[#39FF14]/10 group-hover:text-[#39FF14]'
                      }`}>
                        <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                      </div>
                    </div>
                  </button>
                  
                  {/* Animated content with smooth height transition */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedFAQ[`${index}-${faqIndex}`] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-6">
                      {/* Subtle separator line */}
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-4"></div>
                      
                      {/* Answer content with slide-in animation */}
                      <div className={`transform transition-all duration-500 ease-out ${
                        expandedFAQ[`${index}-${faqIndex}`] 
                          ? 'translate-y-0 opacity-100' 
                          : 'translate-y-2 opacity-0'
                      }`}>
                        <p className="text-gray-300 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle glow effect for expanded items */}
                {expandedFAQ[`${index}-${faqIndex}`] && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#39FF14]/5 to-cyan-500/5 rounded-xl blur-xl opacity-50 pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom decorative element */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
      case 'tldr':
        return (
          <div key={index} className="bg-gradient-to-r from-[#39FF14]/20 to-cyan-500/10 border border-[#39FF14]/50 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h4 className="font-bold text-[#39FF14] mb-4 text-lg">TL;DR</h4>
            <ul className="space-y-2 text-gray-200">
              {section.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#39FF14] mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'tags':
        return (
          <div key={index} className="flex flex-wrap gap-3 mb-8">
            {section.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="bg-gray-800/50 border border-gray-700/50 text-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all duration-300 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Sample content data structure for demonstration
  const sampleContent = contentData?.content || [
    {
      type: 'heading',
      level: 1,
      text: 'Introduction to Modern Web Development',
      id: 'introduction'
    },
    {
      type: 'paragraph',
      text: 'Web development has evolved significantly over the past decade. Modern frameworks and tools have revolutionized how we build applications, making development faster, more efficient, and more scalable than ever before.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Key Technologies',
      id: 'key-technologies'
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'React for building user interfaces',
        'Next.js for full-stack applications',
        'TypeScript for type safety',
        'Tailwind CSS for styling',
        'Node.js for backend development'
      ]
    },
    {
      type: 'quote',
      text: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `const greeting = (name) => {
  return \`Hello, \${name}! Welcome to modern web development.\`;
};

console.log(greeting('Developer'));`
    },
    {
      type: 'note',
      noteType: 'info',
      title: 'Pro Tip',
      text: 'Always keep learning and experimenting with new technologies to stay ahead in the rapidly evolving web development landscape.'
    },
    {
      type: 'tldr',
      points: [
        'Modern web development is faster and more efficient',
        'Key technologies include React, Next.js, and TypeScript',
        'Continuous learning is essential for success'
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article ref={contentRef} className="prose prose-invert prose-lg max-w-none">
              {sampleContent.map((section, index) => renderContent(section, index))}
            </article>

            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Found this helpful?</h4>
                  <p className="text-gray-400 text-sm">Share it with your network!</p>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="bg-[#39FF14] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#2ecc71] transition-colors duration-300 flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-2 min-w-40 z-50">
                      <button
                        onClick={() => shareUrl('twitter')}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-700 rounded text-sm transition-colors duration-200"
                      >
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => shareUrl('facebook')}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-700 rounded text-sm transition-colors duration-200"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => shareUrl('linkedin')}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-700 rounded text-sm transition-colors duration-200"
                      >
                        <Linkedin className="w-4 h-4 text-blue-500" />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={() => shareUrl('copy')}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-700 rounded text-sm transition-colors duration-200"
                      >
                        <Link className="w-4 h-4 text-gray-400" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-20">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  <span className="w-2 h-2 bg-[#39FF14] rounded-full mr-3"></span>
                  Table of Contents
                </h4>
                
                <nav className="space-y-2">
                  {tableOfContents.map((heading, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToHeading(heading.id)}
                      className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                        activeHeading === heading.id
                          ? 'bg-[#39FF14]/20 text-[#39FF14] border-l-2 border-[#39FF14]'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      } ${
                        heading.level === 2 ? 'ml-4' : heading.level === 3 ? 'ml-8' : ''
                      }`}
                    >
                      {heading.title}
                    </button>
                  ))}
                </nav>

{/* Reading Progress */}
<div className="mt-8 pt-6 border-t border-gray-700">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-gray-400">Reading Progress</span>
    <span className="text-sm text-[#39FF14] font-medium">
      {Math.round(progress)}%
    </span>
  </div>
  <div className="w-full bg-gray-700 rounded-full h-2">
    <div
      className="bg-gradient-to-r from-[#39FF14] to-cyan-400 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.round(progress)}%` }}
    />
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;